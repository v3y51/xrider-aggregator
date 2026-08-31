"""
Arama API Endpoints — Adım 7
GET /api/v1/search
GET /api/v1/products
GET /api/v1/products/{slug}
GET /api/v1/categories
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional
import structlog

from app.core.database import get_db
from app.services.search.meili_service import search_products

router = APIRouter()
logger = structlog.get_logger()


# ─────────────────────────────────────────────────────────────────────────────
# Arama
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/search")
async def search(
    q: str = Query("", description="Arama sorgusu"),
    brand: Optional[str] = Query(None),
    category_id: Optional[int] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    in_stock: bool = Query(False),
    sort: str = Query("price_asc", regex="^(price_asc|price_desc|popularity|newest)$"),
    page: int = Query(1, ge=1),
    per_page: int = Query(24, ge=1, le=100),
):
    """Ürün arama ve filtreleme endpoint'i."""
    result = search_products(
        query=q,
        brand=brand,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        in_stock_only=in_stock,
        sort_by=sort,
        page=page,
        per_page=per_page,
    )
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Ürünler
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/products")
async def list_products(
    category_id: Optional[int] = Query(None),
    brand: Optional[str] = Query(None),
    sort: str = Query("price_asc"),
    page: int = Query(1, ge=1),
    per_page: int = Query(24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Ürün listesi — SSR için PostgreSQL'den direkt çeker."""
    offset = (page - 1) * per_page
    filters = ["offer_count > 0"]
    params: dict = {"limit": per_page, "offset": offset}

    if category_id:
        filters.append("category_id = :category_id")
        params["category_id"] = category_id
    if brand:
        filters.append("LOWER(brand) = LOWER(:brand)")
        params["brand"] = brand

    where = " AND ".join(filters)
    sort_col = {
        "price_asc": "min_price_with_shipping ASC",
        "price_desc": "min_price_with_shipping DESC",
        "popularity": "offer_count DESC",
        "newest": "created_at DESC",
    }.get(sort, "min_price_with_shipping ASC")

    rows = await db.execute(
        text(f"""
            SELECT p.id, p.canonical_title, p.brand, p.model, p.slug,
                   p.main_image_url, p.min_price, p.min_price_with_shipping,
                   p.offer_count, p.specs
            FROM products p
            WHERE {where}
            ORDER BY {sort_col}
            LIMIT :limit OFFSET :offset
        """),
        params,
    )
    products = [dict(r._mapping) for r in rows.fetchall()]

    count_row = await db.execute(
        text(f"SELECT COUNT(*) FROM products p WHERE {where}"),
        {k: v for k, v in params.items() if k not in ("limit", "offset")},
    )
    total = count_row.scalar()

    return {"products": products, "total": total, "page": page, "per_page": per_page}


@router.get("/products/{slug}")
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    """Ürün detay sayfası — fiyat karşılaştırma tablosu dahil."""
    # Kanonik ürün
    product_row = await db.execute(
        text("""
            SELECT p.*, c.name as category_name, c.taxonomy_path
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.slug = :slug
        """),
        {"slug": slug},
    )
    product = product_row.fetchone()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    product_dict = dict(product._mapping)

    # Teklifler (fiyat karşılaştırma tablosu)
    offers_row = await db.execute(
        text("""
            SELECT o.id, o.price, o.shipping_cost, o.total_price,
                   o.stock_status, o.offer_url, o.is_sponsored,
                   o.last_checked_at,
                   s.name as seller_name, s.slug as seller_slug,
                   s.logo_url, s.trust_score
            FROM offers o
            JOIN sellers s ON s.id = o.seller_id
            WHERE o.product_id = :pid
              AND o.status = 'active'
            ORDER BY
                o.is_sponsored DESC,
                o.total_price ASC
        """),
        {"pid": product_dict["id"]},
    )
    offers = [dict(r._mapping) for r in offers_row.fetchall()]

    # Fiyat geçmişi (grafik için son 90 gün)
    history_row = await db.execute(
        text("""
            SELECT DATE(recorded_at) as date,
                   MIN(total_price) as min_price,
                   MAX(total_price) as max_price
            FROM price_history
            WHERE product_id = :pid
              AND recorded_at >= NOW() - INTERVAL '90 days'
            GROUP BY DATE(recorded_at)
            ORDER BY date ASC
        """),
        {"pid": product_dict["id"]},
    )
    price_history = [dict(r._mapping) for r in history_row.fetchall()]

    # Görüntülenme sayacını artır
    await db.execute(
        text("UPDATE products SET view_count = view_count + 1 WHERE id = :id"),
        {"id": product_dict["id"]},
    )

    return {
        "product": product_dict,
        "offers": offers,
        "price_history": price_history,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Kategoriler
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    """Aktif kategorileri hiyerarşik olarak döner."""
    rows = await db.execute(
        text("""
            SELECT id, parent_id, name, slug, level, taxonomy_path
            FROM categories
            WHERE is_active = true
            ORDER BY level, sort_order, name
        """)
    )
    categories = [dict(r._mapping) for r in rows.fetchall()]
    return {"categories": categories}


# ─────────────────────────────────────────────────────────────────────────────
# Markalar (filtre için)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/brands")
async def list_brands(
    category_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Mevcut markaları listeler (filtre dropdown için)."""
    params = {}
    where = "offer_count > 0 AND brand IS NOT NULL"
    if category_id:
        where += " AND category_id = :category_id"
        params["category_id"] = category_id

    rows = await db.execute(
        text(f"SELECT DISTINCT brand, COUNT(*) as product_count FROM products WHERE {where} GROUP BY brand ORDER BY brand"),
        params,
    )
    return {"brands": [dict(r._mapping) for r in rows.fetchall()]}
