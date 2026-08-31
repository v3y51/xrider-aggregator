"""
Unit Tests — Feed Parser (Adım 4)
pytest tests/test_feed_parser.py
"""

import pytest
from app.services.ingestion.feed_parser import parse_xml_feed, parse_csv_feed, generate_batch_id


VALID_XML = """<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <id>TEST-001</id>
    <title>Honda CB500F 2024 Naked Motor Siyah</title>
    <brand>Honda</brand>
    <model>CB500F</model>
    <gtin>4549851581437</gtin>
    <category>Motorsiklet > Naked Motor</category>
    <price currency="TRY">289500.00</price>
    <shipping_cost currency="TRY">0.00</shipping_cost>
    <stock_status>in_stock</stock_status>
    <stock_quantity>3</stock_quantity>
    <url>https://example.com/cb500f</url>
    <images>
      <image>https://example.com/img1.jpg</image>
    </images>
    <specs>
      <spec name="motor_hacmi">471cc</spec>
      <spec name="abs">Evet</spec>
    </specs>
  </product>
</products>
""".encode("utf-8")

BROKEN_XML = """<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <id>BROKEN-001</id>
    <title></title>
    <!-- Fiyat yok, baslik yok -->
    <brand>Test</brand>
    <url>https://example.com/broken</url>
  </product>
  <product>
    <id>VALID-002</id>
    <title>Yamaha MT-07 2024</title>
    <brand>Yamaha</brand>
    <price currency="TRY">399900.00</price>
    <url>https://example.com/mt07</url>
    <stock_status>in_stock</stock_status>
  </product>
</products>
""".encode("utf-8")

VALID_CSV = """id,title,brand,model,gtin,price,currency,shipping_cost,stock_status,url
CSV-001,AGV K6S Kask Siyah,AGV,K6S,8051194569214,18500.00,TRY,0,in_stock,https://example.com/agv-k6s
CSV-002,Motul 7100 4T Motor Yagi,Motul,7100 4T,3374650247205,1850.00,TRY,39.90,in_stock,https://example.com/motul
""".encode("utf-8")


class TestXMLParser:
    def test_valid_feed_parsed_correctly(self):
        """Geçerli XML feed doğru parse edilmeli."""
        valid, errors = parse_xml_feed(VALID_XML, seller_id=1, batch_id="test-batch-001")

        assert len(valid) == 1
        assert len(errors) == 0

        offer = valid[0]
        assert offer["title"] == "Honda CB500F 2024 Naked Motor Siyah"
        assert offer["brand"] == "Honda"
        assert offer["gtin"] == "4549851581437"
        assert float(offer["price"]) == 289500.0
        assert offer["currency"] == "TRY"
        assert offer["stock_status"] == "in_stock"
        assert offer["seller_id"] == 1
        assert offer["feed_batch_id"] == "test-batch-001"
        assert offer["specs"]["motor_hacmi"] == "471cc"
        assert len(offer["image_urls"]) == 1

    def test_broken_record_does_not_stop_pipeline(self):
        """Bozuk kayıt pipeline'ı durdurmamalı."""
        valid, errors = parse_xml_feed(BROKEN_XML, seller_id=1, batch_id="test-batch-002")

        # BROKEN-001 atlanmalı, VALID-002 geçmeli
        assert len(valid) == 1
        assert len(errors) == 1
        assert valid[0]["external_id"] == "VALID-002"
        assert errors[0]["external_id"] == "BROKEN-001"

    def test_gtin_cleaning(self):
        """GTIN sadece geçerli uzunluklarda kabul edilmeli."""
        valid, _ = parse_xml_feed(VALID_XML, seller_id=1, batch_id="batch")
        assert valid[0]["gtin"] == "4549851581437"  # 13 haneli EAN ✓

    def test_stock_normalization(self):
        """Stok durumu normalize edilmeli."""
        valid, _ = parse_xml_feed(VALID_XML, seller_id=1, batch_id="batch")
        assert valid[0]["stock_status"] == "in_stock"

    def test_invalid_xml_returns_fatal_error(self):
        """Geçersiz XML fatal hata dönmeli."""
        invalid = b"NOT XML AT ALL <<<"
        valid, errors = parse_xml_feed(invalid, seller_id=1, batch_id="batch")
        assert len(valid) == 0
        assert errors[0]["level"] == "fatal"


class TestCSVParser:
    def test_valid_csv_parsed(self):
        """CSV feed doğru parse edilmeli."""
        valid, errors = parse_csv_feed(VALID_CSV, seller_id=2, batch_id="csv-batch-001")

        assert len(valid) == 2
        assert len(errors) == 0
        assert valid[0]["title"] == "AGV K6S Kask Siyah"
        assert valid[0]["gtin"] == "8051194569214"
        assert float(valid[1]["shipping_cost"]) == 39.90


class TestBatchId:
    def test_batch_id_unique(self):
        """Her batch ID farklı olmalı."""
        b1 = generate_batch_id(1)
        b2 = generate_batch_id(1)
        assert b1 != b2

    def test_batch_id_format(self):
        """Batch ID seller_id ile başlamalı."""
        b = generate_batch_id(42)
        assert b.startswith("42-")
