"""
Meilisearch Arama Servisi — Adım 7
Ürün indeksleme ve arama/filtre işlemleri
"""

import os
from typing import Optional
import meilisearch
import structlog

logger = structlog.get_logger()

MEILI_URL = os.getenv("MEILISEARCH_URL", "http://localhost:7700")
MEILI_KEY = os.getenv("MEILISEARCH_MASTER_KEY", "xrider_meili_dev_key")
INDEX_NAME = "products"

_client: Optional[meilisearch.Client] = None


def get_client() -> meilisearch.Client:
    global _client
    if _client is None:
        _client = meilisearch.Client(MEILI_URL, MEILI_KEY)
    return _client


def get_index():
    return get_client().index(INDEX_NAME)


# ─────────────────────────────────────────────────────────────────────────────
# Index Kurulum
# ─────────────────────────────────────────────────────────────────────────────

def setup_index() -> None:
    """Index'i oluşturur ve ayarlarını yapılandırır."""
    client = get_client()

    # Index oluştur (zaten varsa atla)
    try:
        client.create_index(INDEX_NAME, {"primaryKey": "id"})
        logger.info("Meilisearch index oluşturuldu", index=INDEX_NAME)
    except Exception:
        logger.info("Meilisearch index zaten mevcut")

    idx = client.index(INDEX_NAME)

    # Aranabilir alanlar
    idx.update_searchable_attributes([
        "canonical_title",
        "brand",
        "model",
        "description",
        "category_path",
    ])

    # Filtrelenebilir alanlar
    idx.update_filterable_attributes([
        "brand",
        "category_id",
        "category_slug",
        "min_price_with_shipping",
        "stock_available",
        "offer_count",
    ])

    # Sıralanabilir alanlar
    idx.update_sortable_attributes([
        "min_price_with_shipping",
        "offer_count",
        "view_count",
        "created_at_ts",
    ])

    # Arama sıralaması (varsayılan: fiyat artan)
    idx.update_ranking_rules([
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
    ])

    logger.info("Meilisearch index ayarları güncellendi")


# ─────────────────────────────────────────────────────────────────────────────
# Ürün İndeksleme
# ─────────────────────────────────────────────────────────────────────────────

def index_product(product: dict) -> None:
    """Tek bir ürünü index'e ekler/günceller."""
    doc = _to_document(product)
    get_index().add_documents([doc])


def index_products_bulk(products: list[dict]) -> None:
    """Toplu ürün indeksleme."""
    if not products:
        return
    docs = [_to_document(p) for p in products]
    get_index().add_documents(docs)
    logger.info(f"{len(docs)} ürün Meilisearch'e indekslendi")


def _to_document(p: dict) -> dict:
    """Product dict'ini Meilisearch dokümanına dönüştür."""
    return {
        "id": p["id"],
        "canonical_title": p.get("canonical_title", ""),
        "brand": p.get("brand", ""),
        "model": p.get("model", ""),
        "slug": p.get("slug", ""),
        "description": (p.get("description") or "")[:500],
        "main_image_url": p.get("main_image_url", ""),
        "category_id": p.get("category_id"),
        "category_slug": p.get("category_slug", ""),
        "category_path": p.get("taxonomy_path", ""),
        "min_price": float(p.get("min_price") or 0),
        "min_price_with_shipping": float(p.get("min_price_with_shipping") or 0),
        "offer_count": p.get("offer_count", 0),
        "view_count": p.get("view_count", 0),
        "stock_available": (p.get("offer_count") or 0) > 0,
        "created_at_ts": int(p.get("created_at_ts") or 0),
        "specs": p.get("specs") or {},
    }


# ─────────────────────────────────────────────────────────────────────────────
# Arama
# ─────────────────────────────────────────────────────────────────────────────

def search_products(
    query: str = "",
    brand: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = False,
    sort_by: str = "price_asc",
    page: int = 1,
    per_page: int = 24,
) -> dict:
    """
    Ürün arama ve filtreleme.

    sort_by seçenekleri: price_asc, price_desc, popularity, newest
    """
    filters = []

    if brand:
        filters.append(f'brand = "{brand}"')
    if category_id:
        filters.append(f"category_id = {category_id}")
    if min_price is not None:
        filters.append(f"min_price_with_shipping >= {min_price}")
    if max_price is not None:
        filters.append(f"min_price_with_shipping <= {max_price}")
    if in_stock_only:
        filters.append("stock_available = true")

    sort_map = {
        "price_asc": ["min_price_with_shipping:asc"],
        "price_desc": ["min_price_with_shipping:desc"],
        "popularity": ["offer_count:desc", "view_count:desc"],
        "newest": ["created_at_ts:desc"],
    }
    sort = sort_map.get(sort_by, ["min_price_with_shipping:asc"])

    params = {
        "limit": per_page,
        "offset": (page - 1) * per_page,
        "sort": sort,
        "attributesToHighlight": ["canonical_title", "brand", "model"],
        "highlightPreTag": "<mark>",
        "highlightPostTag": "</mark>",
    }

    if filters:
        params["filter"] = " AND ".join(filters)

    try:
        result = get_index().search(query, params)
        return {
            "hits": result["hits"],
            "total": result.get("estimatedTotalHits", 0),
            "page": page,
            "per_page": per_page,
            "query": query,
        }
    except Exception as e:
        logger.error("Meilisearch arama hatası", error=str(e))
        return {"hits": [], "total": 0, "page": page, "per_page": per_page, "query": query}
