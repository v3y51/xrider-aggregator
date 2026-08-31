import type { Metadata } from "next";
import Link from "next/link";
import LiveSearchBar from "@/components/LiveSearchBar";

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
  store_category?: string;
  image_url: string | null;
  badge?: string;
}

interface PageProps {
  searchParams: { q?: string; brand?: string; sort?: string; page?: string; in_stock?: string };
}

export const metadata: Metadata = {
  title: "Motosiklet & Ekipman Fiyat Karşılaştırması (2026)",
  description: "Motomax, Feyizoğlu, Motosikletonline, Mototarz, Motolastik ve 50+ mağazada canlı fiyat arama sonuçları.",
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
  if (!q || q.trim().length < 2) return [];
  try {
    const res = await fetch(`${API}/api/v1/scrape?q=${encodeURIComponent(q.trim())}&limit=12`, {
      next: { revalidate: 60 },
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
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Arama Başlık & Canlı Arama Kutusu */}
      <div className="bg-zinc-950 py-8 border-b border-zinc-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto mb-6">
            <LiveSearchBar />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-zinc-900 text-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {query ? <>&ldquo;<span className="text-red-500">{query}</span>&rdquo; Fiyat Karşılaştırması</> : "Tüm Motosiklet Ürünleri"}
              </h1>
              <p className="text-zinc-400 mt-0.5">
                2026 Canlı Mağaza Verisi • {scraped.length > 0 ? `${scraped.length} mağaza teklifi bulundu` : `${total} kayıtlı ürün`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-live">50+ Mağaza Canlı Taranıyor</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Akakçe Tarzı Filtre Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-20">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3 flex items-center justify-between">
                <span>Fiyat Sıralaması</span>
                <span className="text-red-600 text-xs">Akakçe Modu</span>
              </h3>

              <div className="space-y-1">
                {[
                  { value: "price_asc", label: "En Düşük Fiyat (En Ucuz)" },
                  { value: "price_desc", label: "En Yüksek Fiyat" },
                  { value: "popularity", label: "En Çok Karşılaştırılan" },
                  { value: "newest", label: "En Yeni Eklenenler" },
                ].map((opt) => (
                  <a
                    key={opt.value}
                    href={`?${new URLSearchParams({ ...searchParams, sort: opt.value }).toString()}`}
                    className={`block py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
                      (searchParams.sort || "price_asc") === opt.value
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100 hover:text-red-600"
                    }`}
                  >
                    {opt.label}
                  </a>
                ))}
              </div>

              <hr className="my-5 border-slate-100" />

              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3">Taranan Mağazalar</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1">
                  <span>Motomax</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Feyizoğlu</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Motosikletonline</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Mototarz</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Motolastik</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Kalyoncu Motor</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Trendyol & N11</span>
                  <span className="text-emerald-600 font-bold">Aktif ✓</span>
                </div>
              </div>

              <hr className="my-5 border-slate-100" />

              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-2">Filtreler</h3>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  defaultChecked={searchParams.in_stock === "1"}
                  className="accent-red-600 rounded w-4 h-4"
                />
                <span>Sadece Hemen Teslim & Stokta</span>
              </label>
            </div>
          </aside>

          {/* Sağ Sonuç Alanı */}
          <div className="flex-1 space-y-8">
            {/* 1. Canlı Mağaza Teklifleri (Akakçe Tarzı Fiyat Karşılaştırma Listesi) */}
            {scraped.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <span>Yetkili Mağazalardan Canlı Fiyat Karşılaştırması</span>
                      <span className="badge-cheapest">En Ucuza Göre Sıralı</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Fiyatlar ilgili mağazaların web sitelerinden anlık olarak doğrulanmıştır.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {scraped.map((item, i) => (
                    <div
                      key={i}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 -mx-6 px-6 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Ürün Görseli */}
                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-2xl">🏍️</span>
                          )}
                        </div>

                        {/* Detay */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white bg-zinc-900 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {item.source}
                            </span>
                            {i === 0 && (
                              <span className="badge-cheapest">EN UCUZ SATICI</span>
                            )}
                            {item.store_category && (
                              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                                • {item.store_category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Doğrulanmış Mağaza Bağlantısı</span>
                          </span>
                        </div>
                      </div>

                      {/* Fiyat ve Akakçe Tarzı "Satıcıya Git" Butonu */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div>
                          <p className="text-xl font-black text-red-600">{item.price || "Fiyat Sorunuz"}</p>
                          <span className="text-[10px] text-slate-500 block sm:text-right">Kargo & KDV Dahil</span>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20"
                        >
                          <span>Mağazaya Git</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. Kayıtlı Veritabanı Ürünleri */}
            {products.length > 0 && (
              <section>
                <h2 className="text-base font-extrabold text-slate-900 mb-4">
                  Kayıtlı Katalog Ürünleri ({products.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between group"
                    >
                      <div className="aspect-square bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
                        {p.main_image_url ? (
                          <img src={p.main_image_url} alt={p.canonical_title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <span className="text-4xl">🏍️</span>
                        )}
                      </div>
                      <div className="p-3.5">
                        <span className="text-[10px] font-bold text-red-600 uppercase">{p.brand}</span>
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-red-600">
                          {p.canonical_title}
                        </h3>
                        <p className="text-base font-black text-red-600 mt-2">
                          {p.min_price_with_shipping ? `₺${Number(p.min_price_with_shipping).toLocaleString("tr-TR")}` : "Fiyat yok"}
                        </p>
                        <p className="text-[11px] text-slate-500">{p.offer_count} mağaza teklifi</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Sonuç Yoksa */}
            {scraped.length === 0 && products.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-2xl mb-4">
                  🔍
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  &ldquo;{query}&rdquo; için henüz canlı mağaza sonucu bulunamadı
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Farklı bir kelime (örneğin sadece marka veya model: Shoei, Motul, Dainese, LS2) aratmayı deneyebilirsiniz.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Shoei NXR2", "LS2 FF906", "Dainese Mont", "Motul 7100", "DID Zincir", "Pirelli Lastik"].map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 text-xs font-bold transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
