"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://xrider-backend.onrender.com";

interface ScrapedItem {
  title: string;
  price: string | null;
  price_raw: number | null;
  url: string;
  source: string;
  store_category?: string;
  image_url: string | null;
  badge: string;
}

const POPULAR_SEARCHES = [
  "Shoei NXR2",
  "Motul 7100 10W-40",
  "LS2 FF906 Advant",
  "Dainese Mont",
  "Pirelli Diablo Rosso IV",
  "DID 520 Zincir",
  "Cardo Freecom 4X",
  "Shad SH48 Çanta",
];

function useDebouncedCallback<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: T) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}

export default function LiveSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScrapedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklandığında dropdown kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchLive = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/scrape?q=${encodeURIComponent(q.trim())}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.items || []);
        setOpen(true);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useDebouncedCallback(fetchLive, 400);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    debouncedFetch(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickClick = (tag: string) => {
    setQuery(tag);
    fetchLive(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-3xl mx-auto">
      {/* Akakçe Tarzı Arama Giriş Barı */}
      <form onSubmit={handleSubmit} className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border-2 border-red-600/90 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-600/20 transition-all">
        <div className="pl-4 pr-2 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Motosiklet, kask, mont, yedek parça, lastik veya marka ara... (Örn: Shoei, Motul, Dainese)"
          className="w-full py-3.5 px-2 text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none font-medium"
          autoComplete="off"
        />
        {loading && (
          <div className="pr-3 flex items-center">
            <svg className="animate-spin w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}
        <button
          type="submit"
          className="shrink-0 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
        >
          <span>Fiyatları Bul</span>
          <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>

      {/* Popüler Hızlı Arama Etiketleri */}
      <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-xs">
        <span className="text-slate-400 font-semibold mr-1">Trend Aramalar:</span>
        {POPULAR_SEARCHES.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleQuickClick(tag)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-red-500/50 transition-all font-medium"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Canlı Akakçe Tarzı Sonuçlar Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Canlı Fiyat Karşılaştırması</span>
              <span className="text-xs text-zinc-400">({results.length} mağaza teklifi)</span>
            </div>
            <span className="badge-live">2026 Canlı Veri</span>
          </div>

          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {results.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-red-50/50 transition-colors group"
              >
                {/* Ürün Görseli */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  ) : (
                    <span className="text-xl">🏍️</span>
                  )}
                </div>

                {/* Ürün ve Mağaza Bilgisi */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide bg-red-50 px-1.5 py-0.5 rounded">
                      {item.source}
                    </span>
                    {item.store_category && (
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        • {item.store_category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate mt-0.5 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </p>
                </div>

                {/* Fiyat ve Satıcıya Git Butonu */}
                <div className="text-right shrink-0 flex items-center gap-3">
                  {item.price && (
                    <div>
                      <p className="text-base font-extrabold text-red-600">{item.price}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold block">En Uygun Teklif</span>
                    </div>
                  )}
                  <span className="hidden sm:inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 group-hover:bg-red-600 group-hover:text-white px-3 py-1.5 rounded-lg transition-all">
                    Satıcıya Git →
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => {
                setOpen(false);
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="w-full py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>50+ Mağazada Tüm "{query}" Sonuçlarını & Fiyat Tablosunu İncele</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
