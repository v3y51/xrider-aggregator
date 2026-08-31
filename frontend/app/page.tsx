export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Türkiye'nin <span className="text-orange-500">Motor</span> Fiyat Karşılaştırma Platformu
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Yüzlerce mağazayı karşılaştır, en iyi fiyatı bul.
        </p>
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="search"
            placeholder="Motorsiklet, aksesuar veya marka ara..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600">
            Ara
          </button>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Naked Motor", slug: "naked-motor", icon: "🏍️" },
            { name: "Scooter", slug: "scooter", icon: "🛵" },
            { name: "Enduro", slug: "enduro-cross", icon: "🔵" },
            { name: "Sport", slug: "sport-motor", icon: "⚡" },
            { name: "Kask", slug: "kask", icon: "🪖" },
            { name: "Aksesuar", slug: "motor-aksesuarlari", icon: "🔧" },
          ].map((cat) => (
            <a
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Sistem durumu */}
      <section className="mt-16 p-6 bg-orange-50 rounded-xl border border-orange-200">
        <h3 className="font-semibold text-orange-800 mb-2">🚧 Platform Geliştirme Aşamasında</h3>
        <p className="text-orange-700 text-sm">
          XRider şu anda MVP geliştirme sürecindedir. Mağaza başvuruları için{" "}
          <a href="/seller" className="underline font-medium">Mağaza Paneli</a>'ni ziyaret edin.
        </p>
      </section>
    </div>
  );
}
