import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PriceHistoryChart from "@/components/PriceHistoryChart";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Offer {
  id: number;
  seller_name: string;
  seller_slug: string;
  logo_url: string;
  trust_score: number;
  price: number;
  shipping_cost: number;
  total_price: number;
  stock_status: string;
  offer_url: string;
  is_sponsored: boolean;
  last_checked_at: string;
}

interface Product {
  id: number;
  canonical_title: string;
  brand: string;
  model: string;
  slug: string;
  main_image_url: string;
  additional_images: string[];
  description: string;
  min_price_with_shipping: number;
  offer_count: number;
  specs: Record<string, string>;
  category_name: string;
  taxonomy_path: string;
}

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API}/api/v1/products/${slug}`, { next: { revalidate: 300 } });
    if (res.status === 404) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await fetchProduct(params.slug);
  if (!data) return { title: "Ürün Bulunamadı" };
  const { product } = data;
  return {
    title: `${product.canonical_title} Fiyatları`,
    description: `${product.canonical_title} için ${product.offer_count} mağazadan en iyi fiyat. En ucuz: ₺${Number(product.min_price_with_shipping).toLocaleString("tr-TR")}`,
    openGraph: {
      title: product.canonical_title,
      images: product.main_image_url ? [product.main_image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const data = await fetchProduct(params.slug);
  if (!data) notFound();

  const { product, offers, price_history }: { product: Product; offers: Offer[]; price_history: any[] } = data;

  const sponsored = offers.filter((o) => o.is_sponsored);
  const regular = offers.filter((o) => !o.is_sponsored);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-orange-500">Ana Sayfa</a>
        {" / "}
        <span className="text-gray-800">{product.canonical_title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol: Ürün Bilgileri */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-4">
            {product.main_image_url ? (
              <img
                src={product.main_image_url}
                alt={product.canonical_title}
                className="w-full aspect-square object-contain rounded-lg bg-gray-50"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-8xl">
                🏍️
              </div>
            )}
          </div>

          {/* Teknik Özellikler */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-4 bg-white border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Teknik Özellikler</h3>
              <dl className="space-y-2">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <dt className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</dt>
                    <dd className="font-medium text-gray-900">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Sağ: Fiyat Karşılaştırma */}
        <div className="lg:col-span-2 space-y-6">
          {/* Başlık */}
          <div>
            <p className="text-sm font-semibold text-orange-500 uppercase">{product.brand}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.canonical_title}</h1>
            <p className="text-gray-500 mt-1">{product.offer_count} satıcıda karşılaştırılıyor</p>
          </div>

          {/* En Düşük Fiyat Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-orange-600">En Düşük Fiyat (Kargo Dahil)</p>
              <p className="text-3xl font-bold text-orange-500">
                ₺{Number(product.min_price_with_shipping).toLocaleString("tr-TR")}
              </p>
            </div>
            <span className="text-4xl">🏷️</span>
          </div>

          {/* Sponsorlu Teklifler */}
          {sponsored.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">
                  SPONSORlu
                </span>
                <span className="text-xs text-gray-400">Mağazalar tarafından öne çıkarılmıştır</span>
              </div>
              <div className="space-y-2">
                {sponsored.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}

          {/* Normal Teklifler */}
          <div>
            {sponsored.length > 0 && (
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                Tüm Teklifler
              </h3>
            )}
            <div className="space-y-2">
              {regular.map((offer) => (
                <OfferRow key={offer.id} offer={offer} />
              ))}
            </div>
          </div>

          {/* Platform Sorumluluk Bildirimi */}
          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            ℹ️ XRider yalnızca fiyat karşılaştırma hizmeti sunar. Satış, ödeme, kargo ve iade
            işlemlerinden ilgili mağaza sorumludur. Yönlendirilen site XRider'dan bağımsızdır.
          </div>

          {/* Fiyat Geçmişi */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Fiyat Geçmişi (90 Gün)</h3>
            <PriceHistoryChart data={price_history} />
          </div>

          {/* Açıklama */}
          {product.description && (
            <div className="bg-white border rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Ürün Açıklaması</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferRow({ offer }: { offer: Offer }) {
  const stockColors: Record<string, string> = {
    in_stock: "text-green-600",
    limited: "text-yellow-600",
    out_of_stock: "text-red-500",
    unknown: "text-gray-400",
  };
  const stockLabels: Record<string, string> = {
    in_stock: "Stokta",
    limited: "Az kaldı",
    out_of_stock: "Tükendi",
    unknown: "—",
  };

  return (
    <div className={`flex items-center gap-3 bg-white border rounded-xl p-3 hover:border-orange-300 transition-colors ${offer.is_sponsored ? "border-yellow-200" : ""}`}>
      {/* Mağaza Logo/İsim */}
      <div className="w-20 shrink-0 text-center">
        {offer.logo_url ? (
          <img src={offer.logo_url} alt={offer.seller_name} className="h-8 w-auto mx-auto" />
        ) : (
          <span className="text-xs font-semibold text-gray-700 leading-tight block">{offer.seller_name}</span>
        )}
        <div className="flex justify-center mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={s <= Math.round(offer.trust_score / 2) ? "text-yellow-400 text-xs" : "text-gray-200 text-xs"}>★</span>
          ))}
        </div>
      </div>

      {/* Fiyat Detayı */}
      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">
            ₺{Number(offer.price).toLocaleString("tr-TR")}
          </span>
          {Number(offer.shipping_cost) > 0 && (
            <span className="text-xs text-gray-400">
              + ₺{Number(offer.shipping_cost).toLocaleString("tr-TR")} kargo
            </span>
          )}
          {Number(offer.shipping_cost) === 0 && (
            <span className="text-xs text-green-600 font-medium">Ücretsiz kargo</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-medium ${stockColors[offer.stock_status] || "text-gray-400"}`}>
            {stockLabels[offer.stock_status] || "—"}
          </span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">
            {new Date(offer.last_checked_at).toLocaleDateString("tr-TR")} güncellendi
          </span>
        </div>
      </div>

      {/* Mağazaya Git Butonu */}
      <a
        href={`/api/v1/click/${offer.id}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
        onClick={() => {
          // İleride analytics event eklenebilir
        }}
      >
        Mağazaya Git →
      </a>
    </div>
  );
}
