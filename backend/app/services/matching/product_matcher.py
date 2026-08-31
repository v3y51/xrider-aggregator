"""
XRider Product Matching Engine — Adım 5
Kural tabanlı eşleştirme: GTIN exact match + fuzzy title/brand + composite score

Eşleştirme stratejisi:
  a) GTIN/EAN eşleşmesi → yüksek güven (otomatik onay)
  b) Fuzzy title (token_set_ratio) + marka + kategori → ağırlıklı skor
  c) Skor > 0.85 → auto_confirmed
     Skor 0.55–0.85 → pending_review
     Skor < 0.55  → yeni ürün olarak kayıt
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Optional

from rapidfuzz import fuzz, utils as rfutils
from rapidfuzz.distance import JaroWinkler

import structlog

logger = structlog.get_logger()

# ── Eşik değerleri (config'den alınabilir) ──────────────────────────────────
AUTO_CONFIRM_SCORE = 0.85
PENDING_REVIEW_SCORE = 0.55

# ── Ağırlıklar ──────────────────────────────────────────────────────────────
W_GTIN = 0.40
W_TITLE = 0.25
W_BRAND = 0.20
W_SPEC = 0.15


@dataclass
class MatchCandidate:
    """Potansiyel eşleşme adayı."""
    product_id: int
    canonical_title: str
    brand: Optional[str]
    model: Optional[str]
    gtin: Optional[str]
    category_id: Optional[int]
    specs: dict = field(default_factory=dict)


@dataclass
class MatchResult:
    """Eşleştirme sonucu."""
    product_id: Optional[int]          # None → yeni ürün oluşturulacak
    method: str                         # "gtin_exact" | "fuzzy_title" | "composite"
    confidence_score: float             # 0.0 – 1.0
    gtin_match: bool = False
    title_similarity: float = 0.0
    brand_match: bool = False
    spec_overlap: float = 0.0
    status: str = "pending_review"      # "auto_confirmed" | "pending_review"
    reason: str = ""                    # debug açıklaması


# ─────────────────────────────────────────────────────────────────────────────
# Ana Eşleştirme Motoru
# ─────────────────────────────────────────────────────────────────────────────

class ProductMatcher:
    """
    Kural tabanlı ürün eşleştirme motoru.
    Her raw_offer için en iyi kanonik ürünü bulur.
    """

    def __init__(self, candidates: list[MatchCandidate]):
        self.candidates = candidates

    def match(self, offer: dict) -> MatchResult:
        """
        Bir raw_offer dict'i için en iyi eşleşmeyi döner.

        offer anahtarları: title, brand, model, gtin, specs, category_raw
        """
        # ── 1. GTIN exact match ───────────────────────────────────────────
        offer_gtin = _clean_gtin(offer.get("gtin"))
        if offer_gtin:
            gtin_result = self._match_by_gtin(offer_gtin)
            if gtin_result:
                return gtin_result

        # ── 2. Composite (fuzzy + brand + spec) match ─────────────────────
        return self._match_composite(offer)

    # ── GTIN Match ─────────────────────────────────────────────────────────

    def _match_by_gtin(self, gtin: str) -> Optional[MatchResult]:
        for candidate in self.candidates:
            candidate_gtin = _clean_gtin(candidate.gtin)
            if candidate_gtin and candidate_gtin == gtin:
                score = 1.0  # GTIN birebir eşleşme = tam güven
                # Not: GTIN eşleşmesi olsa bile diğer alanları kontrol et
                # (sahte GTIN sorununu minimize etmek için 0.95 kullan)
                final_score = 0.97
                status = "auto_confirmed" if final_score >= AUTO_CONFIRM_SCORE else "pending_review"
                logger.debug(
                    "GTIN eşleşmesi bulundu",
                    gtin=gtin,
                    product_id=candidate.product_id,
                )
                return MatchResult(
                    product_id=candidate.product_id,
                    method="gtin_exact",
                    confidence_score=final_score,
                    gtin_match=True,
                    title_similarity=0.0,  # GTIN eşleşmesinde hesaplanmaz
                    brand_match=True,
                    spec_overlap=0.0,
                    status=status,
                    reason=f"GTIN birebir: {gtin}",
                )
        return None

    # ── Composite Match ────────────────────────────────────────────────────

    def _match_composite(self, offer: dict) -> MatchResult:
        offer_title = _normalize_text(offer.get("title") or "")
        offer_brand = _normalize_text(offer.get("brand") or "")
        offer_specs = offer.get("specs") or {}

        if not offer_title:
            return MatchResult(
                product_id=None,
                method="composite",
                confidence_score=0.0,
                status="pending_review",
                reason="Başlık boş — eşleştirilemedi",
            )

        best_score = 0.0
        best_candidate = None
        best_details: dict = {}

        for candidate in self.candidates:
            cand_title = _normalize_text(candidate.canonical_title)
            cand_brand = _normalize_text(candidate.brand or "")

            # ── Başlık benzerliği ────────────────────────────────────────
            token_ratio = fuzz.token_set_ratio(offer_title, cand_title) / 100.0
            jw_ratio = JaroWinkler.normalized_similarity(offer_title, cand_title)
            title_sim = max(token_ratio, jw_ratio)  # en iyisini al

            # ── Marka eşleşmesi ──────────────────────────────────────────
            brand_match = False
            if offer_brand and cand_brand:
                brand_sim = fuzz.ratio(offer_brand, cand_brand) / 100.0
                brand_match = brand_sim > 0.85
            brand_score = 1.0 if brand_match else 0.0

            # ── Spec örtüşmesi ───────────────────────────────────────────
            spec_overlap = _calculate_spec_overlap(offer_specs, candidate.specs)

            # ── GTIN bileşeni (bu aşamada zaten 0 — match olmadı) ───────
            gtin_score = 0.0

            # ── Ağırlıklı kompozit skor ──────────────────────────────────
            composite = (
                gtin_score * W_GTIN +
                title_sim * W_TITLE +
                brand_score * W_BRAND +
                spec_overlap * W_SPEC
            )

            if composite > best_score:
                best_score = composite
                best_candidate = candidate
                best_details = {
                    "title_similarity": title_sim,
                    "brand_match": brand_match,
                    "spec_overlap": spec_overlap,
                }

        # ── Karar ────────────────────────────────────────────────────────
        if best_score >= AUTO_CONFIRM_SCORE and best_candidate:
            status = "auto_confirmed"
            product_id = best_candidate.product_id
            reason = f"Composite skor yeterli: {best_score:.3f}"
        elif best_score >= PENDING_REVIEW_SCORE and best_candidate:
            status = "pending_review"
            product_id = best_candidate.product_id
            reason = f"Orta güven, inceleme gerekli: {best_score:.3f}"
        else:
            status = "pending_review"
            product_id = None  # Yeni ürün olarak kaydet
            reason = f"Düşük skor ({best_score:.3f}) — yeni ürün"

        return MatchResult(
            product_id=product_id,
            method="composite" if best_candidate else "fuzzy_title",
            confidence_score=round(best_score, 4),
            gtin_match=False,
            title_similarity=round(best_details.get("title_similarity", 0.0), 4),
            brand_match=best_details.get("brand_match", False),
            spec_overlap=round(best_details.get("spec_overlap", 0.0), 4),
            status=status,
            reason=reason,
        )


# ─────────────────────────────────────────────────────────────────────────────
# Yardımcı Fonksiyonlar
# ─────────────────────────────────────────────────────────────────────────────

def _normalize_text(text: str) -> str:
    """Başlık ve marka normalizasyonu — karşılaştırma için."""
    if not text:
        return ""
    # Küçük harf, Türkçe karakter koru, gereksiz kelimeler çıkar
    text = text.lower().strip()
    # Model yılı, renk, beden gibi ayırt edici olmayan kelimeleri temizle
    stopwords = {
        "motorsiklet", "motosiklet", "motor", "naked", "scooter",
        "yeni", "orjinal", "orijinal", "set", "takım", "adet",
        "fiyat", "indirim", "kampanya",
    }
    tokens = [t for t in re.split(r'\s+', text) if t not in stopwords]
    return " ".join(tokens)


def _clean_gtin(gtin: str | None) -> str | None:
    """GTIN temizle ve doğrula."""
    if not gtin:
        return None
    cleaned = re.sub(r'\D', '', str(gtin))
    return cleaned if len(cleaned) in (8, 12, 13, 14) else None


def _calculate_spec_overlap(offer_specs: dict, candidate_specs: dict) -> float:
    """İki spec dict arasındaki örtüşme oranını hesapla."""
    if not offer_specs or not candidate_specs:
        return 0.0

    offer_keys = set(offer_specs.keys())
    candidate_keys = set(candidate_specs.keys())
    common_keys = offer_keys & candidate_keys

    if not common_keys:
        return 0.0

    match_count = 0
    for key in common_keys:
        v1 = _normalize_text(str(offer_specs.get(key, "")))
        v2 = _normalize_text(str(candidate_specs.get(key, "")))
        if v1 and v2 and fuzz.ratio(v1, v2) > 80:
            match_count += 1

    # Ortak anahtar sayısı üzerinden normalize et
    total_keys = len(offer_keys | candidate_keys)
    return match_count / total_keys if total_keys > 0 else 0.0


def _luhn_check(gtin: str) -> bool:
    """GTIN Luhn algoritması doğrulaması."""
    digits = [int(d) for d in gtin]
    odd_sum = sum(digits[-1::-2])
    even_sum = sum(sum(divmod(2 * d, 10)) for d in digits[-2::-2])
    return (odd_sum + even_sum) % 10 == 0
