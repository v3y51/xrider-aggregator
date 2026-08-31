"""
Feed Ingestion Orchestrator
Adım 4: Satıcı feed'ini indir → parse et → raw_offers tablosuna yaz
"""

import os
from datetime import datetime
from typing import Optional

import structlog
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.services.ingestion.feed_parser import (
    download_feed,
    generate_batch_id,
    parse_csv_feed,
    parse_xml_feed,
)

logger = structlog.get_logger()

DATABASE_URL_SYNC = os.getenv(
    "DATABASE_URL_SYNC",
    "postgresql+psycopg2://xrider:xrider_dev_pass@localhost:5432/xrider",
)

engine = create_engine(DATABASE_URL_SYNC, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)


# ─────────────────────────────────────────────────────────────────────────────
# Ana ingestion fonksiyonu (sync — Celery task'lardan çağrılır)
# ─────────────────────────────────────────────────────────────────────────────

def ingest_seller_feed(seller_id: int) -> dict:
    """
    Bir satıcının feed'ini indir ve raw_offers'a yaz.
    
    Returns:
        {
            "seller_id": ...,
            "batch_id": ...,
            "inserted": ...,
            "skipped": ...,
            "errors": [...]
        }
    """
    db: Session = SessionLocal()
    result = {
        "seller_id": seller_id,
        "batch_id": None,
        "inserted": 0,
        "skipped": 0,
        "errors": [],
    }

    try:
        # Satıcı bilgilerini çek
        seller_row = db.execute(
            text("""
                SELECT id, name, feed_url, feed_format, status
                FROM sellers
                WHERE id = :id
            """),
            {"id": seller_id},
        ).fetchone()

        if not seller_row:
            raise ValueError(f"Satıcı bulunamadı: {seller_id}")

        if seller_row.status != "active":
            logger.info("Satıcı aktif değil, atlanıyor", seller_id=seller_id, status=seller_row.status)
            return result

        batch_id = generate_batch_id(seller_id)
        result["batch_id"] = batch_id

        logger.info(
            "Feed indirme başlatıldı",
            seller_id=seller_id,
            seller_name=seller_row.name,
            feed_url=seller_row.feed_url,
            batch_id=batch_id,
        )

        # Feed'i indir — mock feed için local dosya desteği
        if seller_row.feed_url.startswith("file://"):
            # Local test modunda — mock-feeds dizininden oku
            file_path = seller_row.feed_url.replace("file://", "")
            with open(file_path, "rb") as f:
                content = f.read()
        else:
            import asyncio
            content = asyncio.run(download_feed(seller_row.feed_url))

        # Format'a göre parse
        feed_format = seller_row.feed_format or "xml"
        if feed_format == "xml":
            valid_offers, error_log = parse_xml_feed(content, seller_id, batch_id)
        elif feed_format == "csv":
            valid_offers, error_log = parse_csv_feed(content, seller_id, batch_id)
        else:
            raise ValueError(f"Desteklenmeyen feed formatı: {feed_format}")

        # raw_offers tablosuna toplu yaz
        if valid_offers:
            _bulk_insert_raw_offers(db, valid_offers)
            result["inserted"] = len(valid_offers)

        result["skipped"] = len(error_log)
        result["errors"] = error_log[:50]  # max 50 hata dön

        # Son feed zamanını güncelle
        db.execute(
            text("UPDATE sellers SET last_feed_at = :ts WHERE id = :id"),
            {"ts": datetime.utcnow(), "id": seller_id},
        )
        db.commit()

        logger.info(
            "Feed ingestion tamamlandı",
            seller_id=seller_id,
            batch_id=batch_id,
            inserted=result["inserted"],
            skipped=result["skipped"],
        )

    except Exception as e:
        db.rollback()
        logger.error("Feed ingestion hatası", seller_id=seller_id, error=str(e))
        result["errors"].append({"level": "fatal", "error": str(e)})
        raise
    finally:
        db.close()

    return result


def _bulk_insert_raw_offers(db: Session, offers: list[dict]) -> None:
    """raw_offers tablosuna toplu INSERT — çakışmada güncelle."""
    import json

    insert_sql = text("""
        INSERT INTO raw_offers (
            seller_id, feed_batch_id, external_id, title, description,
            price, currency, shipping_cost, stock_status,
            gtin, mpn, brand, model,
            image_urls, category_raw, specs, raw_data, parse_errors,
            processed, created_at
        ) VALUES (
            :seller_id, :feed_batch_id, :external_id, :title, :description,
            :price, :currency, :shipping_cost, :stock_status,
            :gtin, :mpn, :brand, :model,
            :image_urls, :category_raw, :specs::jsonb, :raw_data::jsonb, :parse_errors::jsonb,
            :processed, :created_at
        )
        ON CONFLICT DO NOTHING
    """)

    batch = []
    for offer in offers:
        batch.append({
            "seller_id": offer["seller_id"],
            "feed_batch_id": offer["feed_batch_id"],
            "external_id": offer.get("external_id"),
            "title": offer.get("title"),
            "description": offer.get("description"),
            "price": offer.get("price"),
            "currency": offer.get("currency", "TRY"),
            "shipping_cost": offer.get("shipping_cost", 0),
            "stock_status": offer.get("stock_status", "unknown"),
            "gtin": offer.get("gtin"),
            "mpn": offer.get("mpn"),
            "brand": offer.get("brand"),
            "model": offer.get("model"),
            "image_urls": "{" + ",".join(f'"{u}"' for u in (offer.get("image_urls") or [])) + "}",
            "category_raw": offer.get("category_raw"),
            "specs": json.dumps(offer.get("specs") or {}, ensure_ascii=False),
            "raw_data": json.dumps(offer.get("raw_data") or {}, ensure_ascii=False),
            "parse_errors": json.dumps(offer.get("parse_errors") or [], ensure_ascii=False),
            "processed": False,
            "created_at": offer.get("created_at", datetime.utcnow().isoformat()),
        })

    db.execute(insert_sql, batch)
    logger.info(f"{len(batch)} kayıt raw_offers'a yazıldı")


def ingest_all_active_sellers() -> list[dict]:
    """Tüm aktif satıcıların feed'lerini sırayla çek."""
    db = SessionLocal()
    try:
        sellers = db.execute(
            text("SELECT id FROM sellers WHERE status = 'active' ORDER BY id")
        ).fetchall()
    finally:
        db.close()

    results = []
    for (seller_id,) in sellers:
        try:
            result = ingest_seller_feed(seller_id)
            results.append(result)
        except Exception as e:
            logger.error("Satıcı feed'i başarısız", seller_id=seller_id, error=str(e))
            results.append({"seller_id": seller_id, "error": str(e)})

    return results
