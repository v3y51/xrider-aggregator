"""
XRider Aggregator — SQLAlchemy ORM Models
Tüm 10 tablo buradan yönetilir.
"""

import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    BigInteger, Boolean, Column, DateTime, Enum, Float,
    ForeignKey, Integer, Numeric, String, Text, UniqueConstraint,
    Index, func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _now():
    return datetime.utcnow()


def _uuid():
    return str(uuid.uuid4())


# ─────────────────────────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────────────────────────

class SellerStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"


class FeedFormat(str, enum.Enum):
    xml = "xml"
    csv = "csv"
    json = "json"


class StockStatus(str, enum.Enum):
    in_stock = "in_stock"
    out_of_stock = "out_of_stock"
    limited = "limited"
    unknown = "unknown"


class MatchMethod(str, enum.Enum):
    gtin_exact = "gtin_exact"          # GTIN/EAN birebir eşleşme
    fuzzy_title = "fuzzy_title"        # sadece başlık benzerliği
    composite = "composite"            # ağırlıklı kompozit skor
    manual = "manual"                  # insan tarafından


class MatchStatus(str, enum.Enum):
    auto_confirmed = "auto_confirmed"  # skor > üst eşik
    pending_review = "pending_review"  # skor ortada
    rejected = "rejected"              # insan reddetti
    human_confirmed = "human_confirmed"


class OfferStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"             # bakiye bitti veya manuel
    paused = "paused"


# ─────────────────────────────────────────────────────────────────────────────
# 1. Sellers (Satıcılar/Mağazalar)
# ─────────────────────────────────────────────────────────────────────────────

