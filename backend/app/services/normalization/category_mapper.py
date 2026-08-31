"""
Kategori Eşleştirme Servisi
Ham mağaza kategorisi → Platform taksonomisi

Strateji:
1. Tam eşleşme (slug veya isim)
2. Anahtar kelime tabanlı kural eşleştirme
3. Fuzzy fallback
4. Bilinmeyen → None (root kategori olarak işaretlenir)
"""

from rapidfuzz import fuzz
import structlog

logger = structlog.get_logger()

# Kural tabanlı eşleştirme haritası: anahtar kelime → platform category slug
# Daha fazla kural eklemek için sadece bu dict'i genişlet
KEYWORD_MAP: dict[str, str] = {
    # Motorsiklet türleri
    "naked": "naked-motor",
    "naked motor": "naked-motor",
    "scooter": "scooter",
    "skuter": "scooter",
    "enduro": "enduro-cross",
    "cross": "enduro-cross",
    "motocross": "enduro-cross",
    "sport": "sport-motor",
    "supersport": "sport-motor",
    "touring": "touring",
    "chopper": "touring",
    "adventure": "touring",

    # Aksesuar
    "kask": "kask",
    "helmet": "kask",
    "eldiven": "eldiven",
    "glove": "eldiven",
    "bot": "bot-ayakkabi",
    "ayakkabı": "bot-ayakkabi",
    "ayakkabi": "bot-ayakkabi",
    "boot": "bot-ayakkabi",
    "ceket": "koruyucu-giysi",
    "jacket": "koruyucu-giysi",
    "koruyucu": "koruyucu-giysi",
    "giysi": "koruyucu-giysi",
    "gps": "gps-elektronik",
    "elektronik": "gps-elektronik",

    # Yedek parça
    "lastik": "lastik-jant",
    "tyre": "lastik-jant",
    "tire": "lastik-jant",
    "jant": "lastik-jant",
    "rim": "lastik-jant",
    "fren": "fren-sistemi",
    "brake": "fren-sistemi",
    "disk": "fren-sistemi",
    "yağ": "yag-bakim",
    "yag": "yag-bakim",
    "oil": "yag-bakim",
    "bakım": "yag-bakim",
    "bakim": "yag-bakim",
    "parça": "motor-parcalari",
    "parca": "motor-parcalari",
    "engine": "motor-parcalari",
    "motor parça": "motor-parcalari",
}

# Slug → category_id haritası (DB'ye gitmeden hızlı lookup)
SLUG_TO_ID: dict[str, int] = {
    "naked-motor": 10,
    "scooter": 11,
    "enduro-cross": 12,
    "sport-motor": 13,
    "touring": 14,
    "kask": 20,
    "eldiven": 21,
    "bot-ayakkabi": 22,
    "koruyucu-giysi": 23,
    "gps-elektronik": 24,
    "motor-parcalari": 30,
    "fren-sistemi": 31,
    "lastik-jant": 32,
    "yag-bakim": 33,
    # Root kategoriler
    "motorsiklet": 1,
    "motor-aksesuarlari": 2,
    "yedek-parca": 3,
}


def map_category(raw_category: str | None) -> int | None:
    """
    Ham kategori string'ini platform category_id'ye çevirir.
    
    Args:
        raw_category: Mağazanın kendi kategori string'i
                      ör: "Motorsiklet > Naked Motor" veya "Kask > Tam Yüz"
    
    Returns:
        Platform category_id veya None (bilinmeyen)
    """
    if not raw_category:
        return None

    normalized = raw_category.lower().strip()

    # 1. Slug tam eşleşme
    for slug, cat_id in SLUG_TO_ID.items():
        if slug in normalized:
            logger.debug("Kategori slug eşleşmesi", raw=raw_category, slug=slug)
            return cat_id

    # 2. Anahtar kelime kuralları
    for keyword, slug in KEYWORD_MAP.items():
        if keyword in normalized:
            cat_id = SLUG_TO_ID.get(slug)
            if cat_id:
                logger.debug("Kategori anahtar kelime eşleşmesi", raw=raw_category, keyword=keyword, slug=slug)
                return cat_id

    # 3. Fuzzy fallback — tüm slug'larla karşılaştır
    best_score = 0
    best_slug = None
    for slug in SLUG_TO_ID:
        score = fuzz.partial_ratio(normalized, slug.replace("-", " ")) / 100.0
        if score > best_score:
            best_score = score
            best_slug = slug

    if best_score >= 0.75 and best_slug:
        cat_id = SLUG_TO_ID[best_slug]
        logger.debug(
            "Kategori fuzzy eşleşmesi",
            raw=raw_category,
            matched_slug=best_slug,
            score=best_score,
        )
        return cat_id

    logger.warning("Kategori eşleştirilemedi", raw=raw_category)
    return None
