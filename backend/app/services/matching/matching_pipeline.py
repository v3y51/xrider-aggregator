"""
Matching Pipeline Orchestrator — Adım 5 & 6
raw_offers → product_matches → products/offers tabloları
"""

import json
import os
from datetime import datetime
from typing import Optional

import structlog
from slugify import slugify
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.services.matching.product_matcher import (
    AUTO_CONFIRM_SCORE,
    PENDING_REVIEW_SCORE,
    MatchCandidate,
    ProductMatcher,
)
from app.services.normalization.currency import convert_to_try

logger = structlog.get_logger()

DATABASE_URL_SYNC = os.getenv(
    "DATABASE_URL_SYNC",
    "postgresql+psycopg2://xrider:xrider_dev_pass@localhost:5432/xrider",
)

engine = create_engine(DATABASE_URL_SYNC, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)


def run_matching_pipeline(batch_size: int = 100) -> dict:
    """
    İşlenmemiş raw_offers'ı al, eşleştir ve products/offers tablolarını güncelle.
    """
    db = SessionLocal()
    stats = {"processed": 0, "matched": 0, "new_products": 0, "pending": 0, "errors": 0}

    try:
        # Mevcut kanonik ürünleri belleğe al (matching için)
        candidates = _load_candidates(db)
        logger.info(f"Matching başlatıldı — {len(candidates)} kanonik ürün yüklendi")

        matcher = ProductMatcher(candidates)

        # İşlenmemiş raw_offers'ı al
        raw_offers = db.execute(
            text("""
                SELECT id, seller_id, external_id, title, brand, model,
                       gtin, mpn, price, currency, shipping_cost,
                       category_raw, specs, image_urls, offer_url,
                       stock_status
                FROM raw_offers
                WHERE processed = false
                ORDER BY id
                LIMIT :limit
            """),
            {"limit": batch_size},
        ).fetchall()

        logger.info(f"{len(raw_offers)} adet işlenmemiş kayıt bulundu")

        for row in raw_offers:
            try:
                offer_dict = _row_to_dict(row)
                result = matcher.match(offer_dict)

                # Para birimi normalize
                price_try = convert_to_try(
                    float(offer_dict.get("price") or 0),
                    offer_dict.get("currency", "TRY"),
                )
                shipping_try = convert_to_try(
                    float(offer_dict.get("shipping_cost") or 0),
                    "TRY",
                )
                total_price = round(price_try + shipping_try, 2)

                # product_id yoksa yeni ürün oluştur
                if result.product_id is None and result.status != "pending_review":
                    result.product_id = _create_product(db, offer_dict, price_try, shipping_try)
                    stats["new_products"] += 1
                    # Yeni ürünü matcher'a ekle (aynı batch içinde kullanılabilsin)
                    if result.product_id:
                        candidates.append(MatchCandidate(
                            product_id=result.product_id,
                            canonical_title=offer_dict.get("title", ""),
                            brand=offer_dict.get("brand"),
                            model=offer_dict.get("model"),
                            gtin=offer_dict.get("gtin"),
                            category_id=None,
                            specs=json.loads(offer_dict.get("specs") or "{}"),
                        ))
                        matcher = ProductMatcher(candidates)

                # product_matches tablosuna yaz
                _insert_match(db, row.id, result)

                # Eğer auto_confirmed ise offers tablosunu güncelle
                if result.status == "auto_confirmed" and result.product_id:
                    _upsert_offer(db, offer_dict, result.product_id, price_try, shipping_try, total_price)
                    _record_price_history(db, offer_dict, result.product_id, price_try, shipping_try, total_price)
                    stats["matched"] += 1
                else:
                    stats["pending"] += 1

                # raw_offer'ı işlendi olarak işaretle
                db.execute(
                    text("UPDATE raw_offers SET processed = true, processed_at = :ts WHERE id = :id"),
                    {"ts": datetime.utcnow(), "id": row.id},
                )

                stats["processed"] += 1

            except Exception as e:
                logger.error("Offer matching hatası", raw_offer_id=row.id, error=str(e))
                stats["errors"] += 1
                continue  # Pipeline durmuyor!

        db.commit()
        logger.info("Matching pipeline tamamlandı", **stats)

    except Exception as e:
        db.rollback()
        logger.error("Pipeline genel hatası", error=str(e))
        raise
    finally:
        db.close()

    return stats


def _load_candidates(db: Session) -> list[MatchCandidate]:
    rows = db.execute(
        text("SELECT id, canonical_title, brand, model, gtin, category_id, specs FROM products")
    ).fetchall()
    return [
        MatchCandidate(
            product_id=r.id,
            canonical_title=r.canonical_title,
            brand=r.brand,
            model=r.model,
            gtin=r.gtin,
            category_id=r.category_id,
            specs=r.specs or {},
        )
        for r in rows
    ]


def _create_product(db: Session, offer: dict, price: float, shipping: float) -> Optional[int]:
    """raw_offer'dan yeni kanonik ürün oluştur."""
    title = offer.get("title", "Isimsiz Ürün")
    base_slug = slugify(f"{offer.get('brand', '')} {offer.get('model', '')} {title}"[:200])
    slug = _unique_slug(db, base_slug)

    result = db.execute(
        text("""
            INSERT INTO products (
                canonical_title, brand, model, slug, gtin, mpn,
                description, specs, min_price, min_price_with_shipping,
                offer_count, created_at, updated_at
            ) VALUES (
                :title, :brand, :model, :slug, :gtin, :mpn,
                :desc, :specs::jsonb, :min_price, :min_price_with_shipping,
                1, :now, :now
            )
            RETURNING id
        """),
        {
            "title": title,
            "brand": offer.get("brand"),
            "model": offer.get("model"),
            "slug": slug,
            "gtin": offer.get("gtin"),
            "mpn": offer.get("mpn"),
            "desc": offer.get("description"),
            "specs": offer.get("specs") or "{}",
            "min_price": price,
            "min_price_with_shipping": price + float(offer.get("shipping_cost") or 0),
            "now": datetime.utcnow(),
        },
    )
    row = result.fetchone()
    return row.id if row else None


