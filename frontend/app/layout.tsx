import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://xrider.com.tr"),
  title: {
    default: "XRider — Türkiye'nin 1 Numaralı Motosiklet & Ekipman Fiyat Karşılaştırma Platformu (2026)",
    template: "%s | XRider Fiyat Karşılaştırma",
  },
  description:
    "2026 Türkiye Motosiklet Fiyat Endeksi. Kask, mont, eldiven, bot, yedek parça ve lastik fiyatlarını Motomax, Feyizoğlu, Mototarz, Motosikletonline ve 50+ yetkili mağazada tek ekranda canlı karşılaştırın.",
  keywords: [
    "motosiklet fiyat karsilastirma 2026",
    "en ucuz motor kaski",
    "motosiklet ekipman fiyatlari",
    "motomax feyizoglu mototarz karsilastirma",
    "motosiklet yedek parca fiyatlari",
    "xrider motor fiyat",
    "akakce motor ekipman",
  ],
  authors: [{ name: "XRider Motosiklet Veri ve Araştırma Ekibi", url: "https://xrider.com.tr" }],
  creator: "XRider",
  publisher: "XRider Türkiye",
  openGraph: {
    siteName: "XRider",
    locale: "tr_TR",
    type: "website",
    url: "https://xrider.com.tr",
    title: "XRider — Türkiye'nin Motosiklet & Ekipman Fiyat Karşılaştırma Platformu (2026)",
    description: "50+ yetkili motor mağazasında en uygun fiyatı anında bulun, binlerce lira tasarruf edin.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "XRider — Motosiklet Fiyat Karşılaştırma",
    description: "50+ motor mağazasında en ucuz fiyatı bul.",
  },
  alternates: {
    canonical: "https://xrider.com.tr",
  },
};

const NAV_LINKS = [
  { href: "/search?q=kask", label: "Kask" },
  { href: "/search?q=mont", label: "Mont & Giyim" },
  { href: "/search?q=eldiven", label: "Eldiven" },
  { href: "/search?q=lastik", label: "Lastik" },
  { href: "/search?q=yedek+parca", label: "Yedek Parça" },
  { href: "/search?q=interkom", label: "İnterkom" },
  { href: "/blog", label: "2026 Rehberleri" },
];

const POPULAR_CATEGORIES = [
  "Shoei Kask", "AGV Kask", "LS2 Kask", "Dainese Mont",
  "Alpinestars Eldiven", "Pirelli Lastik", "DID Zincir",
  "Motul Motor Yağı", "Cardo İnterkom", "Givi Çanta",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://xrider.com.tr/#website",
        "url": "https://xrider.com.tr",
        "name": "XRider Motosiklet Fiyat Karşılaştırma",
        "description": "Türkiye'nin 50+ mağazayı kapsayan dikey motosiklet ve ekipman aggregator platformu.",
        "inLanguage": "tr-TR",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://xrider.com.tr/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://xrider.com.tr/#organization",
        "name": "XRider",
        "url": "https://xrider.com.tr",
        "logo": "https://xrider.com.tr/logo.png",
        "sameAs": ["https://twitter.com/xrider_tr", "https://instagram.com/xrider_tr"]
      }
    ]
  };

  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context for AI Models" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-red-500 selection:text-white">
        {/* Akakçe Tarzı Koyu Header */}
        <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                X
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                RIDER<span className="text-red-500 text-sm font-bold ml-1">2026</span>
              </span>
            </Link>

            {/* Navigasyon Linkleri */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Sağ CTA Butonları */}
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Tüm Ürünler</span>
              </Link>
              <Link
                href="/seller"
                className="text-xs font-extrabold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-red-900/30"
              >
                Mağaza Paneli
              </Link>
            </div>
          </div>
        </header>

        {/* Ana İçerik */}
        <main className="flex-1">{children}</main>

        {/* Akakçe Tarzı Koyu & Kırmızı Vurgulu Footer */}
        <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
            {/* Kolon 1: Hakkında */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-base">
                  X
                </div>
                <p className="text-xl font-black text-white">
                  XRIDER<span className="text-red-500 text-xs ml-1 font-bold">2026</span>
                </p>
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                XRider, Türkiye'nin ilk ve tek dikey motosiklet, kask, giyim, yedek parça ve lastik fiyat karşılaştırma motorudur. 50+ yetkili mağazanın tekliflerini gerçek zamanlı birleştirir.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>2026 Fiyat Endeksi Canlı</span>
              </div>
            </div>

            {/* Kolon 2: Popüler Aramalar */}
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wider mb-4 text-red-500">Popüler Karşılaştırmalar</p>
              <ul className="space-y-2 text-xs">
                {POPULAR_CATEGORIES.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/search?q=${encodeURIComponent(c)}`}
                      className="hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-zinc-600">›</span>
                      <span>{c} Fiyatları</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kolon 3: 2026 Rehberler */}
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wider mb-4 text-red-500">2026 Uzman Rehberleri</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="/blog/en-iyi-motorsiklet-kask-2026" className="hover:text-white transition-colors">2026 ECE 22.06 Kask Kılavuzu</Link></li>
                <li><Link href="/blog/motorsiklet-bakim-rehberi" className="hover:text-white transition-colors">7 Basit Motosiklet Bakım Sırrı</Link></li>
                <li><Link href="/blog/turkiye-motor-fiyatlari" className="hover:text-white transition-colors">Türkiye Motor Fiyatları & ÖTV Analizi</Link></li>
                <li><Link href="/blog/scooter-vs-naked-motor" className="hover:text-white transition-colors">Scooter mı, Naked mı? (50.000 Km)</Link></li>
                <li><Link href="/blog/motorsiklet-ekipman-rehberi" className="hover:text-white transition-colors">Yeni Başlayanlar İçin Ekipman Seti</Link></li>
                <li><Link href="/blog/motosiklet-sigortasi-rehberi" className="hover:text-white transition-colors">2026 Trafik Sigortası & Kasko Rehberi</Link></li>
              </ul>
            </div>

            {/* Kolon 4: Platform & Yasal */}
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wider mb-4 text-red-500">Şeffaflık & Yasal Bilgi</p>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                XRider hiçbir ürünü doğrudan satmaz. Fiyatlar ve stok durumları Motomax, Feyizoğlu, Motosikletonline, Mototarz, Motolastik ve diğer 50+ mağazanın açık sistemlerinden anlık olarak çekilir.
              </p>
              <p className="text-xs text-zinc-500">
                Sipariş, ödeme, fatura ve kargo süreçleri yönlendirildiğiniz ilgili satıcı mağaza sorumluluğundadır.
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-900 bg-black py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
              <p>© 2026 XRider.com.tr — Türkiye Motosiklet & Ekipman Fiyat Karşılaştırma İndeksi</p>
              <div className="flex items-center gap-4">
                <Link href="/sitemap.xml" className="hover:text-zinc-300">Sitemap</Link>
                <Link href="/robots.txt" className="hover:text-zinc-300">Robots</Link>
                <Link href="/seller" className="hover:text-zinc-300">Mağaza Girişi</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
