import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Motor Rehberleri & Blog",
  description:
    "Motorsiklet kask secimi, bakim ipuclari, ekipman rehberleri ve Turkiye motor piyasasi hakkinda yazilar.",
  keywords: [
    "motorsiklet blog",
    "motor rehberi",
    "kask secimi",
    "motorsiklet bakim",
    "motor ekipman",
  ],
  openGraph: {
    title: "Motor Rehberleri | XRider",
    description: "Turkiyenin motosiklet sehvarlarinin yazilari",
    type: "website",
  },
};

const TAG_COLORS: Record<string, string> = {
  Guvenlik: "bg-red-100 text-red-700",
  Bakim: "bg-blue-100 text-blue-700",
  Piyasa: "bg-purple-100 text-purple-700",
  Rehber: "bg-green-100 text-green-700",
  Baslangic: "bg-orange-100 text-orange-700",
  Mali: "bg-yellow-100 text-yellow-700",
};

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Baslik */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">Rehber & Blog</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Motor Dunyasindan Yaz&iacute;lar</h1>
        <p className="text-gray-500 max-w-2xl">
          Kask seciminden motor bakimina, sigorta detaylarindan piyasa analizine kadar dusunduklerimizi yaziyoruz.
          Hepsi gercek surus deneyimlerinden suzulerek.
        </p>
      </div>

      {/* Makale grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Ust renk bant */}
            <div className="h-3 bg-gradient-to-r from-orange-400 to-orange-600" />

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    TAG_COLORS[article.tag] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {article.tag}
                </span>
                <span className="text-xs text-gray-400">{article.readMin} dk okuma</span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2 flex-1">{article.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{article.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{article.author}</span>
                <span>{new Date(article.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* SEO Alt Bilgi */}
      <div className="mt-14 p-6 bg-orange-50 rounded-2xl border border-orange-100">
        <h2 className="font-bold text-orange-900 mb-2">En Ucuz Motor Ekipman Fiyatlari Icin</h2>
        <p className="text-sm text-orange-700 mb-4">
          N11, Trendyol, HepsiBurada ve daha fazla magazadan canli fiyatlari karsilastirin.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-xl transition-colors"
        >
          Fiyat Karsilastirmaya Git →
        </Link>
      </div>
    </div>
  );
}
