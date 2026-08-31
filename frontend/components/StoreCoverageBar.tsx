const STORES = [
  "Motomax", "Feyizoğlu", "Motosikletonline", "Mototarz", "Kaskpazarı",
  "Mototaş", "Motolastik", "Kalyoncu Motor", "Motoparsan", "Çelik Motosiklet",
  "Moto11", "Kaan Elektronik", "Mototan (Dainese)", "Motoexpress", "Enduro Market",
  "Rock Store", "Trendyol", "N11", "Hepsiburada", "Motodium", "Motoplus", "Motoavm",
  "Mototeks", "Motosiklet Parçaları", "Etkin Motor", "Seven Kardeşler", "Coşkun Motor"
];

export default function StoreCoverageBar() {
  return (
    <div className="bg-zinc-950 py-4 border-y border-zinc-800 text-zinc-400 text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
            50+ Yetkili Mağazada Canlı Fiyat Takibi:
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
          {STORES.map((s, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 shrink-0 font-medium hover:border-red-500/50 hover:text-white transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
