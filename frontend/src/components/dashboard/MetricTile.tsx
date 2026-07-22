import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricTileProps {
  icon:       LucideIcon;
  iconColor:  string;
  label:      string;
  value:      string | number;
  unit?:      string;
  subLabel?:  string;
  subValue?:  string;
  accent?:    "green" | "amber" | "red" | "blue";
  barPercent?: number; // 0-100 for fill bar
}

const accentMap = {
  green: { bar: "bg-status-green", text: "text-status-green", bg: "bg-status-green-bg" },
  amber: { bar: "bg-status-amber", text: "text-status-amber", bg: "bg-status-amber-bg" },
  red:   { bar: "bg-status-red",   text: "text-status-red",   bg: "bg-status-red-bg" },
  blue:  { bar: "bg-status-blue",  text: "text-status-blue",  bg: "bg-status-blue-bg" },
};

export function MetricTile({
  icon: Icon, iconColor, label, value, unit, subLabel, subValue, accent = "blue", barPercent,
}: MetricTileProps) {
  const a = accentMap[accent];

  return (
    <div className="aegis-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", a.bg)}>
          <Icon size={15} className={iconColor} />
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <span className={cn("text-3xl font-bold leading-none", a.text)}>{value}</span>
        {unit && <span className="text-sm text-slate-500 mb-0.5">{unit}</span>}
      </div>

      {/* Optional fill bar (e.g. SOC) */}
      {barPercent !== undefined && (
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", a.bar)}
            style={{ width: `${barPercent}%` }}
          />
        </div>
      )}

      {/* Sub info */}
      {subLabel && (
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-2">
          <span>{subLabel}</span>
          {subValue && <span className="font-medium text-slate-700">{subValue}</span>}
        </div>
      )}
    </div>
  );
}
