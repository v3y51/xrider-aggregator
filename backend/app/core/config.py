from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # ── App ─────────────────────────────────────────────────
    APP_NAME: str = "XRider Aggregator"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "change-me-in-production-please"
    DEBUG: bool = True

    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://xrider:xrider_dev_pass@localhost:5432/xrider"
    DATABASE_URL_SYNC: str = "postgresql+psycopg2://xrider:xrider_dev_pass@localhost:5432/xrider"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # ── Redis ────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Meilisearch ──────────────────────────────────────────
    MEILISEARCH_URL: str = "http://localhost:7700"
    MEILISEARCH_MASTER_KEY: str = "xrider_meili_dev_key"
    MEILISEARCH_INDEX_PRODUCTS: str = "products"

    # ── Click Fraud ──────────────────────────────────────────
    CLICK_FRAUD_WINDOW_SECONDS: int = 300    # 5 dakika içinde aynı session'dan tekrar tıklama
    CLICK_FRAUD_MAX_PER_WINDOW: int = 3

    # ── Feed ─────────────────────────────────────────────────
    FEED_TIMEOUT_SECONDS: int = 30
    FEED_MAX_SIZE_MB: int = 100

    # ── Matching Thresholds ──────────────────────────────────
    MATCH_AUTO_CONFIRM_SCORE: float = 0.85    # üstü → otomatik eşleştir
    MATCH_PENDING_REVIEW_SCORE: float = 0.55  # arasındaysa → pending_review
    # altı → yeni ürün olarak kaydet

    # ── CDN / Storage ────────────────────────────────────────
    CDN_BASE_URL: str = "http://localhost:8000/static"
    STATIC_DIR: str = "static/images"

    # ── KVKK ─────────────────────────────────────────────────
    IP_HASH_SALT: str = "kvkk-salt-change-me"
    CLICK_LOG_RETENTION_DAYS: int = 730      # 2 yıl audit

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


settings = Settings()
