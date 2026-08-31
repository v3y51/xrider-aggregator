"""
Seller Portal API — Adım 10
Mağaza kimlik doğrulama, bakiye görüntüleme, feed yönetimi

Güvenlik: API key tabanlı basit auth (production'da JWT'ye geçilmeli)
"""

import secrets
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import structlog

from app.core.database import get_db

router = APIRouter()
logger = structlog.get_logger()


# ─────────────────────────────────────────────────────────────────────────────
# Auth Dependency
# ─────────────────────────────────────────────────────────────────────────────

async def get_current_seller(
    x_api_key: str = Header(..., description="Mağaza API anahtarı"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """API key doğrulama."""
    row = await db.execute(
        text("SELECT * FROM sellers WHERE api_key = :key AND status = 'active'"),
        {"key": x_api_key},
    )
    seller = row.fetchone()
    if not seller:
        raise HTTPException(status_code=401, detail="Geçersiz API anahtarı")
    return dict(seller._mapping)


# ─────────────────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────────────────

class SellerRegisterRequest(BaseModel):
    name: str
    website_url: str
    contact_email: str
    feed_url: Optional[str] = None
    feed_format: str = "xml"


class FeedUpdateRequest(BaseModel):
    feed_url: str
    feed_format: str = "xml"
    feed_interval_hours: int = 24


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/register")
async def register_seller(
    req: SellerRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """Yeni mağaza kaydı — API key üretir."""
    from slugify import slugify

    slug = slugify(req.name)
    api_key = secrets.token_hex(32)

    # Slug benzersizliği
    existing = await db.execute(
        text("SELECT id FROM sellers WHERE slug = :slug"), {"slug": slug}
    )
    if existing.fetchone():
        slug = f"{slug}-{secrets.token_hex(4)}"

    await db.execute(
        text("""
            INSERT INTO sellers (name, slug, website_url, contact_email,
                                 feed_url, feed_format, status, api_key,
                                 balance, cpc_rate, trust_score, created_at)
            VALUES (:name, :slug, :website_url, :email,
                    :feed_url, :feed_format, 'pending', :api_key,
                    0, 0.10, 5.0, :now)
        """),
        {
            "name": req.name,
            "slug": slug,
            "website_url": req.website_url,
            "email": req.contact_email,
            "feed_url": req.feed_url,
            "feed_format": req.feed_format,
            "api_key": api_key,
            "now": datetime.utcnow(),
        },
    )

    logger.info("Yeni mağaza kaydı", name=req.name)
    return {
        "message": "Mağaza kaydı alındı. Admin onayından sonra aktif olacak.",
        "api_key": api_key,
        "note": "Bu anahtarı güvenli saklayın, tekrar gösterilmez.",
    }


@router.get("/dashboard")
async def seller_dashboard(seller: dict = Depends(get_current_seller)):
    """Mağaza özet paneli."""
    return {
        "seller": {
            "name": seller["name"],
            "slug": seller["slug"],
            "status": seller["status"],
            "trust_score": seller["trust_score"],
        },
        "financials": {
            "balance": float(seller["balance"]),
            "cpc_rate": float(seller["cpc_rate"]),
            "total_clicks": seller["total_clicks"],
            "total_spent": float(seller["total_spent"]),
        },
        "feed": {
            "feed_url": seller["feed_url"],
            "feed_format": seller["feed_format"],
            "feed_interval_hours": seller["feed_interval_hours"],
            "last_feed_at": seller["last_feed_at"],
        },
    }


@router.put("/feed")
async def update_feed(
    req: FeedUpdateRequest,
    seller: dict = Depends(get_current_seller),
    db: AsyncSession = Depends(get_db),
):
    """Feed URL ve format güncelle."""
    await db.execute(
        text("""
            UPDATE sellers SET
                feed_url = :url,
                feed_format = :fmt,
                feed_interval_hours = :interval,
                updated_at = :now
            WHERE id = :id
        """),
        {
            "url": req.feed_url,
            "fmt": req.feed_format,
            "interval": req.feed_interval_hours,
            "now": datetime.utcnow(),
            "id": seller["id"],
        },
    )
    logger.info("Feed güncellendi", seller_id=seller["id"], url=req.feed_url)
    return {"message": "Feed bilgileri güncellendi", "feed_url": req.feed_url}


@router.get("/offers")
async def seller_offers(
    status: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
    seller: dict = Depends(get_current_seller),
    db: AsyncSession = Depends(get_db),
):
    """Mağazanın tekliflerini listele."""
    offset = (page - 1) * per_page
    where = "o.seller_id = :sid"
    params: dict = {"sid": seller["id"], "limit": per_page, "offset": offset}

    if status:
        where += " AND o.status = :status"
        params["status"] = status

    rows = await db.execute(
        text(f"""
            SELECT o.id, o.price, o.total_price, o.stock_status,
                   o.status, o.last_checked_at, o.offer_url,
                   p.canonical_title, p.slug as product_slug
            FROM offers o
            JOIN products p ON p.id = o.product_id
            WHERE {where}
            ORDER BY o.updated_at DESC
            LIMIT :limit OFFSET :offset
        """),
        params,
    )
    offers = [dict(r._mapping) for r in rows.fetchall()]
    return {"offers": offers, "page": page, "per_page": per_page}


@router.get("/clicks")
async def seller_clicks(
    days: int = 30,
    seller: dict = Depends(get_current_seller),
    db: AsyncSession = Depends(get_db),
):
    """Tıklama raporunu döner (günlük özet)."""
    since = datetime.utcnow() - timedelta(days=days)
    rows = await db.execute(
        text("""
            SELECT DATE(created_at) as date,
                   COUNT(*) as total_clicks,
                   COUNT(*) FILTER (WHERE is_fraud = false) as valid_clicks,
                   SUM(cpc_amount) FILTER (WHERE is_fraud = false) as spent
            FROM click_events
            WHERE seller_id = :sid AND created_at >= :since
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        """),
        {"sid": seller["id"], "since": since},
    )
    daily = [dict(r._mapping) for r in rows.fetchall()]
    return {"days": days, "daily_report": daily}
