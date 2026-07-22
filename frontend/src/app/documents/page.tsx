"use client";
import { FileText, Download, Share2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const documents = [
  { id: "doc1", name: "Registration Certificate (RC)",        category: "Legal",    expiryDate: "2038-04-14", status: "valid",       icon: "🪪" },
  { id: "doc2", name: "Insurance Policy — Bajaj Allianz",    category: "Insurance", expiryDate: "2025-04-14", status: "expiring",    icon: "🛡️" },
  { id: "doc3", name: "PUC Certificate",                      category: "Legal",    expiryDate: "2025-10-14", status: "valid",       icon: "♻️" },
  { id: "doc4", name: "Vehicle Purchase Invoice",             category: "Purchase", expiryDate: null,          status: "permanent",   icon: "🧾" },
  { id: "doc5", name: "Warranty Certificate — Tata Motors",  category: "Warranty", expiryDate: "2031-04-15", status: "valid",       icon: "✅" },
  { id: "doc6", name: "AEGIS Battery Health Certificate",     category: "AEGIS",    expiryDate: null,          status: "permanent",   icon: "🔋" },
  { id: "doc7", name: "Service History Report",               category: "Service",  expiryDate: null,          status: "permanent",   icon: "🔧" },
  { id: "doc8", name: "Vehicle Loan Agreement — SBI",        category: "Finance",  expiryDate: "2028-04-15", status: "valid",       icon: "🏦" },
];

const statusConfig = {
  valid:     { badge: "green" as const, icon: CheckCircle, label: "Valid" },
  expiring:  { badge: "amber" as const, icon: Clock,       label: "Expiring Soon" },
  expired:   { badge: "red"   as const, icon: AlertCircle, label: "Expired" },
  permanent: { badge: "grey"  as const, icon: FileText,    label: "Permanent" },
};

export default function DocumentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Document Vault</h1>
        <p className="text-sm text-slate-500 mt-0.5">Secure digital storage for all vehicle documents</p>
      </div>

      {/* Expiry alert */}
      <div className="bg-status-amber-bg border border-status-amber rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-status-amber flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-800">Insurance policy expiring in 42 days</p>
          <p className="text-xs text-slate-600 mt-0.5">Your Bajaj Allianz policy expires 14 Apr 2025. Renew before expiry to avoid coverage gap.</p>
        </div>
      </div>

      {/* Categories filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Legal", "Insurance", "Service", "Finance", "AEGIS"].map((cat) => (
          <button key={cat} className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-aegis-navy hover:text-aegis-navy transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const sc = statusConfig[doc.status as keyof typeof statusConfig];
          const StatusIcon = sc.icon;
          return (
            <div key={doc.id} className="aegis-card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">{doc.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{doc.name}</p>
                  <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 mt-1 inline-block">{doc.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <Badge variant={sc.badge}>
                  <StatusIcon size={10} /> {sc.label}
                </Badge>
                {doc.expiryDate && (
                  <p className="text-[10px] text-slate-400">Expires {formatDate(doc.expiryDate)}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Downloading ${doc.name} (Test mode)`)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-aegis-light hover:text-aegis-navy transition-colors"
                >
                  <Download size={12} /> Download
                </button>
                <button
                  onClick={() => alert(`Share link generated for ${doc.name} (Test mode — valid 24h)`)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-aegis-light hover:text-aegis-navy transition-colors"
                >
                  <Share2 size={12} /> Share
                </button>
              </div>
            </div>
          );
        })}

        {/* Upload card */}
        <button
          onClick={() => alert("File upload dialog (Test mode)")}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-aegis-navy hover:text-aegis-navy hover:bg-aegis-light transition-all"
        >
          <span className="text-3xl mb-2">+</span>
          <p className="text-sm font-medium">Upload Document</p>
          <p className="text-xs mt-1 text-center">PDF, JPG, PNG up to 20 MB</p>
        </button>
      </div>
    </div>
  );
}
