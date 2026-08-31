"""
Seed verisi — Kategori ağacı ve örnek mağazalar
Revision ID: 0002_seed_categories
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from datetime import datetime

revision = "0002_seed_categories"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    categories_table = table(
        "categories",
        column("id", sa.Integer),
        column("parent_id", sa.Integer),
        column("name", sa.String),
        column("slug", sa.String),
        column("level", sa.Integer),
        column("taxonomy_path", sa.String),
        column("is_active", sa.Boolean),
        column("sort_order", sa.Integer),
        column("created_at", sa.DateTime),
    )

    now = datetime.utcnow()

    # Root kategoriler
    op.bulk_insert(categories_table, [
        # Seviye 0 — Kök
        {"id": 1, "parent_id": None, "name": "Motorsiklet",
         "slug": "motorsiklet", "level": 0, "taxonomy_path": "motorsiklet",
         "is_active": True, "sort_order": 1, "created_at": now},
        {"id": 2, "parent_id": None, "name": "Motor Aksesuarları",
         "slug": "motor-aksesuarlari", "level": 0, "taxonomy_path": "motor-aksesuarlari",
         "is_active": True, "sort_order": 2, "created_at": now},
        {"id": 3, "parent_id": None, "name": "Yedek Parça",
         "slug": "yedek-parca", "level": 0, "taxonomy_path": "yedek-parca",
         "is_active": True, "sort_order": 3, "created_at": now},

        # Seviye 1 — Motorsiklet alt kategorileri
        {"id": 10, "parent_id": 1, "name": "Naked Motor",
         "slug": "naked-motor", "level": 1, "taxonomy_path": "motorsiklet/naked-motor",
         "is_active": True, "sort_order": 1, "created_at": now},
        {"id": 11, "parent_id": 1, "name": "Scooter",
         "slug": "scooter", "level": 1, "taxonomy_path": "motorsiklet/scooter",
         "is_active": True, "sort_order": 2, "created_at": now},
        {"id": 12, "parent_id": 1, "name": "Enduro / Cross",
         "slug": "enduro-cross", "level": 1, "taxonomy_path": "motorsiklet/enduro-cross",
         "is_active": True, "sort_order": 3, "created_at": now},
        {"id": 13, "parent_id": 1, "name": "Sport Motor",
         "slug": "sport-motor", "level": 1, "taxonomy_path": "motorsiklet/sport-motor",
         "is_active": True, "sort_order": 4, "created_at": now},
        {"id": 14, "parent_id": 1, "name": "Touring",
         "slug": "touring", "level": 1, "taxonomy_path": "motorsiklet/touring",
         "is_active": True, "sort_order": 5, "created_at": now},

        # Seviye 1 — Aksesuar alt kategorileri
        {"id": 20, "parent_id": 2, "name": "Kask",
         "slug": "kask", "level": 1, "taxonomy_path": "motor-aksesuarlari/kask",
         "is_active": True, "sort_order": 1, "created_at": now},
        {"id": 21, "parent_id": 2, "name": "Eldiven",
         "slug": "eldiven", "level": 1, "taxonomy_path": "motor-aksesuarlari/eldiven",
         "is_active": True, "sort_order": 2, "created_at": now},
        {"id": 22, "parent_id": 2, "name": "Bot & Ayakkabı",
         "slug": "bot-ayakkabi", "level": 1, "taxonomy_path": "motor-aksesuarlari/bot-ayakkabi",
         "is_active": True, "sort_order": 3, "created_at": now},
        {"id": 23, "parent_id": 2, "name": "Koruyucu Giysi",
         "slug": "koruyucu-giysi", "level": 1, "taxonomy_path": "motor-aksesuarlari/koruyucu-giysi",
         "is_active": True, "sort_order": 4, "created_at": now},
        {"id": 24, "parent_id": 2, "name": "GPS & Elektronik",
         "slug": "gps-elektronik", "level": 1, "taxonomy_path": "motor-aksesuarlari/gps-elektronik",
         "is_active": True, "sort_order": 5, "created_at": now},

        # Seviye 1 — Yedek Parça alt kategorileri
        {"id": 30, "parent_id": 3, "name": "Motor Parçaları",
         "slug": "motor-parcalari", "level": 1, "taxonomy_path": "yedek-parca/motor-parcalari",
         "is_active": True, "sort_order": 1, "created_at": now},
        {"id": 31, "parent_id": 3, "name": "Fren Sistemi",
         "slug": "fren-sistemi", "level": 1, "taxonomy_path": "yedek-parca/fren-sistemi",
         "is_active": True, "sort_order": 2, "created_at": now},
        {"id": 32, "parent_id": 3, "name": "Lastik & Jant",
         "slug": "lastik-jant", "level": 1, "taxonomy_path": "yedek-parca/lastik-jant",
         "is_active": True, "sort_order": 3, "created_at": now},
        {"id": 33, "parent_id": 3, "name": "Yağ & Bakım",
         "slug": "yag-bakim", "level": 1, "taxonomy_path": "yedek-parca/yag-bakim",
         "is_active": True, "sort_order": 4, "created_at": now},
    ])


def downgrade() -> None:
    op.execute("DELETE FROM categories WHERE id IN (1,2,3,10,11,12,13,14,20,21,22,23,24,30,31,32,33)")
