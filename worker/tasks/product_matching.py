from celeryconfig import app
import structlog

logger = structlog.get_logger()


@app.task(name="tasks.product_matching.run_matching_pipeline", bind=True)
def run_matching_pipeline(self):
    logger.info("Matching pipeline — Adım 5'te implemente edilecek")
    return {"status": "stub"}


@app.task(name="tasks.product_matching.match_raw_offer", bind=True)
def match_raw_offer(self, raw_offer_id: int):
    logger.info("Offer matching", raw_offer_id=raw_offer_id)
    return {"status": "stub", "raw_offer_id": raw_offer_id}
