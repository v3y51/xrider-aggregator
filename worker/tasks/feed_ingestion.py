"""
Feed Ingestion Celery Tasks — Adım 4 (Tam Implementasyon)
"""
import structlog
from celeryconfig import app
from app.services.ingestion.ingestion_service import (
    ingest_seller_feed,
    ingest_all_active_sellers,
)

logger = structlog.get_logger()


@app.task(
    name="tasks.feed_ingestion.fetch_all_active_feeds",
    bind=True,
    max_retries=2,
    default_retry_delay=300,  # 5 dakika sonra tekrar dene
)
def fetch_all_active_feeds(self):
    """Tüm aktif satıcıların feed'lerini çeker (Celery Beat tarafından tetiklenir)."""
    logger.info("Tüm feed'ler çekiliyor")
    try:
        results = ingest_all_active_sellers()
        total_inserted = sum(r.get("inserted", 0) for r in results)
        total_skipped = sum(r.get("skipped", 0) for r in results)
        logger.info(
            "Toplu feed ingestion tamamlandı",
            seller_count=len(results),
            total_inserted=total_inserted,
            total_skipped=total_skipped,
        )
        return {
            "status": "ok",
            "sellers": len(results),
            "inserted": total_inserted,
            "skipped": total_skipped,
        }
    except Exception as exc:
        logger.error("Toplu feed ingestion hatası", error=str(exc))
        raise self.retry(exc=exc)


@app.task(
    name="tasks.feed_ingestion.fetch_seller_feed",
    bind=True,
    max_retries=3,
    default_retry_delay=60,
)
def fetch_seller_feed(self, seller_id: int):
    """Belirli bir satıcının feed'ini çeker."""
    logger.info("Satıcı feed'i çekiliyor", seller_id=seller_id)
    try:
        result = ingest_seller_feed(seller_id)
        return result
    except Exception as exc:
        logger.error("Seller feed hatası", seller_id=seller_id, error=str(exc))
        raise self.retry(exc=exc)
