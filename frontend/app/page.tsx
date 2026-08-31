import type { Metadata } from "next";
import Link from "next/link";
import LiveSearchBar from "@/components/LiveSearchBar";
import StoreCoverageBar from "@/components/StoreCoverageBar";
import UserTestimonials from "@/components/UserTestimonials";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "XRider — Türkiye'nin Motosiklet & Ekipman Fiyat Karşılaştırma Platformu (2026)",
  description:
    "Motomax, Feyizoğlu, Mototarz, Motosikletonline ve 50+ yetkili mağazadaki kask, mont, lastik, yedek parça ve aksesuar fiyatlarını tek ekranda canlı karşılaştırın. 2026 güncel fiyatları.",
};

const MAIN_CATEGORIES = [
  { name: "Kask (ECE 22.06)", query: "kask", icon: "🪖", badge: "Kapalı / Çene Açılır", color: "hover:border-red-500" },
  { name: "Motosiklet Montu", query: "motosiklet montu", icon: "🧥", badge: "Deri / Kumaş / 4 Mevsim", color: "hover:border-red-500" },
  { name: "Eldiven & Koruma", query: "motosiklet eldiveni", icon: "🧤", badge: "D3O / Karbon Korumalı", color: "hover:border-red-500" },
  { name: "Motosiklet Botu", query: "motosiklet botu", icon: "👢", badge: "Gore-Tex / Yarış / Şehir", color: "hover:border-red-500" },
  { name: "Lastik & Akü", query: "motosiklet lastigi", icon: "🛞", badge: "Pirelli / Michelin / Mitas", color: "hover:border-red-500" },
  { name: "Yedek Parça & Balata", query: "yedek parca", icon: "⚙️", badge: "DID / EBC / Orijinal", color: "hover:border-red-500" },
  { name: "İnterkom & Elektronik", query: "interkom", icon: "🎧", badge: "Cardo / Sena / Knmaster", color: "hover:border-red-500" },
  { name: "Çanta & Kilit", query: "motosiklet kilidi", icon: "🔒", badge: "Abus / Shad / Givi", color: "hover:border-red-500" },
];

const FEATURED_DEALS = [
  {
    title: "Shoei NXR2 Kapalı Motosiklet Kaskı",
    brand: "SHOEI",
    category: "Kapalı Kask",
    minPrice: "21.490 TL",
    maxPrice: "25.900 TL",
    discount: "-%17",
    lowestStore: "Motomax",
    offerCount: 8,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60",
    query: "Shoei NXR2",
  },
  {
    title: "Dainese Sevilla Air Tex Yazlık Fileli Mont",
    brand: "DAINESE",
    category: "Yazlık Mont",
    minPrice: "7.850 TL",
    maxPrice: "10.200 TL",
    discount: "-%23",
    lowestStore: "Motosikletonline",
    offerCount: 6,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=60",
    query: "Dainese Sevilla",
  },
  {
    title: "Pirelli Diablo Rosso IV Takım Lastik (120/160)",
    brand: "PIRELLI",
    category: "Motosiklet Lastiği",
    minPrice: "11.200 TL",
    maxPrice: "13.800 TL",
    discount: "-%19",
    lowestStore: "Motolastik",
    offerCount: 5,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=60",
    query: "Pirelli Diablo Rosso IV",
  },
  {
    title: "D.I.D 525 VX3 Pro-Street X-Ring Zincir Dişli Seti",
    brand: "D.I.D",
    category: "Yedek Parça",
    minPrice: "4.650 TL",
    maxPrice: "6.100 TL",
    discount: "-%24",
    lowestStore: "Kalyoncu Motor",
    offerCount: 9,
    image: "https://images.unsplash.com/photo-1589148938909-4d241c91ee52?w=500&auto=format&fit=crop&q=60",
    query: "DID 525 VX3",
  },
];

