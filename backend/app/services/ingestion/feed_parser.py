"""
XRider — Feed Ingestion Service
Adım 4: Feed indir → parse et → raw_offers'a yaz → hataları logla

Her mağazanın feed'i ayrı bir Celery görevi olarak çalışır.
Tek bir satırdaki hata tüm feed'i durdurmaz.
"""

import hashlib
import uuid
from datetime import datetime
from typing import Any

import httpx
import structlog
from lxml import etree
from tenacity import retry, stop_after_attempt, wait_exponential

logger = structlog.get_logger()


# ─────────────────────────────────────────────────────────────────────────────
# HTTP Client — retry + timeout
# ─────────────────────────────────────────────────────────────────────────────

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def download_feed(url: str, timeout: int = 30) -> bytes:
    """Feed URL'sini indir. 3 deneme, exponential backoff."""
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(timeout),
        follow_redirects=True,
        headers={"User-Agent": "XRider-Bot/1.0 (+https://xrider.com.tr/bot)"},
    ) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.content


# ─────────────────────────────────────────────────────────────────────────────
# XML Parser
# ─────────────────────────────────────────────────────────────────────────────

def parse_xml_feed(content: bytes, seller_id: int, batch_id: str) -> tuple[list[dict], list[dict]]:
    """
    XRider Standard XML feed'ini parse eder.

    Returns:
        (valid_offers, error_log)
        - valid_offers: raw_offers tablosuna yazılacak kayıtlar
        - error_log: parse hatalarını içeren kayıtlar (pipeline durmaz)
    """
    valid_offers = []
    error_log = []

    try:
        root = etree.fromstring(content)
    except etree.XMLSyntaxError as e:
        logger.error("XML parse hatası — tüm feed geçersiz", seller_id=seller_id, error=str(e))
        return [], [{"batch_id": batch_id, "error": f"XML syntax: {e}", "level": "fatal"}]

    products = root.findall(".//product")
    logger.info("Feed parse ediliyor", seller_id=seller_id, total=len(products))

    for idx, product_el in enumerate(products):
        errors = []
        raw: dict[str, Any] = {
            "seller_id": seller_id,
            "feed_batch_id": batch_id,
            "processed": False,
            "created_at": datetime.utcnow().isoformat(),
        }

        # ── Zorunlu alanlar ──────────────────────────────────────────────────
        external_id = _text(product_el, "id")
        if not external_id:
            errors.append({"field": "id", "msg": "Eksik zorunlu alan: id"})
            external_id = f"auto-{idx}"
        raw["external_id"] = external_id

        title = _text(product_el, "title")
        if not title or len(title.strip()) < 3:
            errors.append({"field": "title", "msg": "Başlık eksik veya çok kısa"})
        raw["title"] = (title or "").strip()

        price_el = product_el.find("price")
        price, currency = _parse_price(price_el)
        if price is None:
            errors.append({"field": "price", "msg": "Fiyat eksik veya geçersiz"})
        raw["price"] = price
        raw["currency"] = currency or "TRY"

        url = _text(product_el, "url")
        if not url:
            errors.append({"field": "url", "msg": "Ürün URL'si eksik"})
        raw["offer_url"] = url

        # ── Opsiyonel alanlar ────────────────────────────────────────────────
        raw["brand"] = _text(product_el, "brand")
        raw["model"] = _text(product_el, "model")
        raw["gtin"] = _clean_gtin(_text(product_el, "gtin"))
        raw["mpn"] = _text(product_el, "mpn")
        raw["description"] = _text(product_el, "description")
        raw["category_raw"] = _text(product_el, "category")

        shipping_el = product_el.find("shipping_cost")
        shipping_price, _ = _parse_price(shipping_el)
        raw["shipping_cost"] = shipping_price or 0.0

        raw["stock_status"] = _normalize_stock(_text(product_el, "stock_status"))
        raw["stock_quantity"] = _int(_text(product_el, "stock_quantity"))

        # Görseller
        raw["image_urls"] = [
            img.text.strip()
            for img in product_el.findall(".//images/image")
            if img.text and img.text.strip()
        ]

        # Teknik özellikler → JSONB
        raw["specs"] = {
            spec.get("name"): spec.text
            for spec in product_el.findall(".//specs/spec")
            if spec.get("name") and spec.text
        }

        # Ham XML → JSONB (debug için)
        raw["raw_data"] = {"xml_id": external_id, "row_index": idx}

        # ── Hata durumu ──────────────────────────────────────────────────────
        raw["parse_errors"] = errors

        if errors and any(e["field"] in ("title", "price", "url") for e in errors):
            # Kritik alan eksikse sadece logla, valid_offers'a ekleme
            error_log.append({
                "external_id": external_id,
                "seller_id": seller_id,
                "errors": errors,
                "level": "warning",
            })
            logger.warning(
                "Kayıt atlandı — kritik alan eksik",
                external_id=external_id,
                errors=errors,
            )
        else:
            valid_offers.append(raw)
            if errors:
                # Zorunlu olmayan alanlar eksik — yine de ekle ama logla
                logger.info(
                    "Kayıt eklendi ama uyarılar var",
                    external_id=external_id,
                    warnings=errors,
                )

    logger.info(
        "Feed parse tamamlandı",
        seller_id=seller_id,
        valid=len(valid_offers),
        skipped=len(error_log),
    )
    return valid_offers, error_log


