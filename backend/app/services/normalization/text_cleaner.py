"""
Metin Temizleme Servisi
HTML tag'larını, gereksiz boşlukları ve özel karakterleri temizler.
"""

import re
from html.parser import HTMLParser


class _HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []

    def handle_data(self, d):
        self.fed.append(d)

    def get_data(self):
        return " ".join(self.fed)


def strip_html(text: str | None) -> str | None:
    """HTML tag'larını temizler."""
    if not text:
        return text
    stripper = _HTMLStripper()
    stripper.feed(text)
    clean = stripper.get_data()
    return " ".join(clean.split()).strip() or None


def clean_title(title: str | None) -> str | None:
    """Başlıktan gereksiz karakterleri ve fazla boşlukları temizler."""
    if not title:
        return None
    # HTML temizle
    title = strip_html(title) or ""
    # Çoklu boşluk → tek boşluk
    title = re.sub(r'\s+', ' ', title).strip()
    # 500 karakter sınırı
    return title[:500] if title else None


def clean_description(desc: str | None) -> str | None:
    """Açıklamadan HTML ve gereksiz boşluk temizler."""
    if not desc:
        return None
    cleaned = strip_html(desc) or ""
    return cleaned[:5000] if cleaned else None
