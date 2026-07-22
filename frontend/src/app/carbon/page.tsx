"use client";
import { Leaf, Zap, TrendingDown, TreePine } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { mockCarbon, mockPassport } from "@/lib/mockData";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function CarbonPage() {
  const trees = Math.round(mockCarbon.lifetimeSavedKg / 21);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Carbon & Sustainability</h1>
        <p className="text-sm text-slate-500 mt-0.5">Environmental impact · Carbon footprint · Circular economy</p>
      </div>

      {/* Lifetime impact hero */}
      <div className="bg-gradient-to-r from-status-green to-emerald-600 rounded-2xl p-6 text-white">
        <p className="text-sm text-white/70 mb-1">Lifetime CO₂ saved vs equivalent petrol vehicle</p>
        <p className="text-5xl font-bold mb-2">{(mockCarbon.lifetimeSavedKg / 1000).toFixed(1)} t</p>
        <p className="text-sm text-white/80">
          ≈ {trees} trees planted · {(mockCarbon.lifetimeSavedKg * 0.4).toFixed(0)} km of petrol driving avoided
        </p>
      </div>

      {/* Today / Month / Year tiles */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today",      value: mockCarbon.todayCo2Kg,    unit: "kg CO₂e" },
          { label: "This Month", value: mockCarbon.monthCo2Kg,    unit: "kg CO₂e" },
          { label: "This Year",  value: mockCarbon.yearCo2Kg,     unit: "kg CO₂e" },
        ].map(({ label, value, unit }) => (
          <Card key={label}>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold text-aegis-navy">{value.toFixed(1)}</p>
            <p className="text-xs text-slate-500 mt-0.5">{unit}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Monthly CO₂ Emissions vs Savings" subtitle="Your operational emissions vs equivalent petrol vehicle savings">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockCarbon.monthlyCarbonHistory} margin={{ left: -20, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} unit=" kg" />
              <Tooltip formatter={(v: number, name: string) => [`${v.toFixed(1)} kg`, name === "co2Kg" ? "Your emissions" : "Petrol savings"]} />
              <Legend iconSize={10} />
              <Bar dataKey="co2Kg"   name="Your Emissions" fill="#1B3A6B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="savedKg" name="Petrol Savings"  fill="#1A7A4A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Grid Carbon Factor — Last 24 Hours" subtitle="Optimal charging window highlighted">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={Array.from({ length: 24 }, (_, i) => ({
                hour: `${i}:00`,
                factor: 480 + Math.sin((i - 14) * 0.4) * 120 + (i >= 22 || i <= 6 ? -80 : 40),
              }))}
              margin={{ left: -10, top: 5 }}
            >
              <defs>
                <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A7A4A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1A7A4A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} tickLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} unit="g" />
              <Tooltip formatter={(v: number) => [`${v.toFixed(0)} gCO₂/kWh`, "Grid Factor"]} />
              <Area type="monotone" dataKey="factor" stroke="#1A7A4A" fill="url(#carbonGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 bg-status-green-bg border border-status-green rounded-xl p-3 flex items-center gap-2">
            <Zap size={14} className="text-status-green" />
            <p className="text-xs text-status-green font-medium">
              Optimal charging: <strong>{mockCarbon.optimalChargingWindow.start} – {mockCarbon.optimalChargingWindow.end}</strong>
              {" "}({mockCarbon.optimalChargingWindow.factor} gCO₂/kWh)
            </p>
          </div>
        </Card>
      </div>

      {/* Supply chain panel */}
      <Card title="Battery Supply Chain Transparency" subtitle="Where your battery's materials came from">
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { stage: "1. Lithium Mining",    detail: mockPassport.supplyChain.lithiumSource,      status: "verified" },
            { stage: "2. Cell Manufacturing", detail: mockPassport.supplyChain.cellSupplier,       status: "verified" },
            { stage: "3. Pack Assembly",      detail: mockPassport.supplyChain.packAssembler,      status: "verified" },
            { stage: "4. Vehicle Assembly",   detail: "Tata Motors, Pune — ISO 14001 certified",   status: "verified" },
          ].map(({ stage, detail, status }, i) => (
            <div key={stage} className="relative">
              {i < 3 && <div className="hidden sm:block absolute right-0 top-4 w-full h-0.5 bg-status-green-bg translate-x-1/2 z-0" />}
              <div className="relative z-10 bg-white border border-slate-100 rounded-xl p-3">
                <div className="w-6 h-6 rounded-full bg-status-green text-white text-[10px] font-bold flex items-center justify-center mb-2">{i + 1}</div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{stage}</p>
                <p className="text-xs font-medium text-slate-800">{detail}</p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-status-green" />
                  <span className="text-[10px] text-status-green capitalize">{status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">Overall Supply Chain Score</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`text-lg ${i < mockPassport.supplyChain.supplyChainScore ? "text-aegis-gold" : "text-slate-200"}`}>★</span>
            ))}
            <span className="text-sm font-bold text-slate-800 ml-1">{mockPassport.supplyChain.supplyChainScore}/5</span>
          </div>
        </div>
      </Card>

      {/* Second life */}
      <Card title="End-of-Life & Circular Economy">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="bg-status-green-bg rounded-xl p-4 text-center">
            <TreePine size={24} className="text-status-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-status-green">{mockPassport.circularity.secondLifeSuitabilityScore}</p>
            <p className="text-xs text-status-green mt-1">Second Life Score</p>
          </div>
          <div className="bg-aegis-light rounded-xl p-4 sm:col-span-2">
            <p className="text-xs font-semibold text-aegis-navy mb-1">Your battery's second life</p>
            <p className="text-sm text-slate-700 mb-2">{mockPassport.circularity.recommendedSecondLifeUse}</p>
            <p className="text-xs text-slate-500">Estimated second-life value: <strong className="text-aegis-navy">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(mockPassport.circularity.estimatedSecondLifeValueRs)}</strong></p>
            <p className="text-xs text-slate-500 mt-1">Recycling partner: <strong className="text-slate-700">{mockPassport.circularity.recyclingPartner}</strong></p>
          </div>
        </div>
      </Card>
    </div>
  );
}