class Seller(Base):
    __tablename__ = "sellers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False, unique=True)
    website_url = Column(String(500), nullable=False)
    logo_url = Column(String(500))
    contact_email = Column(String(200))

    # Feed bilgileri
    feed_url = Column(String(1000))
    feed_format = Column(Enum(FeedFormat), default=FeedFormat.xml)
    feed_interval_hours = Column(Integer, default=24)   # kaç saatte bir çekilsin
    last_feed_at = Column(DateTime)

    # Finansal
    balance = Column(Numeric(10, 4), default=0)         # TL cinsinden bakiye
    cpc_rate = Column(Numeric(6, 4), default=0.10)      # tıklama başı ücret (TL)
    total_clicks = Column(BigInteger, default=0)
    total_spent = Column(Numeric(12, 4), default=0)

    # Güven & durum
    trust_score = Column(Float, default=5.0)            # 0.0 – 10.0
    status = Column(Enum(SellerStatus), default=SellerStatus.pending)

    # Kimlik doğrulama (seller portal)
    api_key = Column(String(64), unique=True)

    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    # İlişkiler
    raw_offers = relationship("RawOffer", back_populates="seller")
    offers = relationship("Offer", back_populates="seller")
    click_events = relationship("ClickEvent", back_populates="seller")

    __table_args__ = (
        Index("ix_sellers_status", "status"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 2. Categories (Hiyerarşik Kategori Ağacı)
# ─────────────────────────────────────────────────────────────────────────────

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False, unique=True)
    level = Column(Integer, default=0)                  # 0=root, 1=alt, 2=alt-alt
    taxonomy_path = Column(String(500))                 # ör: "motorsiklet/aksesuar/kask"
    icon_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    created_at = Column(DateTime, default=_now, nullable=False)

    # İlişkiler
    parent = relationship("Category", remote_side=[id], back_populates="children")
    children = relationship("Category", back_populates="parent")
    products = relationship("Product", back_populates="category")


# ─────────────────────────────────────────────────────────────────────────────
# 3. RawOffers (Ham Feed Verileri)
# ─────────────────────────────────────────────────────────────────────────────

class RawOffer(Base):
    __tablename__ = "raw_offers"

    id = Column(BigInteger, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    feed_batch_id = Column(String(64), nullable=False, index=True)  # hangi feed çekiminden

    # Satıcının kendi kimliği
    external_id = Column(String(200))

    # Temel alanlar
    title = Column(String(500))
    description = Column(Text)
    price = Column(Numeric(12, 2))
    currency = Column(String(10), default="TRY")
    shipping_cost = Column(Numeric(8, 2), default=0)
    stock_status = Column(String(50))

    # Kimlik bilgileri
    gtin = Column(String(50))          # EAN/UPC/GTIN
    mpn = Column(String(100))          # Manufacturer Part Number
    brand = Column(String(200))
    model = Column(String(200))

    # Görseller (ham URL listesi — CDN'ye henüz taşınmadı)
    image_urls = Column(ARRAY(Text), default=[])

    # Kategorileme (ham — mağaza kendi kategorisi)
    category_raw = Column(String(500))

    # Tüm ham veri JSONB'de saklı (teknik specs, ek alanlar)
    specs = Column(JSONB, default={})
    raw_data = Column(JSONB, default={})

    # Parse hataları (pipeline durmadan loglanır)
    parse_errors = Column(JSONB, default=[])

    # İşlem durumu
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime)

    created_at = Column(DateTime, default=_now, nullable=False)

    # İlişkiler
    seller = relationship("Seller", back_populates="raw_offers")
    matches = relationship("ProductMatch", back_populates="raw_offer")

    __table_args__ = (
        Index("ix_raw_offers_seller_batch", "seller_id", "feed_batch_id"),
        Index("ix_raw_offers_gtin", "gtin"),
        Index("ix_raw_offers_processed", "processed"),
        Index("ix_raw_offers_external", "seller_id", "external_id"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 4. Products (Kanonik Ürün Kataloğu)
# ─────────────────────────────────────────────────────────────────────────────

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    # Kanonik bilgiler
    canonical_title = Column(String(500), nullable=False)
    brand = Column(String(200), index=True)
    model = Column(String(200), index=True)
    slug = Column(String(600), nullable=False, unique=True)

    # Kimlik
    gtin = Column(String(50), index=True)
    mpn = Column(String(100))

    description = Column(Text)
    main_image_url = Column(String(500))
    additional_images = Column(ARRAY(Text), default=[])

    # Teknik özellikler — kategori bazlı (JSONB esnek)
    # Örn: {"motor_hacmi": "125cc", "sanziman": "manuel", "renk": "kırmızı"}
    specs = Column(JSONB, default={})

    # Fiyat özeti (offer tablosundan dönemsel güncellenir)
    min_price = Column(Numeric(12, 2))
    min_price_with_shipping = Column(Numeric(12, 2))
    offer_count = Column(Integer, default=0)

    # İstatistik
    view_count = Column(BigInteger, default=0)
    click_count = Column(BigInteger, default=0)

    # Arama
    search_boost = Column(Float, default=1.0)

    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    # İlişkiler
    category = relationship("Category", back_populates="products")
    matches = relationship("ProductMatch", back_populates="product")
    offers = relationship("Offer", back_populates="product")
    price_history = relationship("PriceHistory", back_populates="product")
    reviews = relationship("Review", back_populates="product")
    price_alerts = relationship("PriceAlert", back_populates="product")

    __table_args__ = (
        Index("ix_products_brand_model", "brand", "model"),
        Index("ix_products_gtin", "gtin"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 5. ProductMatches (Eşleştirme Kararları — Audit Trail)
# ─────────────────────────────────────────────────────────────────────────────

class ProductMatch(Base):
    __tablename__ = "product_matches"

    id = Column(BigInteger, primary_key=True, index=True)
    raw_offer_id = Column(BigInteger, ForeignKey("raw_offers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)  # None ise yeni ürün

    # Eşleştirme detayı
    method = Column(Enum(MatchMethod), nullable=False)
    confidence_score = Column(Float, nullable=False)   # 0.0 – 1.0

    # Bileşen skorları
    gtin_match = Column(Boolean, default=False)
    title_similarity = Column(Float, default=0.0)
    brand_match = Column(Boolean, default=False)
    spec_overlap = Column(Float, default=0.0)

    # Durum
    status = Column(Enum(MatchStatus), default=MatchStatus.pending_review)
    reviewed_by_human = Column(Boolean, default=False)
    reviewed_by = Column(String(200))          # admin kullanıcı adı
    reviewed_at = Column(DateTime)
    review_note = Column(Text)

    created_at = Column(DateTime, default=_now, nullable=False)

    # İlişkiler
    raw_offer = relationship("RawOffer", back_populates="matches")
    product = relationship("Product", back_populates="matches")

    __table_args__ = (
        Index("ix_product_matches_status", "status"),
        Index("ix_product_matches_raw_offer", "raw_offer_id"),
        Index("ix_product_matches_product", "product_id"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 6. Offers (Güncel Teklifler)
# ─────────────────────────────────────────────────────────────────────────────

class Offer(Base):
    __tablename__ = "offers"

    id = Column(BigInteger, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)

    # Satıcı tarafındaki ID
    seller_offer_id = Column(String(200))

    # Fiyat bilgileri
    price = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="TRY")
    shipping_cost = Column(Numeric(8, 2), default=0)
    total_price = Column(Numeric(12, 2))             # price + shipping_cost

    # Stok & görünürlük
    stock_status = Column(Enum(StockStatus), default=StockStatus.unknown)
    stock_quantity = Column(Integer)

    # Bağlantı
    offer_url = Column(String(1000), nullable=False)
    images = Column(ARRAY(Text), default=[])          # CDN'deki görseller

    # Sıralama sinyalleri
    status = Column(Enum(OfferStatus), default=OfferStatus.active)
    is_sponsored = Column(Boolean, default=False)
    sponsored_priority = Column(Integer, default=0)   # yüksek = daha önde

    # Tazelik
    last_checked_at = Column(DateTime, default=_now)
    stale_after_hours = Column(Integer, default=24)

    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    # İlişkiler
    product = relationship("Product", back_populates="offers")
    seller = relationship("Seller", back_populates="offers")
    price_history = relationship("PriceHistory", back_populates="offer")
    click_events = relationship("ClickEvent", back_populates="offer")

    __table_args__ = (
        UniqueConstraint("product_id", "seller_id", name="uq_offers_product_seller"),
        Index("ix_offers_product_status", "product_id", "status"),
        Index("ix_offers_total_price", "total_price"),
        Index("ix_offers_sponsored", "is_sponsored", "sponsored_priority"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 7. PriceHistory (Fiyat Geçmişi)
# ─────────────────────────────────────────────────────────────────────────────

class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(BigInteger, primary_key=True, index=True)
    offer_id = Column(BigInteger, ForeignKey("offers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)

    price = Column(Numeric(12, 2), nullable=False)
    shipping_cost = Column(Numeric(8, 2), default=0)
    total_price = Column(Numeric(12, 2))
    stock_status = Column(Enum(StockStatus))

    recorded_at = Column(DateTime, default=_now, nullable=False)

    # İlişkiler
    offer = relationship("Offer", back_populates="price_history")
    product = relationship("Product", back_populates="price_history")

    __table_args__ = (
        Index("ix_price_history_offer_time", "offer_id", "recorded_at"),
        Index("ix_price_history_product_time", "product_id", "recorded_at"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 8. ClickEvents (Tıklama Olayları — Finansal Audit Trail)
# ─────────────────────────────────────────────────────────────────────────────

class ClickEvent(Base):
    __tablename__ = "click_events"

    id = Column(BigInteger, primary_key=True, index=True)
    offer_id = Column(BigInteger, ForeignKey("offers.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # KVKK: IP ve session hash'lenerek saklanır, ham IP asla tutulmaz
    session_hash = Column(String(64), nullable=False)   # SHA-256
    ip_hash = Column(String(64), nullable=False)         # SHA-256 + salt
    user_agent_hash = Column(String(64))

    # Finansal kayıt
    cpc_amount = Column(Numeric(6, 4), nullable=False)
    balance_before = Column(Numeric(10, 4), nullable=False)
    balance_after = Column(Numeric(10, 4), nullable=False)

    # Click fraud
    is_fraud = Column(Boolean, default=False)
    fraud_reason = Column(String(200))

    # Bağlam
    referrer_url = Column(String(1000))

    created_at = Column(DateTime, default=_now, nullable=False)

    # İlişkiler
    offer = relationship("Offer", back_populates="click_events")
    seller = relationship("Seller", back_populates="click_events")

    __table_args__ = (
        Index("ix_click_events_seller_time", "seller_id", "created_at"),
        Index("ix_click_events_session", "session_hash", "created_at"),
        Index("ix_click_events_fraud", "is_fraud"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 9. Reviews (Değerlendirmeler)
# ─────────────────────────────────────────────────────────────────────────────

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=True)  # satıcıya özel yorum

    # KVKK: kullanıcı kimliği hash'lenerek saklanır
    user_hash = Column(String(64), nullable=False)

    rating = Column(Integer, nullable=False)           # 1 – 5
    title = Column(String(200))
    body = Column(Text)

    is_verified = Column(Boolean, default=False)       # doğrulanmış alıcı
    helpful_count = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now)

    # İlişkiler
    product = relationship("Product", back_populates="reviews")

    __table_args__ = (
        Index("ix_reviews_product", "product_id"),
        UniqueConstraint("product_id", "user_hash", name="uq_reviews_product_user"),
    )


# ─────────────────────────────────────────────────────────────────────────────
# 10. PriceAlerts (Fiyat Alarmları — KVKK Uyumlu)
# ─────────────────────────────────────────────────────────────────────────────

class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    # KVKK: e-posta hash'lenerek saklanır; gerçek e-posta şifreli tutulur
    email_hash = Column(String(64), nullable=False)
    email_encrypted = Column(String(500))          # AES-256 şifreli e-posta

    target_price = Column(Numeric(12, 2), nullable=False)

    notification_sent = Column(Boolean, default=False)
    sent_at = Column(DateTime)

    created_at = Column(DateTime, default=_now, nullable=False)
    expires_at = Column(DateTime)                  # TTL: varsayılan 90 gün

    # İlişkiler
    product = relationship("Product", back_populates="price_alerts")

    __table_args__ = (
        Index("ix_price_alerts_product_price", "product_id", "target_price"),
        Index("ix_price_alerts_sent", "notification_sent"),
    )
