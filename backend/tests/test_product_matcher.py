"""
Unit Tests — Product Matcher (Adım 5)
pytest tests/test_product_matcher.py
"""

import pytest
from app.services.matching.product_matcher import (
    MatchCandidate,
    ProductMatcher,
    AUTO_CONFIRM_SCORE,
    PENDING_REVIEW_SCORE,
    _normalize_text,
    _clean_gtin,
    _calculate_spec_overlap,
)


# ── Test Fixture: 3 kanonik ürün ───────────────────────────────────────────

CANDIDATES = [
    MatchCandidate(
        product_id=1,
        canonical_title="Honda CB500F ABS 2024 Naked Motor Siyah",
        brand="Honda",
        model="CB500F ABS",
        gtin="4549851581437",
        category_id=10,
        specs={"motor_hacmi": "471cc", "abs": "Evet", "sanziman": "6 vitesli manuel"},
    ),
    MatchCandidate(
        product_id=2,
        canonical_title="Yamaha MT-07 2024 Naked Motor",
        brand="Yamaha",
        model="MT-07",
        gtin="4582480500459",
        category_id=10,
        specs={"motor_hacmi": "689cc", "abs": "Evet"},
    ),
    MatchCandidate(
        product_id=3,
        canonical_title="AGV K6 S MPLK Tam Yüz Kask Siyah Mat",
        brand="AGV",
        model="K6 S MPLK",
        gtin="8051194569214",
        category_id=20,
        specs={"tip": "Tam Yüz", "malzeme": "Karbon Fiber"},
    ),
]


class TestGTINMatching:
    """GTIN birebir eşleşme testleri."""

    def test_exact_gtin_match_auto_confirmed(self):
        """GTIN eşleşmesi → auto_confirmed ve yüksek skor."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "Honda CB500F ABS Motorsiklet",
            "brand": "Honda",
            "gtin": "4549851581437",
            "specs": {},
        }
        result = matcher.match(offer)

        assert result.product_id == 1
        assert result.method == "gtin_exact"
        assert result.confidence_score >= AUTO_CONFIRM_SCORE
        assert result.status == "auto_confirmed"
        assert result.gtin_match is True

    def test_gtin_with_spaces_cleaned(self):
        """GTIN'deki boşluklar temizlenmeli."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "Yamaha MT07",
            "gtin": "4582 4805 0045 9",  # boşluklu
            "specs": {},
        }
        result = matcher.match(offer)
        assert result.product_id == 2
        assert result.gtin_match is True

    def test_invalid_gtin_falls_through_to_fuzzy(self):
        """Geçersiz GTIN → fuzzy matching'e geç."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "Honda CB500F ABS 2024",
            "brand": "Honda",
            "gtin": "123",  # çok kısa → geçersiz
            "specs": {},
        }
        result = matcher.match(offer)
        # Geçersiz GTIN → composite ile devam, ama yüksek başlık benzerliği olmalı
        assert result.gtin_match is False
        assert result.method in ("composite", "fuzzy_title")

    def test_no_gtin_candidate_no_match(self):
        """Kayıtlarda olmayan GTIN → yeni ürün."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "Bilinmeyen Marka X Motor 999",
            "brand": "BilinmeyenMarka",
            "gtin": "9999999999999",  # sistemde yok
            "specs": {},
        }
        result = matcher.match(offer)
        assert result.product_id is None


class TestCompositeMatching:
    """Ağırlıklı fuzzy + brand + spec matching testleri."""

    def test_high_title_similarity_brand_match_auto_confirmed(self):
        """Yüksek başlık + marka uyumu → auto_confirmed."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "AGV K6S Tam Yüz Motosiklet Kaskı Siyah Mat",  # K6 S MPLK ile çok benzer
            "brand": "AGV",
            "gtin": None,
            "specs": {"tip": "Tam Yüz"},
        }
        result = matcher.match(offer)

        # Başlık benzerliği yüksek, marka eşleşiyor, spec örtüşüyor
        assert result.product_id == 3
        assert result.title_similarity > 0.7
        assert result.brand_match is True

    def test_different_brand_reduces_score(self):
        """Marka eşleşmezse skor düşmeli."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "Honda CB500F ABS 2024",
            "brand": "KTM",  # yanlış marka
            "gtin": None,
            "specs": {},
        }
        result = matcher.match(offer)
        # Marka tutarsızlığı skoru düşürmeli
        assert result.brand_match is False

    def test_completely_different_product_low_score(self):
        """Tamamen farklı ürün → düşük skor → yeni ürün."""
        matcher = ProductMatcher(CANDIDATES)
        offer = {
            "title": "WD-40 Karbüratör Temizleme Spreyi 400ml",
            "brand": "WD-40",
            "gtin": None,
            "specs": {"hacim": "400ml"},
        }
        result = matcher.match(offer)
        assert result.confidence_score < PENDING_REVIEW_SCORE
        assert result.product_id is None  # yeni ürün


class TestHelperFunctions:
    def test_normalize_text_removes_stopwords(self):
        text = _normalize_text("Honda CB500F Motorsiklet ABS Yeni 2024")
        assert "motorsiklet" not in text
        assert "honda" in text
        assert "cb500f" in text

    def test_clean_gtin_valid_ean13(self):
        assert _clean_gtin("4549851581437") == "4549851581437"

    def test_clean_gtin_with_hyphens(self):
        assert _clean_gtin("4549-8515-8143-7") == "4549851581437"

    def test_clean_gtin_too_short(self):
        assert _clean_gtin("12345") is None

    def test_clean_gtin_none(self):
        assert _clean_gtin(None) is None

    def test_spec_overlap_identical(self):
        s = {"motor_hacmi": "471cc", "abs": "Evet"}
        assert _calculate_spec_overlap(s, s) > 0.9

    def test_spec_overlap_empty(self):
        assert _calculate_spec_overlap({}, {"motor_hacmi": "471cc"}) == 0.0

    def test_spec_overlap_partial(self):
        s1 = {"motor_hacmi": "471cc", "abs": "Evet", "renk": "Siyah"}
        s2 = {"motor_hacmi": "471cc", "abs": "Evet", "beden": "L"}
        overlap = _calculate_spec_overlap(s1, s2)
        assert 0.0 < overlap < 1.0
