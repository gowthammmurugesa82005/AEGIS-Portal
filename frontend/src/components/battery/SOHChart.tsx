"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { mockSOHTrend } from "@/lib/mockData";

export function SOHChart() {
  const data = mockSOHTrend.map((d) => ({
    ...d,
    date: d.date.slice(0, 7), // "YYYY-MM"
  }));

  // Projection — 3 future points
  const lastSoh = data[data.length - 1].soh;
  const projection = [
    { date: "2026-05", soh: undefined, projected: parseFloat((lastSoh - 1.4).toFixed(1)) },
    { date: "2027-05", soh: undefined, projected: parseFloat((lastSoh - 3.6).toFixed(1)) },
    { date: "2028-05", soh: undefined, projected: parseFloat((lastSoh - 6.2).toFixed(1)) },
  ];
  const combined = [...data.map(d => ({ ...d, projected: undefined })), ...projection];

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={combined} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="sohGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1B3A6B" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
          <YAxis domain={[60, 102]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
            formatter={(value: number, name: string) => [
              `${value}%`,
              name === "soh" ? "Actual SOH" : "Projected SOH",
            ]}
          />
          {/* Warranty threshold line */}
          <ReferenceLine y={70} stroke="#B22222" strokeDasharray="4 4" label={{ value: "Warranty threshold (70%)", position: "insideTopRight", fontSize: 10, fill: "#B22222" }} />
          {/* Actual SOH */}
          <Area type="monotone" dataKey="soh" stroke="#1B3A6B" strokeWidth={2} fill="url(#sohGrad)" dot={(props) => {
            const { cx, cy, payload } = props;
            if (!payload.event) return <g key={cx} />;
            const color = payload.event === "stress" ? "#B22222" : payload.event === "service" ? "#1A7A4A" : "#1D6FA8";
            return (
              <circle key={`dot-${cx}`} cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
            );
          }} connectNulls />
          {/* Projected SOH */}
          <Area type="monotone" dataKey="projected" stroke="#C9A84C" strokeWidth={1.5} strokeDasharray="5 5" fill="url(#projGrad)" connectNulls />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 px-2">
        {[
          { color: "#1B3A6B", label: "Actual SOH" },
          { color: "#C9A84C", label: "Projected (current habits)" },
          { color: "#B22222", label: "Stress event" },
          { color: "#1A7A4A", label: "Service event" },
          { color: "#1D6FA8", label: "Software update" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="w-3 h-0.5 inline-block rounded" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