export default function Home() {
  return (
    <>
      {/* ── 1. Hero Bölümü (Akakçe Tarzı Koyu & Kırmızı Arama Motoru) ── */}
      <section className="bg-zinc-950 text-white relative overflow-hidden py-16 sm:py-24 border-b border-zinc-800">
        {/* Dekoratif Kırmızı Arka Plan Işığı */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/15 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>2026 Türkiye Motosiklet & Ekipman Fiyat Karşılaştırma Motoru</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5">
            50+ Mağazada <span className="text-red-500">En Ucuz Fiyatı</span> Tek Tıkla Bul
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-9">
            Motomax, Feyizoğlu, Mototarz, Motosikletonline, Motolastik ve onlarca uzman mağazanın fiyatlarını anlık karşılaştırın, binlerce lira tasarruf edin.
          </p>

          {/* Canlı Arama Çubuğu */}
          <LiveSearchBar />

          {/* İstatistik Göstergeleri */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-zinc-900">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">50+</p>
              <p className="text-xs text-zinc-400 mt-0.5">Yetkili Motor Mağazası</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-red-500">120.000+</p>
              <p className="text-xs text-zinc-400 mt-0.5">Güncel Ekipman & Parça</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">%35'e Varan</p>
              <p className="text-xs text-zinc-400 mt-0.5">Fiyat Farkı & Tasarruf</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">0 TL</p>
              <p className="text-xs text-zinc-400 mt-0.5">%100 Ücretsiz Hizmet</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Canlı Taranan Mağazalar Şeridi ── */}
      <StoreCoverageBar />

      {/* ── 3. Kategoriler (Akakçe Tarzı Izgara) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popüler Ekipman & Parça Kategorileri
            </h2>
            <p className="text-sm text-slate-500 mt-1">2026 ECE 22.06 sertifikalı kasklar, montlar ve onaylı yedek parçalar</p>
          </div>
          <Link href="/search" className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
            <span>Tüm Kategoriler</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MAIN_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={`/search?q=${encodeURIComponent(cat.query)}`}
              className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 group ${cat.color}`}
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 text-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-red-600 transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 truncate">{cat.badge}</p>
                <span className="text-[11px] font-bold text-red-600 mt-2 inline-flex items-center gap-1 group-hover:underline">
                  Fiyatları Karşılaştır ›
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Fırsat Ürünleri & Fiyatı Düşenler (Akakçe Tarzı Karşılaştırma Kartları) ── */}
      <section className="bg-slate-100/70 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-black uppercase">
                  Fırsat Takibi
                </span>
                <span className="text-xs font-semibold text-slate-500">2026 Canlı Mağaza Verileri</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Günün En Çok Karşılaştırılan Motosiklet Ürünleri
              </h2>
            </div>
            <Link href="/search?sort=popularity" className="text-sm font-bold text-red-600 hover:text-red-700 hidden sm:block">
              Tüm Fırsatları Gör →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_DEALS.map((deal, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Görsel Alanı */}
                  <div className="relative h-48 bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden">
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-sm">
                      {deal.discount}
                    </span>
                    <span className="absolute top-3 right-3 text-[11px] font-bold bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                      {deal.offerCount} Mağaza
                    </span>
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* İçerik */}
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase text-red-600 tracking-wider mb-1">
                      {deal.brand} • {deal.category}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-3 group-hover:text-red-600 transition-colors">
                      {deal.title}
                    </h3>

                    {/* Akakçe Tarzı Fiyat Kutusu */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase block">En Düşük Fiyat</span>
                          <span className="text-lg font-black text-red-600">{deal.minPrice}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase block">En Yüksek</span>
                          <span className="text-xs font-semibold text-slate-400 line-through">{deal.maxPrice}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">En ucuz satıcı:</span>
                        <strong className="text-slate-900 font-bold">{deal.lowestStore}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/search?q=${encodeURIComponent(deal.query)}`}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-red-600"
                  >
                    <span>{deal.offerCount} Mağazada Karşılaştır</span>
                    <span>›</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Gerçek Kullanıcı / Motorcu Yorumları (Sosyal Kanıt) ── */}
      <UserTestimonials />

      {/* ── 6. 2026 Uzman Rehberleri ve SEO Makaleleri ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                Editörün Masasından
              </span>
              <span className="text-xs text-slate-400">• 2026 Sezonu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Motosiklet & Ekipman Uzman Rehberleri
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
            <span>Tüm Yazılar ({articles.length})</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                    {a.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{a.readMin} dk okuma</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-red-600 transition-colors leading-snug mb-2">
                  {a.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {a.description}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{a.author.name}</span>
                <span>{new Date(a.date).toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