# ─────────────────────────────────────────────────────────────────────────────
# CSV Parser (ileride genişletilecek)
# ─────────────────────────────────────────────────────────────────────────────

def parse_csv_feed(content: bytes, seller_id: int, batch_id: str) -> tuple[list[dict], list[dict]]:
    """CSV feed parser — şimdilik temel implementasyon."""
    import csv
    import io

    valid_offers = []
    error_log = []

    try:
        text = content.decode("utf-8-sig")  # BOM'lu dosyalar için
        reader = csv.DictReader(io.StringIO(text))
        for idx, row in enumerate(reader):
            errors = []
            raw = {
                "seller_id": seller_id,
                "feed_batch_id": batch_id,
                "processed": False,
                "external_id": row.get("id", f"csv-{idx}"),
                "title": (row.get("title") or row.get("name") or "").strip(),
                "price": _safe_float(row.get("price")),
                "currency": row.get("currency", "TRY"),
                "shipping_cost": _safe_float(row.get("shipping_cost") or row.get("cargo"), 0.0),
                "brand": row.get("brand"),
                "model": row.get("model"),
                "gtin": _clean_gtin(row.get("gtin") or row.get("barcode")),
                "mpn": row.get("mpn"),
                "offer_url": row.get("url") or row.get("link"),
                "stock_status": _normalize_stock(row.get("stock_status") or row.get("stok")),
                "category_raw": row.get("category") or row.get("kategori"),
                "parse_errors": [],
                "specs": {},
                "raw_data": dict(row),
                "image_urls": [u.strip() for u in (row.get("image_url") or "").split("|") if u.strip()],
            }

            if not raw["title"] or raw["price"] is None:
                errors.append({"field": "title_or_price", "msg": "Eksik"})
                error_log.append({"external_id": raw["external_id"], "errors": errors})
            else:
                raw["parse_errors"] = errors
                valid_offers.append(raw)

    except Exception as e:
        logger.error("CSV parse hatası", error=str(e))
        error_log.append({"error": str(e), "level": "fatal"})

    return valid_offers, error_log


# ─────────────────────────────────────────────────────────────────────────────
# Yardımcı Fonksiyonlar
# ─────────────────────────────────────────────────────────────────────────────

def _text(el, tag: str) -> str | None:
    node = el.find(tag)
    if node is not None and node.text:
        return node.text.strip()
    return None


def _parse_price(el) -> tuple[float | None, str | None]:
    if el is None or not el.text:
        return None, None
    try:
        price = float(el.text.replace(",", ".").strip())
        currency = el.get("currency", "TRY")
        return price, currency
    except ValueError:
        return None, None


def _normalize_stock(raw: str | None) -> str:
    """Mağaza'nın kendi stok formatını normalize et."""
    if not raw:
        return "unknown"
    raw = raw.lower().strip()
    if raw in ("in_stock", "instock", "stokta", "var", "1", "true", "yes", "evet"):
        return "in_stock"
    if raw in ("out_of_stock", "outofstock", "tükendi", "yok", "0", "false", "no", "hayır"):
        return "out_of_stock"
    if raw in ("limited", "sinirli", "az kaldı", "limited_stock"):
        return "limited"
    return "unknown"


def _clean_gtin(gtin: str | None) -> str | None:
    if not gtin:
        return None
    cleaned = "".join(c for c in gtin if c.isdigit())
    return cleaned if len(cleaned) in (8, 12, 13, 14) else None


def _int(val: str | None) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except ValueError:
        return None


def _safe_float(val, default=None) -> float | None:
    if val is None:
        return default
    try:
        return float(str(val).replace(",", "."))
    except ValueError:
        return default


def generate_batch_id(seller_id: int) -> str:
    """Tekil feed batch kimliği üret."""
    ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    return f"{seller_id}-{ts}-{uuid.uuid4().hex[:8]}"