def _insert_match(db: Session, raw_offer_id: int, result) -> None:
    db.execute(
        text("""
            INSERT INTO product_matches (
                raw_offer_id, product_id, method, confidence_score,
                gtin_match, title_similarity, brand_match, spec_overlap,
                status, reviewed_by_human, created_at
            ) VALUES (
                :raw_offer_id, :product_id, :method, :score,
                :gtin_match, :title_sim, :brand_match, :spec_overlap,
                :status, false, :now
            )
        """),
        {
            "raw_offer_id": raw_offer_id,
            "product_id": result.product_id,
            "method": result.method,
            "score": result.confidence_score,
            "gtin_match": result.gtin_match,
            "title_sim": result.title_similarity,
            "brand_match": result.brand_match,
            "spec_overlap": result.spec_overlap,
            "status": result.status,
            "now": datetime.utcnow(),
        },
    )


def _upsert_offer(db: Session, offer: dict, product_id: int, price: float, shipping: float, total: float) -> None:
    db.execute(
        text("""
            INSERT INTO offers (
                product_id, seller_id, seller_offer_id,
                price, currency, shipping_cost, total_price,
                stock_status, offer_url, status,
                last_checked_at, created_at, updated_at
            ) VALUES (
                :product_id, :seller_id, :seller_offer_id,
                :price, 'TRY', :shipping, :total,
                :stock_status, :offer_url, 'active',
                :now, :now, :now
            )
            ON CONFLICT (product_id, seller_id) DO UPDATE SET
                price = EXCLUDED.price,
                shipping_cost = EXCLUDED.shipping_cost,
                total_price = EXCLUDED.total_price,
                stock_status = EXCLUDED.stock_status,
                offer_url = EXCLUDED.offer_url,
                last_checked_at = EXCLUDED.last_checked_at,
                updated_at = EXCLUDED.updated_at
        """),
        {
            "product_id": product_id,
            "seller_id": offer["seller_id"],
            "seller_offer_id": offer.get("external_id"),
            "price": price,
            "shipping": shipping,
            "total": total,
            "stock_status": offer.get("stock_status", "unknown"),
            "offer_url": offer.get("offer_url"),
            "now": datetime.utcnow(),
        },
    )
    # Ürünün min fiyatını güncelle
    db.execute(
        text("""
            UPDATE products SET
                min_price = (SELECT MIN(price) FROM offers WHERE product_id = :pid AND status = 'active'),
                min_price_with_shipping = (SELECT MIN(total_price) FROM offers WHERE product_id = :pid AND status = 'active'),
                offer_count = (SELECT COUNT(*) FROM offers WHERE product_id = :pid AND status = 'active'),
                updated_at = :now
            WHERE id = :pid
        """),
        {"pid": product_id, "now": datetime.utcnow()},
    )


def _record_price_history(db: Session, offer: dict, product_id: int, price: float, shipping: float, total: float) -> None:
    """Her fiyat değişikliğinde price_history'ye kayıt düş."""
    # Son kayıtla fiyat aynıysa yazma
    last = db.execute(
        text("""
            SELECT total_price FROM price_history
            WHERE product_id = :pid AND seller_id = :sid
            ORDER BY recorded_at DESC LIMIT 1
        """),
        {"pid": product_id, "sid": offer["seller_id"]},
    ).fetchone()

    if last and float(last.total_price) == total:
        return  # Fiyat değişmemiş

    db.execute(
        text("""
            INSERT INTO price_history (offer_id, product_id, seller_id, price, shipping_cost, total_price, stock_status, recorded_at)
            SELECT o.id, :pid, :sid, :price, :shipping, :total, :stock, :now
            FROM offers o WHERE o.product_id = :pid AND o.seller_id = :sid
            LIMIT 1
        """),
        {
            "pid": product_id,
            "sid": offer["seller_id"],
            "price": price,
            "shipping": shipping,
            "total": total,
            "stock": offer.get("stock_status", "unknown"),
            "now": datetime.utcnow(),
        },
    )


def _unique_slug(db: Session, base_slug: str) -> str:
    slug = base_slug
    counter = 1
    while True:
        exists = db.execute(text("SELECT 1 FROM products WHERE slug = :s"), {"s": slug}).fetchone()
        if not exists:
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


def _row_to_dict(row) -> dict:
    return {
        "seller_id": row.seller_id,
        "external_id": row.external_id,
        "title": row.title,
        "brand": row.brand,
        "model": row.model,
        "gtin": row.gtin,
        "mpn": row.mpn,
        "price": float(row.price) if row.price else 0,
        "currency": row.currency,
        "shipping_cost": float(row.shipping_cost) if row.shipping_cost else 0,
        "category_raw": row.category_raw,
        "specs": json.dumps(row.specs) if row.specs else "{}",
        "image_urls": row.image_urls or [],
        "offer_url": row.offer_url,
        "stock_status": row.stock_status,
    }
