"use client";
import { useState } from "react";
import { Battery, ShieldCheck, Leaf, Award, AlertTriangle, TrendingDown, Sliders } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SOHChart } from "@/components/battery/SOHChart";
import { mockPassport, mockStressEvents, mockRUL, mockTelemetry } from "@/lib/mockData";
import { formatDate, getSeverityColor } from "@/lib/utils";

const tabs = ["Overview", "SOH Trend", "Passport", "Stress Events", "RUL Estimator"] as const;
type Tab = typeof tabs[number];

export default function BatteryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [simFastCharge, setSimFastCharge] = useState(3);   // sessions/week
  const [simDailyKm,   setSimDailyKm]    = useState(50);

  // Simulate RUL change based on slider values
  const simulatedRul = parseFloat(
    Math.max(1, mockRUL.estimatedYears70Soh * (1 - (simFastCharge - 1) * 0.04) * (1 - (simDailyKm - 40) * 0.002)).toFixed(1)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Battery Intelligence</h1>
        <p className="text-sm text-slate-500 mt-0.5">Digital Battery Passport · SOH Analytics · Remaining Useful Life</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === t ? "bg-white text-aegis-navy shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview ────────────────────────────────────────────────────── */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1 space-y-5">
            {[
              { label: "State of Health", value: `${mockTelemetry.soh}%`, sub: "87% of original 40.5 kWh capacity", icon: Battery, color: "text-status-blue" },
              { label: "State of Charge", value: `${mockTelemetry.soc}%`, sub: `Est. range: ${mockTelemetry.estimatedRangeKm} km`, icon: Battery, color: "text-status-green" },
              { label: "Total Cycles",   value: "312", sub: "Charge cycles completed to date", icon: TrendingDown, color: "text-status-amber" },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <Card key={label}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-slate-500 mt-1">{sub}</p>
                  </div>
                  <Icon size={20} className={color} />
                </div>
              </Card>
            ))}
          </div>

          <div className="md:col-span-2">
            <Card title="Battery Quick Stats" subtitle="Key performance indicators at a glance">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-2">
                {[
                  ["Chemistry",          mockPassport.chemistry],
                  ["Nominal Capacity",   `${mockPassport.nominalCapacityKwh} kWh`],
                  ["Manufacturer",       mockPassport.manufacturer],
                  ["Mfg. Date",          formatDate(mockPassport.manufacturingDate)],
                  ["Warranty",           `${mockPassport.qualityCertification.warrantyYears} yrs / ${(mockPassport.qualityCertification.warrantyKm/1000).toFixed(0)}K km`],
                  ["2nd Life Score",     `${mockPassport.circularity.secondLifeSuitabilityScore}/100`],
                  ["Embodied Carbon",    `${(mockPassport.productCarbonFootprint.manufacturingCo2eKg/1000).toFixed(1)} t CO₂e`],
                  ["Ethical Sourcing",   `${mockPassport.materialComposition.ethicalSourcingScore}/100`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── SOH Trend ───────────────────────────────────────────────────── */}
      {activeTab === "SOH Trend" && (
        <div className="space-y-5">
          <Card title="State of Health Trend" subtitle="Actual SOH history + projection under current usage">
            <SOHChart />
          </Card>
          <Card title="Degradation Analysis">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Average SOH loss / 10,000 km</p>
                <p className="text-2xl font-bold text-aegis-navy">−1.8%</p>
                <p className="text-xs text-status-green mt-1">Better than 64% of same-model owners</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Primary degradation cause</p>
                <p className="text-sm font-semibold text-slate-800">High-temp parking</p>
                <p className="text-xs text-slate-500 mt-1">Contributes ~35% of total degradation</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Est. warranty breach date</p>
                <p className="text-2xl font-bold text-status-amber">Nov 2029</p>
                <p className="text-xs text-slate-500 mt-1">When SOH crosses 70% threshold</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Battery Passport ────────────────────────────────────────────── */}
      {activeTab === "Passport" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[
            {
              icon: Battery, title: "Identity & Origin",
              items: [
                ["Battery ID",         mockPassport.batteryId],
                ["Serial Number",      mockPassport.serialNumber],
                ["Manufacturer",       mockPassport.manufacturer],
                ["Manufacturing Plant",mockPassport.manufacturingPlant],
                ["Manufacturing Date", formatDate(mockPassport.manufacturingDate)],
                ["Chemistry",          mockPassport.chemistry],
                ["Weight",             `${mockPassport.weightKg} kg`],
              ],
            },
            {
              icon: ShieldCheck, title: "Quality Certification",
              items: [
                ["QC Pass Date",       formatDate(mockPassport.qualityCertification.qcPassDate)],
                ["Certification Body", mockPassport.qualityCertification.certificationBody],
                ["Test Report No.",    mockPassport.qualityCertification.testReportNumber],
                ["Warranty (Years)",   `${mockPassport.qualityCertification.warrantyYears} years`],
                ["Warranty (KM)",      `${mockPassport.qualityCertification.warrantyKm.toLocaleString("en-IN")} km`],
              ],
            },
            {
              icon: Leaf, title: "Carbon Footprint",
              items: [
                ["Manufacturing CO₂e", `${mockPassport.productCarbonFootprint.manufacturingCo2eKg.toLocaleString()} kg`],
                ["Lifetime Savings",   `${mockPassport.productCarbonFootprint.lifetimeSavingsKg.toLocaleString()} kg`],
                ["Carbon Payback",     `${mockPassport.productCarbonFootprint.carbonPaybackYears} years`],
                ["Current Emissions",  `${mockPassport.productCarbonFootprint.currentTotalEmissionsKg} kg`],
              ],
            },
            {
              icon: Award, title: "Supply Chain",
              items: [
                ["Cell Supplier",    mockPassport.supplyChain.cellSupplier],
                ["Cell Origin",      mockPassport.supplyChain.cellOriginCountry],
                ["Pack Assembler",   mockPassport.supplyChain.packAssembler],
                ["Lithium Source",   mockPassport.supplyChain.lithiumSource],
                ["SC Score",         `${mockPassport.supplyChain.supplyChainScore} / 5 ★`],
              ],
            },
          ].map(({ icon: Icon, title, items }) => (
            <Card key={title} title={title}>
              <div className="space-y-2.5 mt-2">
                {items.map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500 text-xs">{k}</span>
                    <span className="font-medium text-slate-800 text-xs text-right max-w-[55%]">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Stress Events ───────────────────────────────────────────────── */}
      {activeTab === "Stress Events" && (
        <Card title="Battery Stress Events Log" subtitle="Events that have measurably impacted your battery health">
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  {["Date", "Event Type", "Severity", "SOH Impact", "Recommendation"].map((h) => (
                    <th key={h} className="text-left py-2.5 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockStressEvents.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 text-xs text-slate-500">{formatDate(ev.date)}</td>
                    <td className="py-3 pr-4">
                      <p className="text-xs font-medium text-slate-800">{ev.description.slice(0, 50)}…</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getSeverityColor(ev.severity)}`}>
                        {ev.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs font-bold text-status-red">{ev.sohImpact}%</td>
                    <td className="py-3 text-[11px] text-slate-600">{ev.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── RUL Estimator ───────────────────────────────────────────────── */}
      {activeTab === "RUL Estimator" && (
        <div className="space-y-5">
          <Card title="Remaining Useful Life Estimate" subtitle="Probabilistic forward projection based on your usage pattern">
            <div className="grid grid-cols-3 gap-4 my-4">
              {[
                { label: "Projected SOH (1 yr)", value: `${mockRUL.projectedSoh1Year}%`, color: "text-status-green" },
                { label: "Projected SOH (3 yr)", value: `${mockRUL.projectedSoh3Year}%`, color: "text-status-amber" },
                { label: "Projected SOH (5 yr)", value: `${mockRUL.projectedSoh5Year}%`, color: "text-status-red" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Timeline bar */}
            <div className="relative my-6">
              <div className="h-3 bg-gradient-to-r from-status-green via-status-amber to-status-red rounded-full" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Today (87% SOH)</span>
                <span>70% SOH (~{mockRUL.estimatedYears70Soh} yrs)</span>
                <span>50% SOH (~{mockRUL.estimatedYears50Soh} yrs)</span>
              </div>
            </div>

            <div className="bg-aegis-light rounded-xl p-4">
              <p className="text-xs font-semibold text-aegis-navy mb-1 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Primary Degradation Factor
              </p>
              <p className="text-sm text-slate-700">{mockRUL.primaryDegradationFactor}</p>
            </div>
          </Card>

          {/* Usage Impact Simulator */}
          <Card
            title="Usage Impact Simulator"
            subtitle="Drag sliders to see how behaviour changes affect your RUL"
            action={<div className="flex items-center gap-1.5 text-xs text-status-blue bg-status-blue-bg px-2 py-1 rounded-lg"><Sliders size={12} /> Live Simulation</div>}
          >
            <div className="space-y-5 mt-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">DC Fast Charge sessions / week</span>
                  <span className="font-bold text-aegis-navy">{simFastCharge}×</span>
                </div>
                <input type="range" min={0} max={7} value={simFastCharge}
                  onChange={(e) => setSimFastCharge(Number(e.target.value))}
                  className="w-full accent-aegis-navy" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>0×</span><span>7×</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Daily driving distance</span>
                  <span className="font-bold text-aegis-navy">{simDailyKm} km/day</span>
                </div>
                <input type="range" min={20} max={150} value={simDailyKm}
                  onChange={(e) => setSimDailyKm(Number(e.target.value))}
                  className="w-full accent-aegis-navy" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1"><span>20 km</span><span>150 km</span></div>
              </div>

              <div className="bg-aegis-light border border-aegis-navy/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Simulated RUL (to 70% SOH)</p>
                  <p className="text-3xl font-bold text-aegis-navy mt-1">{simulatedRul} years</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">vs current estimate</p>
                  <p className={`text-lg font-bold mt-1 ${simulatedRul >= mockRUL.estimatedYears70Soh ? "text-status-green" : "text-status-red"}`}>
                    {simulatedRul >= mockRUL.estimatedYears70Soh ? "+" : ""}{(simulatedRul - mockRUL.estimatedYears70Soh).toFixed(1)} yrs
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
