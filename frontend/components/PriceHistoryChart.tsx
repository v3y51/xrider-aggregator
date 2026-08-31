"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface PricePoint {
  date: string;
  min_price: number;
  max_price: number;
}

export default function PriceHistoryChart({ data }: { data: PricePoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
        Fiyat geçmişi henüz yok
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("tr-TR", { month: "short", day: "numeric" }),
    "En Düşük": Number(d.min_price),
    "En Yüksek": Number(d.max_price),
  }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v: number) => `₺${Number(v).toLocaleString("tr-TR")}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="En Düşük"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="En Yüksek"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
