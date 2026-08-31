"use client";

import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://xrider-backend.onrender.com";

export default function SellerPortal() {
  const [apiKey, setApiKey] = useState("");
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedUrl, setFeedUrl] = useState("");
  const [feedFormat, setFeedFormat] = useState("xml");
  const [feedSaved, setFeedSaved] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "feed" | "register">("dashboard");

  // Kayıt formu
  const [regName, setRegName] = useState("");
  const [regWebsite, setRegWebsite] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regResult, setRegResult] = useState<any>(null);

  async function login() {
    if (!apiKey) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/v1/seller/dashboard`, {
        headers: { "X-API-Key": apiKey },
      });
      if (!res.ok) throw new Error("Geçersiz API anahtarı");
      const data = await res.json();
      setDashboard(data);
      setFeedUrl(data.feed?.feed_url || "");
      setFeedFormat(data.feed?.feed_format || "xml");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveFeed() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/seller/feed`, {
        method: "PUT",
        headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ feed_url: feedUrl, feed_format: feedFormat, feed_interval_hours: 24 }),
      });
      if (!res.ok) throw new Error("Feed güncellenemedi");
      setFeedSaved(true);
      setTimeout(() => setFeedSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function registerSeller() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/seller/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, website_url: regWebsite, contact_email: regEmail }),
      });
      const data = await res.json();
      setRegResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center text-2xl shadow-md">
            🏪
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">XRider Mağaza & Satıcı Portalı</h1>
            <p className="text-slate-500 text-xs sm:text-sm">2026 Otomatik XML/CSV Feed & CPC Entegrasyon Sistemi</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1.5 mb-8 bg-slate-200/80 p-1.5 rounded-2xl w-fit">
          {(["dashboard", "feed", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t === "dashboard" ? "📊 Mağaza Paneli" : t === "feed" ? "📡 XML Feed Yönetimi" : "📝 Yeni Mağaza Başvurusu"}
            </button>
          ))}
        </div>

        {/* Kayıt Formu */}
        {tab === "register" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-2">Mağazanızı XRider'a Ekleyin</h2>
            <p className="text-xs text-slate-500 mb-6">Her ay yüz binlerce motosiklet sürücüsüne doğrudan ulaşın.</p>
            {regResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <p className="text-emerald-800 font-extrabold text-sm">✅ Başvurunuz Başarıyla Alındı!</p>
                <p className="text-xs mt-3 text-emerald-700 font-medium">Size Özel API Anahtarınız:</p>
                <code className="block bg-white border border-emerald-200 rounded-xl p-3 mt-1.5 text-xs break-all font-mono text-slate-900 font-bold">
                  {regResult.api_key}
                </code>
                <p className="text-xs text-red-600 font-bold mt-3">⚠️ Lütfen bu anahtarı kaydedin, güvenliğiniz için tekrar görüntülenemez.</p>
                <p className="text-xs text-slate-600 mt-2">{regResult.message}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mağaza / Firma Adı</label>
                  <input placeholder="Örn: MotoPerformans Mağazası" value={regName} onChange={(e) => setRegName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Website URL</label>
                  <input placeholder="https://magazaniz.com" value={regWebsite} onChange={(e) => setRegWebsite(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">İletişim E-posta Adresi</label>
                  <input placeholder="info@magazaniz.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" type="email" />
                </div>
                <button onClick={registerSeller} disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 rounded-xl font-extrabold text-sm transition-all disabled:opacity-50 shadow-md shadow-red-600/20">
                  {loading ? "Başvuru Yapılıyor..." : "Mağaza Başvurusunu Tamamla"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Giriş veya Panel */}
        {(tab === "dashboard" || tab === "feed") && (
          <>
            {!dashboard ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-2">Satıcı Girişi</h2>
                <p className="text-xs text-slate-500 mb-5">Mağaza API anahtarınız ile giriş yapın.</p>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="API Anahtarınızı girin"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && login()}
                  />
                  {error && <p className="text-red-600 text-xs font-bold">{error}</p>}
                  <button onClick={login} disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 rounded-xl font-extrabold text-sm transition-all disabled:opacity-50 shadow-md shadow-red-600/20">
                    {loading ? "Kontrol Ediliyor..." : "Giriş Yap"}
                  </button>
                  <p className="text-xs text-slate-500 text-center">
                    Henüz kayıtlı mağazanız yok mu?{" "}
                    <button onClick={() => setTab("register")} className="text-red-600 font-bold underline">Hemen Başvurun</button>
                  </p>
                </div>
              </div>
            ) : (
              <>
                {tab === "dashboard" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard icon="💰" label="Aktif Bakiye" value={`₺${Number(dashboard.financials?.balance || 0).toLocaleString("tr-TR")}`} color="green" />
                    <StatCard icon="👆" label="Toplam Tıklama" value={(dashboard.financials?.total_clicks || 0).toLocaleString()} color="blue" />
                    <StatCard icon="📊" label="Toplam Harcama" value={`₺${Number(dashboard.financials?.total_spent || 0).toLocaleString("tr-TR")}`} color="red" />

                    <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <h3 className="font-extrabold text-slate-900 text-base mb-4">Mağaza Bilgileri</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-400 font-medium">Mağaza Adı:</span> <strong className="text-slate-900 ml-1">{dashboard.seller?.name}</strong></div>
                        <div className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-400 font-medium">Durum:</span> <StatusBadge status={dashboard.seller?.status} /></div>
                        <div className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-400 font-medium">CPC Oranı:</span> <strong className="text-slate-900 ml-1">₺{dashboard.financials?.cpc_rate || 0.50}/tıklama</strong></div>
                        <div className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-400 font-medium">Güven Skoru:</span> <strong className="text-emerald-700 ml-1">{dashboard.seller?.trust_score || 9.5}/10</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {tab === "feed" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg shadow-sm">
                    <h2 className="text-lg font-black text-slate-900 mb-2">Otomatik Feed Entegrasyonu</h2>
                    <p className="text-xs text-slate-500 mb-6">XML, CSV veya JSON ürün feed adresinizi tanımlayın.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">XML / CSV Feed URL</label>
                        <input value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)}
                          placeholder="https://magazaniz.com/feed.xml"
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Feed Formatı</label>
                        <select value={feedFormat} onChange={(e) => setFeedFormat(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none">
                          <option value="xml">Google Shopping XML / Standart XML</option>
                          <option value="csv">CSV (Virgülle Ayrılmış)</option>
                          <option value="json">JSON API</option>
                        </select>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 border border-slate-100">
                        <p className="font-bold text-slate-900 mb-1.5">📋 Zorunlu Feed Alanları:</p>
                        <ul className="space-y-1 list-disc list-inside text-slate-600">
                          <li><strong>id, title, price, url, stock_status</strong></li>
                          <li>GTIN / Barkod (varsa otomatik eşleştirilir)</li>
                          <li>Para Birimi: TRY</li>
                          <li>Otomatik Senkronizasyon: 24 saatte bir</li>
                        </ul>
                      </div>
                      {feedSaved && <p className="text-emerald-700 text-xs font-bold">✅ Feed adresiniz başarıyla kaydedildi!</p>}
                      {error && <p className="text-red-600 text-xs font-bold">{error}</p>}
                      <button onClick={saveFeed} disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-extrabold text-sm transition-all disabled:opacity-50 shadow-md shadow-red-600/20">
                        {loading ? "Kaydediliyor..." : "Feed'i Güncelle ve Senkronize Et"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div className={`border rounded-2xl p-5 ${colors[color] || colors.red}`}>
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-xs font-bold opacity-75 uppercase">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    active: { label: "Aktif ✓", class: "text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-black" },
    pending: { label: "Onay Bekliyor", class: "text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md text-xs font-black" },
    suspended: { label: "Askıya Alındı", class: "text-red-700 bg-red-100 px-2.5 py-1 rounded-md text-xs font-black" },
  };
  const s = map[status] || { label: status || "Aktif ✓", class: "text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md text-xs font-black" };
  return <span className={s.class}>{s.label}</span>;
}