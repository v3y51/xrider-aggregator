"""Initial schema — 10 tables

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── ENUMS ─────────────────────────────────────────────────────────────────
    seller_status = postgresql.ENUM(
        "active", "suspended", "pending", name="sellerstatus", create_type=False
    )
    feed_format = postgresql.ENUM(
        "xml", "csv", "json", name="feedformat", create_type=False
    )
    stock_status = postgresql.ENUM(
        "in_stock", "out_of_stock", "limited", "unknown", name="stockstatus", create_type=False
    )
    match_method = postgresql.ENUM(
        "gtin_exact", "fuzzy_title", "composite", "manual", name="matchmethod", create_type=False
    )
    match_status = postgresql.ENUM(
        "auto_confirmed", "pending_review", "rejected", "human_confirmed",
        name="matchstatus", create_type=False
    )
    offer_status = postgresql.ENUM(
        "active", "inactive", "paused", name="offerstatus", create_type=False
    )

    for e in [seller_status, feed_format, stock_status, match_method, match_status, offer_status]:
        e.create(op.get_bind(), checkfirst=True)

    # ── 1. sellers ────────────────────────────────────────────────────────────
    op.create_table(
        "sellers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False, unique=True),
        sa.Column("website_url", sa.String(500), nullable=False),
        sa.Column("logo_url", sa.String(500)),
        sa.Column("contact_email", sa.String(200)),
        sa.Column("feed_url", sa.String(1000)),
        sa.Column("feed_format", postgresql.ENUM("xml", "csv", "json", name="feedformat", create_type=False), default="xml"),
        sa.Column("feed_interval_hours", sa.Integer(), default=24),
        sa.Column("last_feed_at", sa.DateTime()),
        sa.Column("balance", sa.Numeric(10, 4), default=0),
        sa.Column("cpc_rate", sa.Numeric(6, 4), default=0.10),
        sa.Column("total_clicks", sa.BigInteger(), default=0),
        sa.Column("total_spent", sa.Numeric(12, 4), default=0),
        sa.Column("trust_score", sa.Float(), default=5.0),
        sa.Column("status", postgresql.ENUM("active", "suspended", "pending", name="sellerstatus", create_type=False), default="pending"),
        sa.Column("api_key", sa.String(64), unique=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index("ix_sellers_status", "sellers", ["status"])

    # ── 2. categories ─────────────────────────────────────────────────────────
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False, unique=True),
        sa.Column("level", sa.Integer(), default=0),
        sa.Column("taxonomy_path", sa.String(500)),
        sa.Column("icon_url", sa.String(500)),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("sort_order", sa.Integer(), default=0),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    # ── 3. raw_offers ─────────────────────────────────────────────────────────
    op.create_table(
        "raw_offers",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("seller_id", sa.Integer(), sa.ForeignKey("sellers.id"), nullable=False),
        sa.Column("feed_batch_id", sa.String(64), nullable=False),
        sa.Column("external_id", sa.String(200)),
        sa.Column("title", sa.String(500)),
        sa.Column("description", sa.Text()),
        sa.Column("price", sa.Numeric(12, 2)),
        sa.Column("currency", sa.String(10), default="TRY"),
        sa.Column("shipping_cost", sa.Numeric(8, 2), default=0),
        sa.Column("stock_status", sa.String(50)),
        sa.Column("gtin", sa.String(50)),
        sa.Column("mpn", sa.String(100)),
        sa.Column("brand", sa.String(200)),
        sa.Column("model", sa.String(200)),
        sa.Column("image_urls", postgresql.ARRAY(sa.Text()), default=[]),
        sa.Column("category_raw", sa.String(500)),
        sa.Column("specs", postgresql.JSONB(), default={}),
        sa.Column("raw_data", postgresql.JSONB(), default={}),
        sa.Column("parse_errors", postgresql.JSONB(), default=[]),
        sa.Column("processed", sa.Boolean(), default=False),
        sa.Column("processed_at", sa.DateTime()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_raw_offers_seller_batch", "raw_offers", ["seller_id", "feed_batch_id"])
    op.create_index("ix_raw_offers_gtin", "raw_offers", ["gtin"])
    op.create_index("ix_raw_offers_processed", "raw_offers", ["processed"])
    op.create_index("ix_raw_offers_external", "raw_offers", ["seller_id", "external_id"])

    # ── 4. products ───────────────────────────────────────────────────────────
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=True),
        sa.Column("canonical_title", sa.String(500), nullable=False),
        sa.Column("brand", sa.String(200)),
        sa.Column("model", sa.String(200)),
        sa.Column("slug", sa.String(600), nullable=False, unique=True),
        sa.Column("gtin", sa.String(50)),
        sa.Column("mpn", sa.String(100)),
        sa.Column("description", sa.Text()),
        sa.Column("main_image_url", sa.String(500)),
        sa.Column("additional_images", postgresql.ARRAY(sa.Text()), default=[]),
        sa.Column("specs", postgresql.JSONB(), default={}),
        sa.Column("min_price", sa.Numeric(12, 2)),
        sa.Column("min_price_with_shipping", sa.Numeric(12, 2)),
        sa.Column("offer_count", sa.Integer(), default=0),
        sa.Column("view_count", sa.BigInteger(), default=0),
        sa.Column("click_count", sa.BigInteger(), default=0),
        sa.Column("search_boost", sa.Float(), default=1.0),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_products_brand_model", "products", ["brand", "model"])
    op.create_index("ix_products_gtin", "products", ["gtin"])

    # ── 5. product_matches ────────────────────────────────────────────────────
    op.create_table(
        "product_matches",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("raw_offer_id", sa.BigInteger(), sa.ForeignKey("raw_offers.id"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=True),
        sa.Column("method", postgresql.ENUM("gtin_exact", "fuzzy_title", "composite", "manual", name="matchmethod", create_type=False), nullable=False),
        sa.Column("confidence_score", sa.Float(), nullable=False),
        sa.Column("gtin_match", sa.Boolean(), default=False),
        sa.Column("title_similarity", sa.Float(), default=0.0),
        sa.Column("brand_match", sa.Boolean(), default=False),
        sa.Column("spec_overlap", sa.Float(), default=0.0),
        sa.Column("status", postgresql.ENUM("auto_confirmed", "pending_review", "rejected", "human_confirmed", name="matchstatus", create_type=False), default="pending_review"),
        sa.Column("reviewed_by_human", sa.Boolean(), default=False),
        sa.Column("reviewed_by", sa.String(200)),
        sa.Column("reviewed_at", sa.DateTime()),
        sa.Column("review_note", sa.Text()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_product_matches_status", "product_matches", ["status"])
    op.create_index("ix_product_matches_raw_offer", "product_matches", ["raw_offer_id"])
    op.create_index("ix_product_matches_product", "product_matches", ["product_id"])

    # ── 6. offers ─────────────────────────────────────────────────────────────
    op.create_table(
        "offers",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("seller_id", sa.Integer(), sa.ForeignKey("sellers.id"), nullable=False),
        sa.Column("seller_offer_id", sa.String(200)),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(10), default="TRY"),
        sa.Column("shipping_cost", sa.Numeric(8, 2), default=0),
        sa.Column("total_price", sa.Numeric(12, 2)),
        sa.Column("stock_status", postgresql.ENUM("in_stock", "out_of_stock", "limited", "unknown", name="stockstatus", create_type=False), default="unknown"),
        sa.Column("stock_quantity", sa.Integer()),
        sa.Column("offer_url", sa.String(1000), nullable=False),
        sa.Column("images", postgresql.ARRAY(sa.Text()), default=[]),
        sa.Column("status", postgresql.ENUM("active", "inactive", "paused", name="offerstatus", create_type=False), default="active"),
        sa.Column("is_sponsored", sa.Boolean(), default=False),
        sa.Column("sponsored_priority", sa.Integer(), default=0),
        sa.Column("last_checked_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("stale_after_hours", sa.Integer(), default=24),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_unique_constraint("uq_offers_product_seller", "offers", ["product_id", "seller_id"])
    op.create_index("ix_offers_product_status", "offers", ["product_id", "status"])
    op.create_index("ix_offers_total_price", "offers", ["total_price"])
    op.create_index("ix_offers_sponsored", "offers", ["is_sponsored", "sponsored_priority"])

    # ── 7. price_history ──────────────────────────────────────────────────────
    op.create_table(
        "price_history",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("offer_id", sa.BigInteger(), sa.ForeignKey("offers.id"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("seller_id", sa.Integer(), sa.ForeignKey("sellers.id"), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=False),
        sa.Column("shipping_cost", sa.Numeric(8, 2), default=0),
        sa.Column("total_price", sa.Numeric(12, 2)),
        sa.Column("stock_status", postgresql.ENUM("in_stock", "out_of_stock", "limited", "unknown", name="stockstatus", create_type=False)),
        sa.Column("recorded_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_price_history_offer_time", "price_history", ["offer_id", "recorded_at"])
    op.create_index("ix_price_history_product_time", "price_history", ["product_id", "recorded_at"])

    # ── 8. click_events ───────────────────────────────────────────────────────
    op.create_table(
        "click_events",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("offer_id", sa.BigInteger(), sa.ForeignKey("offers.id"), nullable=False),
        sa.Column("seller_id", sa.Integer(), sa.ForeignKey("sellers.id"), nullable=False),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("session_hash", sa.String(64), nullable=False),
        sa.Column("ip_hash", sa.String(64), nullable=False),
        sa.Column("user_agent_hash", sa.String(64)),
        sa.Column("cpc_amount", sa.Numeric(6, 4), nullable=False),
        sa.Column("balance_before", sa.Numeric(10, 4), nullable=False),
        sa.Column("balance_after", sa.Numeric(10, 4), nullable=False),
        sa.Column("is_fraud", sa.Boolean(), default=False),
        sa.Column("fraud_reason", sa.String(200)),
        sa.Column("referrer_url", sa.String(1000)),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_click_events_seller_time", "click_events", ["seller_id", "created_at"])
    op.create_index("ix_click_events_session", "click_events", ["session_hash", "created_at"])
    op.create_index("ix_click_events_fraud", "click_events", ["is_fraud"])

    # ── 9. reviews ────────────────────────────────────────────────────────────
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("seller_id", sa.Integer(), sa.ForeignKey("sellers.id"), nullable=True),
        sa.Column("user_hash", sa.String(64), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(200)),
        sa.Column("body", sa.Text()),
        sa.Column("is_verified", sa.Boolean(), default=False),
        sa.Column("helpful_count", sa.Integer(), default=0),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )
    op.create_index("ix_reviews_product", "reviews", ["product_id"])
    op.create_unique_constraint("uq_reviews_product_user", "reviews", ["product_id", "user_hash"])

    # ── 10. price_alerts ──────────────────────────────────────────────────────
    op.create_table(
        "price_alerts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("product_id", sa.Integer(), sa.ForeignKey("products.id"), nullable=False),
        sa.Column("email_hash", sa.String(64), nullable=False),
        sa.Column("email_encrypted", sa.String(500)),
        sa.Column("target_price", sa.Numeric(12, 2), nullable=False),
        sa.Column("notification_sent", sa.Boolean(), default=False),
        sa.Column("sent_at", sa.DateTime()),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("expires_at", sa.DateTime()),
    )
    op.create_index("ix_price_alerts_product_price", "price_alerts", ["product_id", "target_price"])
    op.create_index("ix_price_alerts_sent", "price_alerts", ["notification_sent"])


def downgrade() -> None:
    # Ters sırada sil
    op.drop_table("price_alerts")
    op.drop_table("reviews")
    op.drop_table("click_events")
    op.drop_table("price_history")
    op.drop_table("offers")
    op.drop_table("product_matches")
    op.drop_table("products")
    op.drop_table("raw_offers")
    op.drop_table("categories")
    op.drop_table("sellers")

    # ENUM'ları temizle
    for enum_name in ["sellerstatus", "feedformat", "stockstatus",
                       "matchmethod", "matchstatus", "offerstatus"]:
        op.execute(f"DROP TYPE IF EXISTS {enum_name}")
