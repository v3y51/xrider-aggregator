"""
Gerçek zamanlı scraping endpoint.
Kullanıcının arama sorgusunu Türkiye motosiklet satış sitelerine iletir,
paralel HTTP istekleri ile sonuçları toplar ve birleştirilmiş liste döner.
Hiçbir sonuç veritabanına kaydedilmez — tamamen anlık veri.
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

TIMEOUT = httpx.Timeout(6.0, connect=3.0)
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


class ScrapedItem(BaseModel):
    title: str
    price: str | None = None
    price_raw: float | None = None
    url: str
    source: str
    image_url: str | None = None
    badge: str = "Canlı Fiyat"


def _parse_price(text: str) -> float | None:
    """'1.299,90 TL' → 1299.90"""
    cleaned = re.sub(r"[^\d,.]", "", text)
    cleaned = cleaned.replace(".", "").replace(",", ".")
    try:
        return float(cleaned)
    except Exception:
        return None


async def _scrape_n11(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items: list[ScrapedItem] = []
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
            price_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.n11.com" + href
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=price_txt,
                price_raw=_parse_price(price_txt) if price_txt else None,
                url=href,
                source="n11.com",
                image_url=img_el["src"] if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_hepsiburada(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items: list[ScrapedItem] = []
    try:
        url = f"https://www.hepsiburada.com/ara?q={quote_plus(q)}&filtreler=kategori:8000&siralama=ucuzdan-pahaliya"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select("[data-test-id='product-card-wrapper']")[:limit]:
            name_el = card.select_one("[data-test-id='product-card-name']")
            price_el = card.select_one("[data-test-id='price-current-price']")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img[src]")
            if not (name_el and link_el):
                continue
            price_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.hepsiburada.com" + href
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=price_txt,
                price_raw=_parse_price(price_txt) if price_txt else None,
                url=href,
                source="hepsiburada.com",
                image_url=img_el.get("src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_trendyol(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items: list[ScrapedItem] = []
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
            price_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.trendyol.com" + href
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=price_txt,
                price_raw=_parse_price(price_txt) if price_txt else None,
                url=href,
                source="trendyol.com",
                image_url=img_el.get("src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_gittigidiyor(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items: list[ScrapedItem] = []
    try:
        url = f"https://www.gittigidiyor.com/arama?k={quote_plus(q)}&catid=10660"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".pr-all")[:limit]:
            name_el = card.select_one(".pr-ttl")
            price_el = card.select_one(".g-price-lbl, .fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            price_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.gittigidiyor.com" + href
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=price_txt,
                price_raw=_parse_price(price_txt) if price_txt else None,
                url=href,
                source="gittigidiyor.com",
                image_url=img_el.get("src") if img_el else None,
            ))
    except Exception:
        pass
    return items


async def _scrape_motosiklet_net(q: str, client: httpx.AsyncClient, limit: int) -> list[ScrapedItem]:
    items: list[ScrapedItem] = []
    try:
        url = f"https://www.motorsiklet.net/search?q={quote_plus(q)}"
        r = await client.get(url, headers=HEADERS, follow_redirects=True)
        soup = BeautifulSoup(r.text, "lxml")
        for card in soup.select(".product-item, .urun-karti, .product-card")[:limit]:
            name_el = card.select_one("h2, h3, .product-name, .urun-adi")
            price_el = card.select_one(".price, .fiyat, .urun-fiyat")
            link_el = card.select_one("a[href]")
            img_el = card.select_one("img")
            if not (name_el and link_el):
                continue
            price_txt = price_el.get_text(" ", strip=True) if price_el else None
            href = link_el["href"]
            if not href.startswith("http"):
                href = "https://www.motorsiklet.net" + href
            items.append(ScrapedItem(
                title=name_el.get_text(strip=True),
                price=price_txt,
                price_raw=_parse_price(price_txt) if price_txt else None,
                url=href,
                source="motorsiklet.net",
                image_url=img_el.get("src") if img_el else None,
            ))
    except Exception:
        pass
    return items


@router.get("/scrape", summary="Canli Fiyat Scraping")
async def live_scrape(
    q: str = Query(..., min_length=2, description="Arama terimi"),
    limit: int = Query(default=6, ge=1, le=20, description="Kaynak basina max sonuc"),
) -> dict[str, Any]:
    t0 = time.perf_counter()

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        results = await asyncio.gather(
            _scrape_n11(q, client, limit),
            _scrape_hepsiburada(q, client, limit),
            _scrape_trendyol(q, client, limit),
            _scrape_gittigidiyor(q, client, limit),
            _scrape_motosiklet_net(q, client, limit),
            return_exceptions=True,
        )

    items: list[ScrapedItem] = []
    for r in results:
        if isinstance(r, list):
            items.extend(r)

    items.sort(key=lambda x: (x.price_raw is None, x.price_raw or 0))
    elapsed = round(time.perf_counter() - t0, 2)

    return {
        "query": q,
        "total": len(items),
        "elapsed_seconds": elapsed,
        "items": [i.model_dump() for i in items],
    }
