"use client";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { mockHealthScore } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const subScores = [
  { label: "Battery Health",     key: "batteryHealth",    weight: "35%" },
  { label: "Mechanical",         key: "mechanicalHealth", weight: "25%" },
  { label: "Charging System",    key: "chargingSystem",   weight: "20%" },
  { label: "Software",           key: "softwareStatus",   weight: "10%" },
  { label: "Tyres & Brakes",     key: "tyresBrakes",      weight: "10%" },
] as const;

function scoreColor(v: number) {
  if (v >= 80) return "#1A7A4A";
  if (v >= 60) return "#C97B22";
  if (v >= 40) return "#D97706";
  return "#B22222";
}

export function HealthScoreGauge() {
  const { overall } = mockHealthScore;
  const gaugeData = [{ value: overall, fill: scoreColor(overall) }];

  return (
    <div className="aegis-card flex flex-col items-center">
      <p className="text-sm font-semibold text-slate-500 mb-1">Overall Health Score</p>

      {/* Radial gauge */}
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="68%" outerRadius="88%"
            startAngle={220} endAngle={-40}
            data={gaugeData}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f1f5f9" }} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold", overall >= 80 ? "text-status-green" : overall >= 60 ? "text-status-amber" : "text-status-red")}>
            {overall}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">/ 100</span>
        </div>
      </div>

      <p className="text-sm font-medium text-slate-700 -mt-2 mb-4">
        {mockHealthScore.gradeLabel}
      </p>

      {/* Sub-score bars */}
      <div className="w-full space-y-2.5">
        {subScores.map(({ label, key, weight }) => {
          const val = mockHealthScore[key];
          return (
            <div key={key}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">{weight}</span>
                  <span className="font-semibold" style={{ color: scoreColor(val) }}>{val}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${val}%`, background: scoreColor(val) }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
