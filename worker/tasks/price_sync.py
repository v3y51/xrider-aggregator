from celeryconfig import app
import structlog

logger = structlog.get_logger()


@app.task(name="tasks.price_sync.deactivate_stale_offers", bind=True)
def deactivate_stale_offers(self):
    logger.info("Stale offers deaktivasyonu — Adım 6'da implemente edilecek")
    return {"status": "stub"}
