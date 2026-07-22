"use client";
import { FlaskConical, X } from "lucide-react";
import { useState } from "react";

export function TestModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 text-amber-800">
        <FlaskConical size={15} className="flex-shrink-0" />
        <p className="text-xs font-medium">
          <span className="font-bold uppercase tracking-wide mr-1.5">Testing Mode</span>
          All vehicle data is simulated. Login with chassis{" "}
          <code className="bg-amber-200 rounded px-1.5 py-0.5 font-mono text-[11px]">AEGIS2024TEST001</code>
          {" "}and OTP{" "}
          <code className="bg-amber-200 rounded px-1.5 py-0.5 font-mono text-[11px]">123456</code>
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-600 hover:text-amber-800 transition-colors flex-shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
