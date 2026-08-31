import os
from celery import Celery
from celery.schedules import crontab

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery(
    "xrider_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=[
        "tasks.feed_ingestion",
        "tasks.product_matching",
        "tasks.price_sync",
    ],
)

app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Europe/Istanbul",
    enable_utc=True,
    task_acks_late=True,            # işçi çöktüğünde task yeniden çalışsın
    worker_prefetch_multiplier=1,   # büyük feed'ler için bellek kontrolü
    task_soft_time_limit=600,       # 10 dk soft limit
    task_time_limit=900,            # 15 dk hard limit
    result_expires=3600,
)

# ── Zamanlanmış görevler ──────────────────────────────────────────────────────
app.conf.beat_schedule = {
    # Her 6 saatte bir aktif satıcıların feed'lerini çek
    "fetch-all-feeds-every-6h": {
        "task": "tasks.feed_ingestion.fetch_all_active_feeds",
        "schedule": crontab(minute=0, hour="*/6"),
    },
    # Her saat başı matching pipeline'ını çalıştır
    "run-matching-pipeline-hourly": {
        "task": "tasks.product_matching.run_matching_pipeline",
        "schedule": crontab(minute=15, hour="*"),
    },
    # Her gece yarısı bayat teklifleri pasife al
    "deactivate-stale-offers-daily": {
        "task": "tasks.price_sync.deactivate_stale_offers",
        "schedule": crontab(minute=0, hour=0),
    },
}
