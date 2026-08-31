"""
Para birimi normalize servisi
USD, EUR, GBP → TRY dönüşümü
Gerçek projede: TCMB API veya Fixer.io kullanılacak
"""

import os
import structlog

logger = structlog.get_logger()

# Geliştirme aşamasında sabit kur — production'da TCMB'den çekilecek
_FALLBACK_RATES = {
    "TRY": 1.0,
    "USD": 32.5,   # örnek kur
    "EUR": 35.2,
    "GBP": 41.0,
}


def convert_to_try(amount: float, currency: str) -> float:
    """Verilen tutarı TRY'ye çevirir."""
    if currency == "TRY":
        return round(amount, 2)

    rate = _FALLBACK_RATES.get(currency.upper())
    if rate is None:
        logger.warning("Bilinmeyen para birimi — TRY varsayıldı", currency=currency)
        return round(amount, 2)

    converted = amount * rate
    logger.debug("Para birimi dönüşümü", amount=amount, from_=currency, to="TRY", result=converted)
    return round(converted, 2)
