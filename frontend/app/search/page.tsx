import type { Metadata } from "next";

const API = process.env.NEXT_PUBLIC_API_URL || "https://xrider-backend.onrender.com";

interface Product {
  id: number;
  canonical_title: string;
  brand: string;
  model: string;
  slug: string;
  main_image_url: string;
  min_price: number;
  min_price_with_shipping: number;
  offer_count: number;
}

interface ScrapedItem {
  title: string;
  price: string | null;
  price_raw: number | null;
  url: string;
  source: string;
  image_url: string | null;
}

interface PageProps {
  searchParams: { q?: string; brand?: string; sort?: string; page?: string; in_stock?: string };
}

export const metadata: Metadata = {
  title: "Motor Arama Sonuclari",
  description: "Motorsiklet ve ekipman fiyat karsilastirma sonuclari",
};

async function fetchProducts(params: PageProps["searchParams"]) {
  const qs = new URLSearchParams({
    q: params.q || "",
    sort: params.sort || "price_asc",
    page: params.page || "1",
    per_page: "24",
    ...(params.brand ? { brand: params.brand } : {}),
    ...(params.in_stock === "1" ? { in_stock: "true" } : {}),
  });
  try {
    const res = await fetch(`${API}/api/v1/search?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return { products: [] as Product[], total: 0 };
    const data = await res.json();
    return { products: (data.hits || []) as Product[], total: (data.total || 0) as number };
  } catch {
    return { products: [] as Product[], total: 0 };
  }
}

async function fetchScraped(q: string): Promise<ScrapedItem[]> {
  if (!q || q.length < 2) return [];
  try {
    const res = await fetch(`${API}/api/v1/scrape?q=${encodeURIComponent(q)}&limit=8`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []) as ScrapedItem[];
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q || "";
  const [{ products, total }, scraped] = await Promise.all([
    fetchProducts(searchParams),
    fetchScraped(query),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? <>&ldquo;{query}&rdquo; icin sonuclar</> : "Tum Urunler"}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {total} kayitli urun{scraped.length > 0 && ` · ${scraped.length} canli magaza sonucu`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm sticky top-20">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Sirala</h3>
            {[
              { value: "price_asc", label: "En Ucuz" },
              { value: "price_desc", label: "En Pahal&iacute;" },
              { value: "popularity", label: "Populer" },
              { value: "newest", label: "En Yeni" },
            ].map((opt) => (
              <a
                key={opt.value}
                href={`?${new URLSearchParams({ ...searchParams, sort: opt.value }).toString()}`}
                className={`block py-2 px-3 rounded-xl text-sm mb-1 transition-colors ${
                  (searchParams.sort || "price_asc") === opt.value
                    ? "bg-orange-100 text-orange-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                }`}
                dangerouslySetInnerHTML={{ __html: opt.label }}
              />
            ))}
            <hr className="my-4 border-gray-100" />
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Filtre</h3>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" defaultChecked={searchParams.in_stock === "1"} className="accent-orange-500" />
              Sadece stokta
            </label>
          </div>
        </aside>

        <div className="flex-1 space-y-8">
          {/* Canli Scraping Sonuclari */}
          {scraped.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-gray-900">Canli Magaza Fiyatlari</h2>
                <span className="badge-live">Canli</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scraped.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div className="h-36 bg-gray-50 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-4xl">🏍️</span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <span className="text-xs text-emerald-600 font-semibold mb-1">{item.source}</span>
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">{item.title}</p>
                      {item.price && (
                        <p className="text-base font-bold text-orange-600 mt-2">{item.price}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* DB Urunleri */}
          {products.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-900 mb-4">Kayitli Urunler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                      {product.main_image_url ? (
                        <img
                          src={product.main_image_url}
                          alt={product.canonical_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🏍️</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">{product.brand}</p>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mt-0.5">{product.canonical_title}</h3>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {product.min_price_with_shipping
                          ? `₺${Number(product.min_price_with_shipping).toLocaleString("tr-TR")}`
                          : "Fiyat yok"}
                      </p>
                      <p className="text-xs text-gray-400">{product.offer_count} magaza</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {scraped.length === 0 && products.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-xl font-bold text-gray-700">Sonuc bulunamadi</p>
              <p className="mt-2 text-sm">Farkli arama terimleri deneyin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
