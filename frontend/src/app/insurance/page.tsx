"use client";
import { useState } from "react";
import { Shield, FileText, Plus, Clock, CheckCircle, ChevronDown, Upload, IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockPolicy, mockClaims } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

const tabs = ["My Policy", "Claims", "New Claim", "Renewal"] as const;
type Tab = typeof tabs[number];

const claimStatusStep: Record<string, number> = {
  submitted: 1, surveyor_assigned: 2, inspection_done: 3, approved: 4, settled: 5,
};

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Policy");
  const [claimStep,  setClaimStep]  = useState(1);
  const [incidentType, setIncidentType] = useState("");

  const daysLeft = mockPolicy.daysToRenewal;
  const renewalUrgency = daysLeft <= 7 ? "red" : daysLeft <= 30 ? "amber" : "green";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Insurance Portal</h1>
        <p className="text-sm text-slate-500 mt-0.5">Policy management · Claim initiation · Renewal</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-white text-aegis-navy shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── My Policy ────────────────────────────────────────────────────── */}
      {activeTab === "My Policy" && (
        <div className="space-y-5">
          <Card>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Active Policy</p>
                <h2 className="text-xl font-bold text-slate-800">{mockPolicy.provider}</h2>
                <p className="text-sm font-mono text-slate-500 mt-0.5">{mockPolicy.policyNumber}</p>
              </div>
              <Badge variant={renewalUrgency}>{daysLeft} days to renewal</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 border-t border-slate-100 pt-5">
              {[
                ["Policy Type",    mockPolicy.type.replace("_", " ").toUpperCase()],
                ["Sum Insured",    formatCurrency(mockPolicy.sumInsuredRs)],
                ["IDV",            formatCurrency(mockPolicy.idvRs)],
                ["Annual Premium", formatCurrency(mockPolicy.premiumRs)],
                ["Valid From",     formatDate(mockPolicy.startDate)],
                ["Valid Until",    formatDate(mockPolicy.endDate)],
                ["Network Garages",`${mockPolicy.networkGarages.toLocaleString("en-IN")} garages`],
                ["Status",         mockPolicy.status.replace("_", " ").toUpperCase()],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">{k}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
              {[
                [mockPolicy.hasBatteryProtect,    "Battery Protection"],
                [mockPolicy.hasRoadsideAssist,    "Roadside Assistance"],
                [mockPolicy.hasZeroDepreciation,  "Zero Depreciation"],
              ].map(([has, label]) => (
                <div key={String(label)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${has ? "bg-status-green-bg text-status-green" : "bg-slate-100 text-slate-400"}`}>
                  <CheckCircle size={12} />
                  {String(label)}
                </div>
              ))}
            </div>
          </Card>

          {/* AEGIS Battery Data Package promo */}
          <div className="bg-gradient-to-r from-aegis-navy to-aegis-dark rounded-2xl p-5 text-white">
            <p className="text-sm font-semibold mb-1.5">🔋 AEGIS Battery Health Certificate</p>
            <p className="text-xs text-white/70 mb-3">
              Download a tamper-proof battery condition report from your Digital Passport — share with your insurer to request lower premiums for well-maintained batteries.
            </p>
            <button className="bg-aegis-gold text-aegis-dark text-xs font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
              Generate Certificate
            </button>
          </div>
        </div>
      )}

      {/* ── Claims ───────────────────────────────────────────────────────── */}
      {activeTab === "Claims" && (
        <div className="space-y-4">
          {mockClaims.map((claim) => {
            const step = claimStatusStep[claim.status] ?? 1;
            const steps = ["Submitted", "Surveyor Assigned", "Inspection", "Approved", "Settled"];
            return (
              <Card key={claim.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-slate-800">{claim.incidentType}</p>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{claim.claimNumber}</p>
                    <p className="text-xs text-slate-500 mt-1">{claim.description}</p>
                  </div>
                  <Badge variant={claim.status === "settled" ? "green" : "amber"}>
                    {claim.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Progress steps */}
                <div className="flex items-center gap-0 mb-4">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i < step ? "bg-status-green text-white" : "bg-slate-100 text-slate-400"}`}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 ${i < step - 1 ? "bg-status-green" : "bg-slate-100"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center border-t border-slate-100 pt-3">
                  <div><p className="text-[10px] text-slate-400">Claimed</p><p className="text-sm font-bold text-slate-800">{formatCurrency(claim.claimedAmountRs)}</p></div>
                  <div><p className="text-[10px] text-slate-400">Settled</p><p className="text-sm font-bold text-status-green">{claim.settledAmountRs ? formatCurrency(claim.settledAmountRs) : "—"}</p></div>
                  <div><p className="text-[10px] text-slate-400">Date</p><p className="text-sm font-bold text-slate-800">{formatDate(claim.date)}</p></div>
                </div>
              </Card>
            );
          })}

          <button onClick={() => setActiveTab("New Claim")} className="aegis-btn-primary flex items-center gap-2">
            <Plus size={15} /> Raise New Claim
          </button>
        </div>
      )}

      {/* ── New Claim ─────────────────────────────────────────────────── */}
      {activeTab === "New Claim" && (
        <Card title="Initiate Insurance Claim" subtitle="Complete in under 5 minutes">
          {claimStep === 1 && (
            <div className="space-y-4 mt-3">
              <p className="text-sm font-medium text-slate-700 mb-3">Step 1 of 4 — Select Incident Type</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Own Damage (Accident)", "Third-Party Damage", "Theft", "Fire", "Natural Calamity", "Battery Damage"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setIncidentType(type)}
                    className={`p-3 rounded-xl border-2 text-sm text-left transition-all ${incidentType === type ? "border-aegis-navy bg-aegis-light text-aegis-navy font-semibold" : "border-slate-100 text-slate-600 hover:border-slate-200"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button
                disabled={!incidentType}
                onClick={() => setClaimStep(2)}
                className="aegis-btn-primary disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
          )}

          {claimStep === 2 && (
            <div className="space-y-4 mt-3">
              <p className="text-sm font-medium text-slate-700 mb-3">Step 2 of 4 — Incident Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-600 block mb-1">Date of Incident</label><input type="date" className="input-field" /></div>
                <div><label className="text-xs text-slate-600 block mb-1">Time</label><input type="time" className="input-field" /></div>
              </div>
              <div><label className="text-xs text-slate-600 block mb-1">Location</label><input type="text" className="input-field" placeholder="Auto-detected or enter manually" /></div>
              <div><label className="text-xs text-slate-600 block mb-1">Brief Description</label><textarea className="input-field h-24 resize-none" placeholder="Describe what happened…" /></div>
              <div className="flex gap-3">
                <button onClick={() => setClaimStep(1)} className="aegis-btn-outline">← Back</button>
                <button onClick={() => setClaimStep(3)} className="aegis-btn-primary">Continue →</button>
              </div>
            </div>
          )}

          {claimStep === 3 && (
            <div className="space-y-4 mt-3">
              <p className="text-sm font-medium text-slate-700 mb-3">Step 3 of 4 — Upload Evidence</p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-aegis-navy transition-colors cursor-pointer">
                <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">Drag photos/videos here or click to upload</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, MP4 · Max 50 MB per file</p>
              </div>
              <div className="bg-aegis-light rounded-xl p-4">
                <p className="text-xs font-semibold text-aegis-navy mb-1">⚡ AEGIS Battery Data Package</p>
                <p className="text-xs text-slate-600">We will automatically attach SOH, SOC, and fault code data from your Digital Battery Passport to strengthen your claim.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setClaimStep(2)} className="aegis-btn-outline">← Back</button>
                <button onClick={() => setClaimStep(4)} className="aegis-btn-primary">Continue →</button>
              </div>
            </div>
          )}

          {claimStep === 4 && (
            <div className="space-y-4 mt-3">
              <p className="text-sm font-medium text-slate-700 mb-3">Step 4 of 4 — Review & Submit</p>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                {[["Incident Type", incidentType], ["Policy", mockPolicy.policyNumber], ["Vehicle", "Tata Nexon EV Max — TN 33 EV 2024"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm"><span className="text-slate-500">{k}</span><span className="font-medium text-slate-800">{v}</span></div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setClaimStep(3)} className="aegis-btn-outline">← Back</button>
                <button
                  onClick={() => { alert("Claim submitted! (Test mode — no actual API call)"); setClaimStep(1); setActiveTab("Claims"); }}
                  className="aegis-btn-primary flex items-center gap-2"
                >
                  <Shield size={15} /> Submit Claim
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── Renewal ───────────────────────────────────────────────────── */}
      {activeTab === "Renewal" && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 border-2 ${daysLeft <= 30 ? "border-status-amber bg-status-amber-bg" : "border-status-blue bg-status-blue-bg"}`}>
            <p className="font-semibold text-slate-800 mb-1">
              {daysLeft <= 30 ? `⚠ Policy expires in ${daysLeft} days` : `Policy expires in ${daysLeft} days`}
            </p>
            <p className="text-xs text-slate-600">Renewal on: {formatDate(mockPolicy.endDate)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { provider: "Bajaj Allianz (Current)", premium: 24800, rating: 4.4, type: "Comprehensive + Battery", highlight: false },
              { provider: "HDFC ERGO",               premium: 22400, rating: 4.6, type: "Comprehensive + Zero Dep", highlight: true },
              { provider: "ICICI Lombard",            premium: 23100, rating: 4.5, type: "Comprehensive + Roadside", highlight: false },
            ].map(({ provider, premium, rating, type, highlight }) => (
              <Card key={provider} className={highlight ? "border-2 border-aegis-navy" : ""}>
                {highlight && <p className="text-[10px] font-bold text-aegis-navy uppercase tracking-wide mb-2">Recommended</p>}
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-slate-800 text-sm">{provider}</p>
                  <p className="text-xs text-slate-500">⭐ {rating}</p>
                </div>
                <p className="text-2xl font-bold text-aegis-navy mb-1">{formatCurrency(premium)}</p>
                <p className="text-xs text-slate-500 mb-3">{type}</p>
                <button
                  onClick={() => alert(`Proceeding to pay ${formatCurrency(premium)} to ${provider} (Test mode)`)}
                  className={highlight ? "aegis-btn-primary w-full" : "aegis-btn-outline w-full"}
                >
                  {highlight ? "Renew Now" : "Select Plan"}
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
