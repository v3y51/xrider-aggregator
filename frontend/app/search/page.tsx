import type { Metadata } from "next";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Product {
  id: number;
  canonical_title: string;
  brand: string;
  model: string;
  slug: string;
  main_image_url: string;
  min_price: number;
  min_price_with_shipping: number;
  offer_count: number;
}

interface PageProps {
  searchParams: { q?: string; brand?: string; sort?: string; page?: string; in_stock?: string };
}

export const metadata: Metadata = {
  title: "Motor Araması",
  description: "Motorsiklet ve aksesuar fiyat karşılaştırma",
};

async function fetchProducts(params: PageProps["searchParams"]): Promise<{ products: Product[]; total: number }> {
  const qs = new URLSearchParams({
    q: params.q || "",
    sort: params.sort || "price_asc",
    page: params.page || "1",
    per_page: "24",
    ...(params.brand ? { brand: params.brand } : {}),
    ...(params.in_stock === "1" ? { in_stock: "true" } : {}),
  });

  try {
    const res = await fetch(`${API}/api/v1/search?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return { products: [], total: 0 };
    const data = await res.json();
    return { products: data.hits || [], total: data.total || 0 };
  } catch {
    return { products: [], total: 0 };
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { products, total } = await fetchProducts(searchParams);
  const query = searchParams.q || "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Arama Başlığı */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {query ? `"${query}" için sonuçlar` : "Tüm Ürünler"}
        </h1>
        <p className="text-gray-500 mt-1">{total} ürün bulundu</p>
      </div>

      <div className="flex gap-6">
        {/* Filtre Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Sırala</h3>
            {[
              { value: "price_asc", label: "En Ucuz" },
              { value: "price_desc", label: "En Pahalı" },
              { value: "popularity", label: "Popüler" },
              { value: "newest", label: "En Yeni" },
            ].map((opt) => (
              <a
                key={opt.value}
                href={`?${new URLSearchParams({ ...searchParams, sort: opt.value }).toString()}`}
                className={`block py-1.5 px-2 rounded text-sm ${
                  (searchParams.sort || "price_asc") === opt.value
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                {opt.label}
              </a>
            ))}

            <hr className="my-4" />
            <h3 className="font-semibold text-gray-800 mb-3">Filtre</h3>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={searchParams.in_stock === "1"}
              />
              Sadece stokta olanlar
            </label>
          </div>
        </aside>

        {/* Ürün Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-xl font-medium">Ürün bulunamadı</p>
              <p className="mt-2">Farklı arama terimleri deneyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={`/product/${product.slug}`}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-orange-300 transition-all group"
    >
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.main_image_url ? (
          <img
            src={product.main_image_url}
            alt={product.canonical_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-5xl">🏍️</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mt-0.5">{product.canonical_title}</h3>
        <div className="mt-2">
          <p className="text-lg font-bold text-gray-900">
            {product.min_price_with_shipping
              ? `₺${Number(product.min_price_with_shipping).toLocaleString("tr-TR")}`
              : "Fiyat yok"}
          </p>
          <p className="text-xs text-gray-500">{product.offer_count} mağaza</p>
        </div>
      </div>
    </a>
  );
}
