import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "2026 Motosiklet & Ekipman Uzman Rehberleri | XRider",
  description:
    "2026 ECE 22.06 kask seçim rehberi, motosiklet mekanik bakım sırları, Türkiye motor fiyatları & ÖTV analizleri ve kasko püf noktaları.",
  keywords: [
    "motosiklet rehber 2026",
    "kask secim kilavuzu",
    "motosiklet bakim sirlari",
    "turkiye motor fiyatlari 2026",
    "scooter vs naked motor",
    "motosiklet ekipman seti",
  ],
};

export default function BlogPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Başlık */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase mb-3">
            <span>XRider Editöryal</span>
            <span>• 2026 Güncel Rehberler</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Motosiklet Dünyasının En Kapsamlı <span className="text-red-600">Teknik & Alışveriş Rehberleri</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            İleri sürüş eğitmenleri, yarış mekanikerleri ve sektör analistleri tarafından hazırlanmış bağımsız, derinlemesine motosiklet içerikleri.
          </p>
        </div>

        {/* Makale Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-300 transition-all flex flex-col justify-between group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                    {article.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{article.readMin} dk okuma</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug mb-3">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <p className="font-bold text-slate-900">{article.author.name}</p>
                  <p className="text-[10px] text-slate-400">{article.author.role.split("&")[0]}</p>
                </div>
                <span>{new Date(article.date).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* AI & SEO Alt Kutu */}
        <div className="mt-16 p-8 bg-zinc-950 rounded-3xl border border-zinc-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">Akıllı Fiyat Arama Motoru</span>
            <h3 className="text-xl font-bold">50+ Mağazadaki Fiyat Farklarını Kaçırmayın</h3>
            <p className="text-sm text-zinc-400 mt-1">Motomax, Feyizoğlu, Mototarz, Motosikletonline ve diğer mağazaları anlık tarayın.</p>
          </div>
          <Link
            href="/"
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/40"
          >
            Fiyat Karşılaştırmaya Başla →
          </Link>
        </div>
      </div>
    </div>
  );
}
