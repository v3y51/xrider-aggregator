import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "XRider — Türkiye'nin Motor Fiyat Karşılaştırma Platformu",
    template: "%s | XRider",
  },
  description:
    "Motorsiklet, scooter ve motor aksesuarlarında en iyi fiyatı bulun. Yüzlerce mağazayı karşılaştırın.",
  keywords: ["motorsiklet", "motor fiyat", "scooter", "motor aksesuar", "fiyat karşılaştırma"],
  openGraph: {
    siteName: "XRider",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-orange-500">
              X<span className="text-gray-900">Rider</span>
            </a>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="/motorsiklet" className="hover:text-orange-500">Motorsiklet</a>
              <a href="/motor-aksesuarlari" className="hover:text-orange-500">Aksesuar</a>
              <a href="/yedek-parca" className="hover:text-orange-500">Yedek Parça</a>
            </nav>
            <a
              href="/seller"
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Mağaza Paneli
            </a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t mt-16 py-10">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
            <p>© 2024 XRider. Platform yalnızca fiyat karşılaştırma hizmeti sunar.</p>
            <p className="mt-1">Satış, ödeme, kargo ve iade süreçlerinden ilgili mağazalar sorumludur.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
