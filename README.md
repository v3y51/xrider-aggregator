# XRider Motor Aggregator

Türkiye'nin motorsiklet fiyat karşılaştırma platformu — xrider.com.tr

## Proje Yapısı

```
xrider-aggregator/
├── backend/      # Python/FastAPI REST API
├── worker/       # Celery arka plan işçileri
├── frontend/     # Next.js 14 SSR frontend
├── infra/        # Docker, CI/CD
└── mock-feeds/   # Test XML feed dosyaları
```

## Hızlı Başlangıç (Local)

```bash
# Bağımlılıkları kur ve servisleri başlat
docker compose up -d

# DB migration
cd backend && alembic upgrade head

# Frontend
cd frontend && npm install && npm run dev
```

## Mimari

- **Backend**: Python 3.12 / FastAPI 0.115
- **Worker**: Celery 5 + Redis (Upstash)
- **Frontend**: Next.js 14 (App Router, SSR)
- **Veritabanı**: PostgreSQL 16 (Supabase)
- **Arama**: Meilisearch
- **Fuzzy Matching**: RapidFuzz

## Deployment

- Frontend → Vercel (ücretsiz)
- Backend + Worker → Render.com (ücretsiz)
- DB → Supabase (ücretsiz)
- Redis → Upstash (ücretsiz)
- Arama → Meilisearch Cloud (ücretsiz)
