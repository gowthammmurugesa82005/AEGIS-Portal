"use client";
import Link from "next/link";
import { Shield, Wrench, Battery, Wifi, Code, Info, ChevronRight } from "lucide-react";
import { mockAlerts } from "@/lib/mockData";
import { timeAgo, cn } from "@/lib/utils";
import type { Alert } from "@/types";

const typeIcon = {
  insurance:   Shield,
  maintenance: Wrench,
  battery:     Battery,
  security:    Wifi,
  charging:    Wifi,
  software:    Code,
};

const severityStyle: Record<Alert["severity"], string> = {
  critical: "border-l-status-red bg-status-red-bg",
  high:     "border-l-status-red bg-status-red-bg",
  medium:   "border-l-status-amber bg-status-amber-bg",
  low:      "border-l-status-green bg-status-green-bg",
  info:     "border-l-status-blue bg-status-blue-bg",
};

const severityDot: Record<Alert["severity"], string> = {
  critical: "bg-status-red",
  high:     "bg-status-red",
  medium:   "bg-status-amber",
  low:      "bg-status-green",
  info:     "bg-status-blue",
};

export function AlertFeed() {
  return (
    <div className="aegis-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">Recent Alerts</h3>
        <span className="text-xs text-slate-400">{mockAlerts.filter(a => !a.isRead).length} unread</span>
      </div>

      <div className="space-y-2.5">
        {mockAlerts.map((alert) => {
          const Icon = typeIcon[alert.type] ?? Info;
          return (
            <div
              key={alert.id}
              className={cn(
                "flex gap-3 p-3 rounded-xl border-l-4 border border-transparent transition-all",
                severityStyle[alert.severity],
                !alert.isRead && "ring-1 ring-inset ring-slate-200"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Icon size={14} className="text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {!alert.isRead && (
                      <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1.5 -mt-0.5 align-middle", severityDot[alert.severity])} />
                    )}
                    {alert.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{timeAgo(alert.timestamp)}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{alert.message}</p>
                {alert.actionLabel && alert.actionHref && (
                  <Link
                    href={alert.actionHref}
                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-aegis-navy mt-1.5 hover:underline"
                  >
                    {alert.actionLabel} <ChevronRight size={11} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
