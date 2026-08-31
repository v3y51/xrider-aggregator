import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://xrider.com.tr"),
  title: {
    default: "XRider — Turkiye Motor Fiyat Karsilastirma",
    template: "%s | XRider",
  },
  description:
    "Motorsiklet, scooter, kask ve motor aksesuarlarinda en iyi fiyati bulun. N11, Trendyol, HepsiBurada ve daha yuzlerce magazayi karsilastirin.",
  keywords: [
    "motorsiklet fiyat karsilastirma",
    "motor kask fiyat",
    "scooter fiyat",
    "motor aksesuar",
    "motorsiklet ekipman",
    "ucuz motor",
    "xrider",
  ],
  openGraph: {
    siteName: "XRider",
    locale: "tr_TR",
    type: "website",
    url: "https://xrider.com.tr",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://xrider.com.tr" },
};

const NAV_LINKS = [
  { href: "/search?q=motorsiklet", label: "Motorsiklet" },
  { href: "/search?q=kask", label: "Kask" },
  { href: "/search?q=motor+aksesuar", label: "Aksesuar" },
  { href: "/search?q=yedek+parca", label: "Yedek Parca" },
  { href: "/blog", label: "Rehber" },
];

const FOOTER_CATS = [
  "Naked Motor", "Scooter", "Enduro", "Sport Motor",
  "Kask", "Eldiven", "Bot", "Yagmurluk", "Aksesuar",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50 font-sans">
        {/* ── Navbar ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 glass border-b border-white/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-gradient">X</span>
                <span className="text-gray-900">Rider</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <Link
                href="/seller"
                className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Magaza Ac
              </Link>
            </div>
          </div>
        </header>

        {/* ── Content ─────────────────────────────────────────────── */}
        <main className="flex-1">{children}</main>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="bg-gray-900 text-gray-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="text-xl font-black text-white mb-2">
                <span className="text-orange-400">X</span>Rider
              </p>
              <p className="text-sm leading-relaxed">
                Turkiye&apos;nin motor ve motosiklet ekipmanlari fiyat
                karsilastirma platformu.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Kategoriler</p>
              <ul className="space-y-2 text-sm">
                {FOOTER_CATS.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/search?q=${encodeURIComponent(c)}`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Platform</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-orange-400">Rehber &amp; Blog</Link></li>
                <li><Link href="/seller" className="hover:text-orange-400">Magaza Paneli</Link></li>
                <li><Link href="/search" className="hover:text-orange-400">Urun Ara</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Hakkinda</p>
              <p className="text-sm leading-relaxed">
                XRider hicbir urun satmaz. Fiyat bilgileri magaza sitelerinden
                canli olarak cekilir. Satis, kargo ve iade icin ilgili maazaya
                yonlendirilirsiniz.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-600">
            &copy; {new Date().getFullYear()} XRider &mdash; Sadece fiyat karsilastirma hizmeti
          </div>
        </footer>
      </body>
    </html>
  );
}
