from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import structlog
import os

from app.core.config import settings

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("XRider Backend başlatılıyor", env=settings.ENVIRONMENT)
    # Otomatik tablo oluşturma (PostgreSQL)
    try:
        from app.core.database import engine, Base
        import app.models.models  # noqa: F401
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Veritabanı şeması ve tablolar başarıyla doğrulandı")
    except Exception as e:
        logger.warning("Veritabanı başlatma uyarısı", error=str(e))
    yield
    logger.info("XRider Backend kapatılıyor")


app = FastAPI(
    title="XRider Motor Aggregator API",
    description="Türkiye'nin motorsiklet fiyat karşılaştırma platformu",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
from app.api.v1 import router as api_v1_router  # noqa: E402
app.include_router(api_v1_router, prefix="/api/v1")

# ── Static Files (CDN görselleri local dev için) ──────────────────────────────
os.makedirs(settings.STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {"name": "XRider Motor Aggregator API", "status": "online", "docs": "/api/docs"}


@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.ENVIRONMENT}
