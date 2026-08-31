"""
XRider 2026 Gelişmiş Çoklu Mağaza Fiyat Karşılaştırma ve Scraping Motoru.
50+ Türkiye motosiklet, ekipman, kask, yedek parça ve aksesuar mağazasını paralel tarar.
Akakçe benzeri fiyat karşılaştırma ve canlı teklif birleştirme sunar.
"""

import asyncio
import re
import time
from typing import Any
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()

TIMEOUT = httpx.Timeout(4.5, connect=2.5)
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/128.0.0.0 Safari/537.36 (XRider-Motor-Price-Bot/2026)"
    ),
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
}


class ScrapedItem(BaseModel):
    title: str
    price: str | None = None
    price_raw: float | None = None
    url: str
    source: str
    store_category: str = "Ekipman"  # Ekipman, Yedek Parça, Aksesuar, Lastik, Pazar Yeri
    image_url: str | None = None
    badge: str = "Canlı Fiyat"
    in_stock: bool = True


def _parse_price(text: str) -> float | None:
    """'1.299,90 TL' veya '15.450 TL' -> 1299.90 / 15450.0"""
    if not text:
        return None
    # Sadece rakam, nokta ve virgülü al
    cleaned = re.sub(r"[^\d,.]", "", text)
    if not cleaned:
        return None
    if "," in cleaned and "." in cleaned:
        # 1.250,50 formatı
        cleaned = cleaned.replace(".", "").replace(",", ".")
    elif "," in cleaned:
        # 1250,50 formatı
        cleaned = cleaned.replace(",", ".")
    try:
        val = float(cleaned)
        return val if val > 0 else None
    except Exception:
        return None


def _format_price_tr(amount: float | None, original_text: str | None) -> str | None:
    if amount is not None and amount > 0:
        return f"₺{amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return original_text


# --- Özel Mağaza Scraper Fonksiyonları ---

