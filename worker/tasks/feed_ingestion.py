"""
Feed Ingestion Task — Stub (Adım 4'te tam implementasyon yapılacak)
"""
from celeryconfig import app
import structlog

logger = structlog.get_logger()


@app.task(name="tasks.feed_ingestion.fetch_all_active_feeds", bind=True, max_retries=3)
def fetch_all_active_feeds(self):
    """Tüm aktif satıcıların feed'lerini çeker."""
    logger.info("Feed ingestion başlatıldı — Adım 4'te implemente edilecek")
    return {"status": "stub", "message": "Adım 4'te implemente edilecek"}


@app.task(name="tasks.feed_ingestion.fetch_seller_feed", bind=True, max_retries=3)
def fetch_seller_feed(self, seller_id: int):
    """Belirli bir satıcının feed'ini çeker."""
    logger.info("Seller feed çekiliyor", seller_id=seller_id)
    return {"status": "stub", "seller_id": seller_id}
