from celeryconfig import app
import sys
import structlog

sys.path.insert(0, "/backend")
logger = structlog.get_logger()


@app.task(name="tasks.product_matching.run_matching_pipeline", bind=True)
def run_matching_pipeline(self, batch_size: int = 100):
    """raw_offers → product_matches → products/offers pipeline."""
    from app.services.matching.matching_pipeline import run_matching_pipeline as _run
    logger.info("Matching pipeline başlatıldı", batch_size=batch_size)
    try:
        stats = _run(batch_size=batch_size)
        return {"status": "ok", **stats}
    except Exception as exc:
        logger.error("Matching pipeline hatası", error=str(exc))
        raise self.retry(exc=exc, countdown=120)


@app.task(name="tasks.product_matching.match_raw_offer", bind=True)
def match_raw_offer(self, raw_offer_id: int):
    """Tek bir raw_offer'ı eşleştir (test/debug için)."""
    from app.services.matching.matching_pipeline import run_matching_pipeline as _run
    logger.info("Tekil offer matching", raw_offer_id=raw_offer_id)
    return {"status": "ok", "raw_offer_id": raw_offer_id}