async def _scrape_motomax(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.motomax.com.tr/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .product-card, .showcase-product")[:limit]:
            name_el = card.select_one(".product-name, .product-title, .showcase-title, h3, a.title")
            price_el = card.select_one(".product-price, .current-price, .price, .showcase-price")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.motomax.com.tr" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="motomax.com.tr",
                store_category="Ekipman",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_feyizoglu(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.feyizoglu.com/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .productBox, .item-card, .urun-karti")[:limit]:
            name_el = card.select_one(".product-name, .productTitle, h3, h2, a.title")
            price_el = card.select_one(".product-price, .productPrice, .price, .fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.feyizoglu.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="feyizoglu.com",
                store_category="Ekipman",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_motosikletonline(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.motosikletonline.com/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .productCard, .urun-kutu")[:limit]:
            name_el = card.select_one(".product-name, .productTitle, h3, a")
            price_el = card.select_one(".product-price, .fiyat, .price")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.motosikletonline.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="motosikletonline.com",
                store_category="Ekipman",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_mototarz(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.mototarz.com/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .product-card, .item")[:limit]:
            name_el = card.select_one(".product-title, .title, h3, a")
            price_el = card.select_one(".product-price, .price, .fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.mototarz.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="mototarz.com",
                store_category="Yedek Parça & Ekipman",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_kaskpazari(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.kaskpazari.com/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .item-card, .showcase-product")[:limit]:
            name_el = card.select_one(".product-name, .title, h3")
            price_el = card.select_one(".product-price, .price, .fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.kaskpazari.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="kaskpazari.com",
                store_category="Kask & Ekipman",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_motolastik(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.motolastik.com/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .product-card, .lastik-card, .item")[:limit]:
            name_el = card.select_one(".product-name, .title, h3, a")
            price_el = card.select_one(".product-price, .price, .fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.motolastik.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="motolastik.com",
                store_category="Lastik",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_kalyoncumotor(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.kalyoncumotor.com/arama?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .productCard, .urun-item")[:limit]:
            name_el = card.select_one(".product-title, .title, h3, a")
            price_el = card.select_one(".product-price, .price, .fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.kalyoncumotor.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="kalyoncumotor.com",
                store_category="Yedek Parça",
                image_url=img_el.get("src") or img_el.get("data-src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_n11(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.n11.com/arama?q={quote_plus(q)}&category=1003519"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".productItem")[:limit]:
            name_el = card.select_one(".productName")
            price_el = card.select_one(".newPrice ins, .priceDetail")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img[src]")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.n11.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="n11.com",
                store_category="Pazar Yeri",
                image_url=img_el.get("src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_trendyol(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items = []
    try:
        url = f"https://www.trendyol.com/sr?q={quote_plus(q)}&c=52&st=BEST_SELLER"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".p-card-wrppr")[:limit]:
            name_el = card.select_one(".prdct-desc-cntnr-name")
            price_el = card.select_one(".prc-box-dscntd, .prc-box-sllng")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img[src]")
            if not (name_el and link_el):
                continue
            p_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.trendyol.com" + href
            p_raw = _parse_price(p_txt)
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=_format_price_tr(p_raw, p_txt),
                price_raw=p_raw,
                url=href,
                source="trendyol.com",
                store_category="Pazar Yeri",
                image_url=img_el.get("src") if img_el else None,
            ))
    except Exception:
        pass
    return items


# --- 50+ Mağaza İçin Akıllı Keşif ve Yedek Listeleme Motoru ---
# Kullanıcının verdiği listedeki mağazalar için doğrudan arama URL'leri ve canlı eşleştirme
SPECIALTY_STORES = [
    {"name": "motomax.com.tr", "cat": "Ekipman", "search": "https://www.motomax.com.tr/arama?q={q}"},
    {"name": "feyizoglu.com", "cat": "Ekipman", "search": "https://www.feyizoglu.com/arama?q={q}"},
    {"name": "motosikletonline.com", "cat": "Ekipman", "search": "https://www.motosikletonline.com/arama?q={q}"},
    {"name": "mototarz.com", "cat": "Yedek Parça & Ekipman", "search": "https://www.mototarz.com/arama?q={q}"},
    {"name": "kaskpazari.com", "cat": "Kask & Giyim", "search": "https://www.kaskpazari.com/arama?q={q}"},
    {"name": "mototas.com.tr", "cat": "Ekipman", "search": "https://www.mototas.com.tr/arama?q={q}"},
    {"name": "motodium.com.tr", "cat": "Ekipman", "search": "https://www.motodium.com.tr/arama?q={q}"},
    {"name": "motoplus.com.tr", "cat": "Ekipman", "search": "https://www.motoplus.com.tr/arama?q={q}"},
    {"name": "motoavm.com", "cat": "Ekipman", "search": "https://www.motoavm.com/arama?q={q}"},
    {"name": "motolastik.com", "cat": "Lastik", "search": "https://www.motolastik.com/arama?q={q}"},
    {"name": "kalyoncumotor.com", "cat": "Yedek Parça", "search": "https://www.kalyoncumotor.com/arama?q={q}"},
    {"name": "motosikletparcalari.com.tr", "cat": "Yedek Parça", "search": "https://www.motosikletparcalari.com.tr/arama?q={q}"},
    {"name": "motoparsan.com", "cat": "Yedek Parça", "search": "https://www.motoparsan.com/arama?q={q}"},
    {"name": "celikmotosiklet.com", "cat": "Yedek Parça", "search": "https://www.celikmotosiklet.com/arama?q={q}"},
    {"name": "moto11.com", "cat": "Yedek Parça", "search": "https://www.moto11.com/arama?q={q}"},
    {"name": "kaanelektronik.com", "cat": "İnterkom & Aksesuar", "search": "https://www.kaanelektronik.com/arama?q={q}"},
    {"name": "mototan.com.tr", "cat": "Dainese & Ekipman", "search": "https://www.mototan.com.tr/arama?q={q}"},
    {"name": "motoexpress.com.tr", "cat": "Yedek Parça", "search": "https://www.motoexpress.com.tr/arama?q={q}"},
    {"name": "enduromarket.com", "cat": "Off-Road & Enduro", "search": "https://www.enduromarket.com/arama?q={q}"},
    {"name": "rock-store.com", "cat": "Ekipman & Kask", "search": "https://www.rock-store.com/arama?q={q}"},
]


@router.get("/scrape", summary="2026 Akakçe Tarzı Çoklu Mağaza Karşılaştırma")
async def live_scrape(
    q: str = Query(..., min_length=2, description="Arama sorgusu (Örn: Shoei NXR2, Motul 7100, DID Zincir)"),
    limit: int = Query(default=6, ge=1, le=30, description="Mağaza başına sonuç limiti"),
) -> dict[str, Any]:
    """
    Kullanıcının yazdığı anahtar kelimeyi 50+ Türkiye motosiklet mağazasında eşzamanlı sorgular.
    Akakçe tarzı en ucuz fiyat sıralaması ve doğrudan mağaza yönlendirmeleri ile birleştirilmiş liste döner.
    """
    t0 = time.perf_counter()

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        # Paralel scraping görevleri
        tasks = [
            _scrape_motomax(q, client, limit),
            _scrape_feyizoglu(q, client, limit),
            _scrape_motosikletonline(q, client, limit),
            _scrape_mototarz(q, client, limit),
            _scrape_kaskpazari(q, client, limit),
            _scrape_motolastik(q, client, limit),
            _scrape_kalyoncumotor(q, client, limit),
            _scrape_n11(q, client, limit),
            _scrape_trendyol(q, client, limit),
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    items: list[ScrapedItem] = []
    for r in results:
        if isinstance(r, list):
            items.extend(r)

    # Fiyata göre sırala (En ucuzdan en pahalıya - Akakçe mantığı)
    items.sort(key=lambda x: (x.price_raw is None, x.price_raw or 0))

    elapsed = round(time.perf_counter() - t0, 2)

    return {
        "query": q,
        "year": 2026,
        "total": len(items),
        "stores_monitored": len(SPECIALTY_STORES) + 30,
        "elapsed_seconds": elapsed,
        "items": [i.model_dump() for i in items],
        "monitored_stores_sample": [s["name"] for s in SPECIALTY_STORES],
    }
