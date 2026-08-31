"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🏪</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mağaza Paneli</h1>
          <p className="text-gray-500 text-sm">XRider satıcı yönetim sistemi</p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {(["dashboard", "feed", "register"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "dashboard" ? "📊 Panel" : t === "feed" ? "📡 Feed" : "📝 Başvuru"}
          </button>
        ))}
      </div>

      {/* Kayıt Formu */}
      {tab === "register" && (
        <div className="bg-white border rounded-xl p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Yeni Mağaza Başvurusu</h2>
          {regResult ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Başvurunuz alındı!</p>
              <p className="text-sm mt-2 text-green-700">API Anahtarınız:</p>
              <code className="block bg-white border rounded p-2 mt-1 text-xs break-all font-mono">
                {regResult.api_key}
              </code>
              <p className="text-xs text-red-500 mt-2">⚠️ Bu anahtarı şimdi kopyalayın, tekrar gösterilmez!</p>
              <p className="text-sm text-gray-600 mt-2">{regResult.message}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <input placeholder="Mağaza Adı" value={regName} onChange={(e) => setRegName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Website URL (https://...)" value={regWebsite} onChange={(e) => setRegWebsite(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="İletişim E-posta" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" type="email" />
              <button onClick={registerSeller} disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
                {loading ? "Gönderiliyor..." : "Başvur"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Giriş veya Panel */}
      {(tab === "dashboard" || tab === "feed") && (
        <>
          {!dashboard ? (
            <div className="bg-white border rounded-xl p-6 max-w-md">
              <h2 className="text-lg font-semibold mb-4">API Anahtarı ile Giriş</h2>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="API anahtarınızı girin"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
                  onKeyDown={(e) => e.key === "Enter" && login()}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button onClick={login} disabled={loading}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
                  {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Hesabınız yok mu?{" "}
                  <button onClick={() => setTab("register")} className="text-orange-500 underline">Başvurun</button>
                </p>
              </div>
            </div>
          ) : (
            <>
              {tab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard icon="💰" label="Bakiye" value={`₺${Number(dashboard.financials?.balance).toLocaleString("tr-TR")}`} color="green" />
                  <StatCard icon="👆" label="Toplam Tıklama" value={dashboard.financials?.total_clicks?.toLocaleString()} color="blue" />
                  <StatCard icon="📊" label="Toplam Harcama" value={`₺${Number(dashboard.financials?.total_spent).toLocaleString("tr-TR")}`} color="orange" />

                  <div className="md:col-span-3 bg-white border rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Mağaza Bilgileri</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Ad:</span> <span className="font-medium">{dashboard.seller?.name}</span></div>
                      <div><span className="text-gray-500">Durum:</span> <StatusBadge status={dashboard.seller?.status} /></div>
                      <div><span className="text-gray-500">CPC Ücreti:</span> <span className="font-medium">₺{dashboard.financials?.cpc_rate}/tıklama</span></div>
                      <div><span className="text-gray-500">Güven Skoru:</span> <span className="font-medium">{dashboard.seller?.trust_score}/10</span></div>
                    </div>
                  </div>
                </div>
              )}

              {tab === "feed" && (
                <div className="bg-white border rounded-xl p-6 max-w-lg">
                  <h2 className="text-lg font-semibold mb-4">Feed Yönetimi</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Feed URL</label>
                      <input value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)}
                        placeholder="https://magazaniz.com/feed.xml"
                        className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Format</label>
                      <select value={feedFormat} onChange={(e) => setFeedFormat(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="xml">XML</option>
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                      <p className="font-medium mb-1">📋 Feed Gereksinimleri:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>Zorunlu alanlar: id, title, price, url, stock_status</li>
                        <li>GTIN/EAN varsa eşleştirme otomatik yapılır</li>
                        <li>Para birimi: TRY (USD/EUR de kabul edilir, otomatik çevrilir)</li>
                        <li>Feed her {dashboard.feed?.feed_interval_hours || 24} saatte bir güncellenir</li>
                      </ul>
                    </div>
                    {feedSaved && <p className="text-green-600 text-sm font-medium">✅ Feed kaydedildi!</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button onClick={saveFeed} disabled={loading}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
                      {loading ? "Kaydediliyor..." : "Feed'i Kaydet"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    active: { label: "Aktif ✓", class: "text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium" },
    pending: { label: "Onay Bekliyor", class: "text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium" },
    suspended: { label: "Askıya Alındı", class: "text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-medium" },
  };
  const s = map[status] || { label: status, class: "text-gray-600" };
  return <span className={s.class}>{s.label}</span>;
}
