"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://xrider-backend.onrender.com";

interface ScrapedItem {
  title: string;
  price: string | null;
  url: string;
  source: string;
  image_url: string | null;
  badge: string;
}

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

  // Disari tiklamada kapat
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
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/scrape?q=${encodeURIComponent(q)}&limit=4`);
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

  const debouncedFetch = useDebouncedCallback(fetchLive, 500);

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

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Kask, eldiven, scooter... ara"
            className="w-full px-5 py-4 text-base rounded-2xl border-0 shadow-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow"
            autoComplete="off"
          />
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="animate-spin w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </span>
          )}
        </div>
        <button
          type="submit"
          className="px-7 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl transition-colors"
        >
          Ara
        </button>
      </form>

      {/* Canli sonuclar dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Canli Fiyatlar</span>
            <span className="badge-live">Canli</span>
          </div>
          {results.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  className="w-10 h-10 object-contain rounded-lg bg-gray-50 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 text-lg">
                  🏍️
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">{item.source}</p>
              </div>
              {item.price && (
                <span className="text-sm font-bold text-orange-600 shrink-0">{item.price}</span>
              )}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); router.push(`/search?q=${encodeURIComponent(query)}`); }}
            className="w-full px-4 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors text-center"
          >
            Tum sonuclari goster ({results.length}+) →
          </button>
        </div>
      )}
    </div>
  );
}
