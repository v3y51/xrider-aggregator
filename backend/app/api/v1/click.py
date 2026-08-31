"""
Click Tracking + CPC Billing — Adım 9
POST /api/v1/click/{offer_id}

Her tıklama:
1. Click fraud tespiti (aynı session × 5 dk × 3 tıklama)
2. Finansal audit log (click_events tablosu)
3. Satıcı bakiyesinden CPC düş
4. Bakiye sıfırsa teklifi pasife al
5. Kullanıcıyı mağaza URL'sine yönlendir

KVKK: IP ve session SHA-256 + salt ile hash'lenir, ham değer asla tutulmaz.
"""

import hashlib
import time
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import structlog

from app.core.config import settings
from app.core.database import get_db

router = APIRouter()
logger = structlog.get_logger()


def _hash_value(value: str, salt: str = "") -> str:
    """KVKK uyumlu SHA-256 hash."""
    return hashlib.sha256(f"{salt}{value}".encode()).hexdigest()


def _get_session_id(request: Request) -> str:
    """Session ID — cookie'den al veya fallback olarak hash'lenmiş IP kullan."""
    session = request.cookies.get("xrider_session")
    if not session:
        ip = request.client.host if request.client else "unknown"
        session = _hash_value(ip, settings.IP_HASH_SALT)[:16]
    return session


@router.post("/click/{offer_id}")
async def track_click(
    offer_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Tıklama olayını işler ve kullanıcıyı mağazaya yönlendirir.
    Tüm finansal işlemler tek transaction içinde gerçekleşir.
    """
    # ── 1. Teklif bilgilerini çek ─────────────────────────────────────────
    offer_row = await db.execute(
        text("""
            SELECT o.id, o.product_id, o.seller_id, o.offer_url,
                   o.status, o.is_sponsored,
                   s.balance, s.cpc_rate, s.name as seller_name
            FROM offers o
            JOIN sellers s ON s.id = o.seller_id
            WHERE o.id = :oid
        """),
        {"oid": offer_id},
    )
    offer = offer_row.fetchone()

    if not offer:
        raise HTTPException(status_code=404, detail="Teklif bulunamadı")

    if offer.status != "active":
        # Teklif pasif — yine de yönlendir ama faturalandırma
        logger.warning("Pasif teklif tıklandı", offer_id=offer_id)
        return RedirectResponse(url=offer.offer_url, status_code=302)

    # ── 2. KVKK: IP ve session hash'le ──────────────────────────────────
    client_ip = request.client.host if request.client else "0.0.0.0"
    ip_hash = _hash_value(client_ip, settings.IP_HASH_SALT)
    session_id = _get_session_id(request)
    session_hash = _hash_value(session_id)
    ua_hash = _hash_value(request.headers.get("user-agent", ""))

    # ── 3. Click Fraud Tespiti ───────────────────────────────────────────
    fraud, fraud_reason = await _detect_fraud(db, session_hash, offer_id)

    # ── 4. CPC hesapla ───────────────────────────────────────────────────
    cpc_amount = float(offer.cpc_rate) if not fraud else 0.0
    balance_before = float(offer.balance)
    balance_after = max(0.0, balance_before - cpc_amount) if not fraud else balance_before

    # ── 5. click_events tablosuna yaz (audit trail) ───────────────────────
    await db.execute(
        text("""
            INSERT INTO click_events (
                offer_id, seller_id, product_id,
                session_hash, ip_hash, user_agent_hash,
                cpc_amount, balance_before, balance_after,
                is_fraud, fraud_reason,
                referrer_url, created_at
            ) VALUES (
                :offer_id, :seller_id, :product_id,
                :session_hash, :ip_hash, :ua_hash,
                :cpc, :bal_before, :bal_after,
                :is_fraud, :fraud_reason,
                :referrer, :now
            )
        """),
        {
            "offer_id": offer_id,
            "seller_id": offer.seller_id,
            "product_id": offer.product_id,
            "session_hash": session_hash,
            "ip_hash": ip_hash,
            "ua_hash": ua_hash,
            "cpc": cpc_amount,
            "bal_before": balance_before,
            "bal_after": balance_after,
            "is_fraud": fraud,
            "fraud_reason": fraud_reason,
            "referrer": request.headers.get("referer", "")[:1000],
            "now": datetime.utcnow(),
        },
    )

    if not fraud and cpc_amount > 0:
        # ── 6. Bakiye düş ─────────────────────────────────────────────
        await db.execute(
            text("""
                UPDATE sellers SET
                    balance = balance - :cpc,
                    total_clicks = total_clicks + 1,
                    total_spent = total_spent + :cpc
                WHERE id = :sid
            """),
            {"cpc": cpc_amount, "sid": offer.seller_id},
        )

        # ── 7. Bakiye sıfırsa teklifi pasife al ───────────────────────
        if balance_after <= 0:
            await db.execute(
                text("""
                    UPDATE offers SET status = 'inactive'
                    WHERE seller_id = :sid AND status = 'active'
                """),
                {"sid": offer.seller_id},
            )
            logger.warning(
                "Satıcı bakiyesi bitti — teklifler pasife alındı",
                seller_id=offer.seller_id,
                seller_name=offer.seller_name,
            )

        # Ürün tıklanma sayacı
        await db.execute(
            text("UPDATE products SET click_count = click_count + 1 WHERE id = :pid"),
            {"pid": offer.product_id},
        )

    logger.info(
        "Tıklama işlendi",
        offer_id=offer_id,
        seller=offer.seller_name,
        cpc=cpc_amount,
        fraud=fraud,
        balance_after=balance_after,
    )

    # ── 8. Mağazaya yönlendir ────────────────────────────────────────────
    return RedirectResponse(url=offer.offer_url, status_code=302)


async def _detect_fraud(
    db: AsyncSession, session_hash: str, offer_id: int
) -> tuple[bool, Optional[str]]:
    """
    Click fraud tespiti.
    Kural: Aynı session'dan 5 dakika içinde 3'ten fazla tıklama → fraud.
    """
    window = datetime.utcnow() - timedelta(seconds=settings.CLICK_FRAUD_WINDOW_SECONDS)
    row = await db.execute(
        text("""
            SELECT COUNT(*) as cnt
            FROM click_events
            WHERE session_hash = :sh
              AND offer_id = :oid
              AND created_at >= :window
              AND is_fraud = false
        """),
        {"sh": session_hash, "oid": offer_id, "window": window},
    )
    count = row.scalar() or 0
    if count >= settings.CLICK_FRAUD_MAX_PER_WINDOW:
        return True, f"Aynı session'dan {count} tıklama ({settings.CLICK_FRAUD_WINDOW_SECONDS}s içinde)"
    return False, None
