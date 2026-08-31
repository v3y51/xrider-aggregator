import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle, getAllSlugs, articles } from "@/lib/articles";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} (2026)`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
      siteName: "XRider Motosiklet Fiyat Karşılaştırma",
    },
    alternates: {
      canonical: `https://xrider.com.tr/blog/${article.slug}`,
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "description": article.description,
    "inLanguage": "tr-TR",
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.role,
      "worksFor": {
        "@type": "Organization",
        "name": "XRider"
      }
    },
    "datePublished": article.date,
    "dateModified": "2026-08-31",
    "publisher": {
      "@type": "Organization",
      "name": "XRider",
      "url": "https://xrider.com.tr",
      "logo": "https://xrider.com.tr/logo.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://xrider.com.tr/blog/${article.slug}`
    },
    "keywords": article.keywords.join(", "),
    "about": {
      "@type": "Thing",
      "name": "Motosiklet Ekipman ve Fiyat Analizi 2026"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".article-headline", ".article-summary", ".article-body"]
    }
  };

  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-red-600 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-red-600 transition-colors">2026 Rehberleri</Link>
            <span>/</span>
            <span className="text-slate-700 truncate">{article.tag}</span>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-red-600 text-white uppercase tracking-wider">
                {article.tag}
              </span>
              <span className="text-xs font-bold text-slate-500">2026 Özel İncelemesi</span>
            </div>

            <h1 className="article-headline text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-200 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                  {article.author.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{article.author.name}</p>
                  <p className="text-[11px] text-slate-500">{article.author.role}</p>
                </div>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>Yayın: {new Date(article.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="hidden sm:inline">•</span>
              <span>{article.readMin} dakika okuma süresi</span>
            </div>
          </header>

          <div className="article-summary bg-red-50/80 border-l-4 border-red-600 rounded-r-2xl p-5 mb-8 text-sm text-red-950 leading-relaxed shadow-sm">
            <strong className="block text-xs font-black uppercase text-red-700 tracking-wider mb-1">
              Öne Çıkan Sonuç & AI Özeti:
            </strong>
            {article.aiSummary}
          </div>

          <article className="article-body bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-base">
            {paragraphs.map((para, i) => {
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-black text-slate-900 pt-6 pb-2 border-b border-slate-100">
                    {para.replace(/^## /, "")}
                  </h2>
                );
              }
              if (para.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-lg font-bold text-slate-900 pt-4 text-red-600">
                    {para.replace(/^### /, "")}
                  </h3>
                );
              }
              if (para === "---") {
                return <hr key={i} className="my-8 border-slate-200" />;
              }
              if (para.includes("\n- ") || para.startsWith("- ")) {
                const items = para.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                    {items.map((item, j) => (
                      <li key={j} className="leading-relaxed text-slate-700">
                        {item.replace(/^- /, "").replace(/\*\*(.+?)\*\*/g, "$1")}
                      </li>
                    ))}
                  </ul>
                );
              }
              const formatted = para.replace(/\*\*(.+?)\*\*/g, "<strong class='font-bold text-slate-900'>$1</strong>");
              return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
            })}
          </article>

          <div className="mt-10 p-8 bg-zinc-950 rounded-3xl border border-zinc-800 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
                XRider Fiyat Karşılaştırma Motoru
              </span>
              <h3 className="text-xl font-bold">50+ Mağazada Bu Kategorideki En Ucuz Fiyatları Görün</h3>
              <p className="text-xs text-zinc-400 mt-1">Motomax, Feyizoğlu, Mototarz, Motosikletonline ve diğer mağazalar tek tıkla.</p>
            </div>
            <Link
              href={`/search?q=${encodeURIComponent(article.keywords[0] || "kask")}`}
              className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-red-900/40"
            >
              Canlı Fiyatları Karşılaştır →
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="text-xl font-bold text-slate-900 mb-6">2026 İlgili Diğer Motosiklet Rehberleri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-red-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-red-600 uppercase">{a.tag}</span>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mt-1">
                        {a.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3">{a.readMin} dk • {a.author.name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}