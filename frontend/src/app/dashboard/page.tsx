"use client";
import { Battery, Wrench, Leaf, TrendingUp } from "lucide-react";
import { HealthScoreGauge } from "@/components/dashboard/HealthScoreGauge";
import { MetricTile } from "@/components/dashboard/MetricTile";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { Card } from "@/components/ui/Card";
import { mockTelemetry, mockMaintenanceItems, mockCarbon, mockVehicle, mockTrips } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const nextMaint = mockMaintenanceItems[0];
  const weekTrips = mockTrips.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page title */}
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Vehicle Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {mockVehicle.make} {mockVehicle.model} · Last updated just now
        </p>
      </div>

      {/* Top row: Health Gauge + Metric tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Health Score spans 1 col */}
        <div className="lg:col-span-1">
          <HealthScoreGauge />
        </div>

        {/* 4 metric tiles in 2×2 on right */}
        <div className="lg:col-span-3 grid grid-cols-2 xl:grid-cols-2 gap-5">
          <MetricTile
            icon={Battery}
            iconColor="text-status-green"
            label="State of Charge"
            value={mockTelemetry.soc}
            unit="%"
            accent="green"
            barPercent={mockTelemetry.soc}
            subLabel="Est. Range"
            subValue={`${mockTelemetry.estimatedRangeKm} km`}
          />
          <MetricTile
            icon={TrendingUp}
            iconColor="text-status-blue"
            label="State of Health"
            value={mockTelemetry.soh}
            unit="%"
            accent="blue"
            barPercent={mockTelemetry.soh}
            subLabel="Trend (30 days)"
            subValue="−0.6% (stable)"
          />
          <MetricTile
            icon={Wrench}
            iconColor="text-status-amber"
            label="Maintenance"
            value="1,580"
            unit=" km"
            accent="amber"
            subLabel={nextMaint.title}
            subValue={nextMaint.urgency.toUpperCase()}
          />
          <MetricTile
            icon={Leaf}
            iconColor="text-status-green"
            label="Carbon Today"
            value={mockCarbon.todayCo2Kg.toFixed(1)}
            unit=" kg CO₂e"
            accent="green"
            subLabel="Saved vs petrol"
            subValue={`−${(mockCarbon.todayCo2Kg * 6.8).toFixed(1)} kg`}
          />
        </div>
      </div>

      {/* Second row: Alerts + Trip chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <AlertFeed />
        </div>

        <div className="lg:col-span-2">
          <Card title="Recent Trips" subtitle="Last 5 journeys — energy vs distance">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekTrips} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="startLocation"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  formatter={(val: number, name: string) => [
                    name === "distanceKm" ? `${val} km` : `${val} kWh`,
                    name === "distanceKm" ? "Distance" : "Energy",
                  ]}
                />
                <Bar dataKey="distanceKm" fill="#1B3A6B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="energyKwh"  fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Vehicle Identity strip */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: "Registration", value: mockVehicle.registrationNo },
            { label: "Purchase Date", value: formatDate(mockVehicle.purchaseDate) },
            { label: "Odometer",      value: `${mockTelemetry.odometreKm.toLocaleString("en-IN")} km` },
            { label: "Battery",       value: `${mockVehicle.batteryCapacityKwh} kWh ${mockVehicle.batteryChemistry}` },
            { label: "Motor",         value: `${mockVehicle.motorPowerKw} kW` },
            { label: "Rated Range",   value: `${mockVehicle.ratedRangeKm} km` },
            { label: "Registered At", value: `${mockVehicle.registeredCity}, ${mockVehicle.registeredState}` },
            { label: "Color",         value: mockVehicle.color },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
