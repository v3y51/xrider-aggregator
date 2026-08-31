import type { Metadata } from "next";
import Link from "next/link";
import LiveSearchBar from "@/components/LiveSearchBar";

export const metadata: Metadata = {
  title: "XRider — Motorsiklet ve Ekipman Fiyat Karsilastirma",
  description:
    "Kask, eldiven, bot, motor aksesuarlari ve motorsiklet fiyatlarini karsilastirin. N11, Trendyol ve daha fazla magaza.",
};

const CATEGORIES = [
  { name: "Naked Motor", slug: "naked+motor", emoji: "🏍️", color: "from-slate-700 to-slate-900" },
  { name: "Scooter", slug: "scooter", emoji: "🛵", color: "from-indigo-600 to-indigo-900" },
  { name: "Enduro", slug: "enduro+motor", emoji: "🏔️", color: "from-green-700 to-green-900" },
  { name: "Sport Motor", slug: "sport+motor", emoji: "⚡", color: "from-red-600 to-red-900" },
  { name: "Kask", slug: "motorsiklet+kask", emoji: "🪖", color: "from-orange-500 to-orange-800" },
  { name: "Koruyucu", slug: "motor+koruyucu", emoji: "🧤", color: "from-amber-600 to-amber-900" },
  { name: "Bot & Ayakkabi", slug: "motor+bot", emoji: "👢", color: "from-stone-600 to-stone-900" },
  { name: "Aksesuar", slug: "motor+aksesuar", emoji: "🔧", color: "from-teal-600 to-teal-900" },
];

const ARTICLES = [
  {
    slug: "en-iyi-motorsiklet-kask-2024",
    title: "Kafana Yatirim Yap: 2024te Gercekten Deger Veren Kasklar",
    excerpt: "Binlerce lira harcamadan once bunlari oku. Hem guvenlik hem fiyat dengesi icin en iyi 5 kask...",
    tag: "Guvenlik",
    readMin: 5,
  },
  {
    slug: "motorsiklet-bakim-rehberi",
    title: "Her Motosikletcinin Bilmesi Gereken 7 Basit Bakim Sirri",
    excerpt: "Yilda bir kez servise gitmek zorunda degilsin. Bunlari kendin yapabilirsin...",
    tag: "Bakim",
    readMin: 7,
  },
  {
    slug: "scooter-vs-naked-motor",
    title: "Scooter mi, Naked mi? Ikisini de Surdum, Iste Gercek",
    excerpt: "Iki yildir her gun is gidis-donusumde once scooter sonra naked kullandim. Tarafsiz karsilastirma...",
    tag: "Rehber",
    readMin: 6,
  },
];

const STATS = [
  { label: "Magazadan Canli Fiyat", value: "5+" },
  { label: "Kategori", value: "17" },
  { label: "Maliyet", value: "₺0" },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-orange-600/10 blur-2xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-24 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-orange-300 uppercase tracking-widest mb-4">
            <span className="badge-live">Canli Fiyat Karsilastirma</span>
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Motosiklet &amp; Ekipman&apos;da{" "}
            <span className="text-gradient">En Iyi Fiyati</span>{" "}
            Bul
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            N11, Trendyol, HepsiBurada ve daha fazla magazadan anlik fiyatlari
            karsilastir. Hicbir ureye gerek yok.
          </p>

          {/* Canli arama kutusu */}
          <LiveSearchBar />

          {/* Istatistikler */}
          <div className="mt-12 flex justify-center gap-10 flex-wrap">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-orange-400">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kategoriler ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-bold text-gray-900">Kategoriler</h2>
          <Link href="/search" className="text-sm text-orange-500 font-medium hover:underline">
            Tumunu Gor →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?q=${cat.slug}`}
              className={`card-hover bg-gradient-to-br ${cat.color} rounded-2xl p-4 flex flex-col items-center text-center group`}
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </span>
              <span className="text-xs font-semibold text-white/90 leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Nasil Calisir ─────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">Nasil Calisir?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Arat", desc: "Kask, eldiven ya da istedigin motosikleti yaz." },
              { n: "2", title: "Karsilastir", desc: "5+ magazadan canli fiyatlar saniyeler icinde gelir." },
              { n: "3", title: "Al", desc: "En ucuz magazaya tikla, oradan al." },
            ].map((s) => (
              <div key={s.n} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-black flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
                  {s.n}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog / Rehber ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-bold text-gray-900">Motor Rehberleri</h2>
          <Link href="/blog" className="text-sm text-orange-500 font-medium hover:underline">
            Tum Yazilar →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 h-32 flex items-center justify-center text-5xl">
                🏍️
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">
                  {a.tag} · {a.readMin} dk okuma
                </span>
                <h3 className="font-bold text-gray-900 mb-2 flex-1">{a.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
