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
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      siteName: "XRider",
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
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Person", name: article.author },
    datePublished: article.date,
    publisher: {
      "@type": "Organization",
      name: "XRider",
      url: "https://xrider.com.tr",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://xrider.com.tr/blog/${article.slug}`,
    },
    keywords: article.keywords.join(", "),
  };

  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-orange-500">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-orange-500">Blog</Link>
          <span>/</span>
          <span className="text-gray-600">{article.tag}</span>
        </nav>

        <header className="mb-8">
          <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">{article.tag}</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
            <span>Yazan: <strong className="text-gray-600">{article.author}</strong></span>
            <span>·</span>
            <span>{new Date(article.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span>{article.readMin} dk okuma</span>
          </div>
        </header>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 text-sm text-orange-900 leading-relaxed">
          {article.description}
        </div>

        <article className="space-y-4 text-gray-700">
          {paragraphs.map((para, i) => {
            if (para.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-1">{para.replace(/^## /, "")}</h2>;
            }
            if (para.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-6 mb-1">{para.replace(/^### /, "")}</h3>;
            }
            if (para === "---") {
              return <hr key={i} className="my-8 border-gray-100" />;
            }
            if (para.includes("\n- ") || para.startsWith("- ")) {
              const items = para.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="list-disc pl-6 space-y-1">
                  {items.map((item, j) => (
                    <li key={j} className="leading-relaxed">{item.replace(/^- /, "").replace(/\*\*(.+?)\*\*/g, "$1")}</li>
                  ))}
                </ul>
              );
            }
            const text = para.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
            return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />;
          })}
        </article>

        <div className="mt-12 p-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white">
          <h3 className="font-bold text-lg mb-1">Ekipman Fiyatlarini Karsilastir</h3>
          <p className="text-orange-100 text-sm mb-4">5+ magazadan canli fiyat. Kayit gerekmez, ucretsiz.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors">
            Simdi Karsilastir
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Diger Yazilar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="card-hover bg-white border border-gray-100 rounded-xl p-4">
                  <span className="text-xs font-semibold text-orange-500">{a.tag}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2">{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">{a.readMin} dk · {a.author}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}