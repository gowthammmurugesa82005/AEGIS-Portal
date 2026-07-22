"use client";
import { Bell, Wifi, WifiOff, Car } from "lucide-react";
import { mockVehicle, mockAlerts, mockTelemetry } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";

export function Header() {
  const unreadCount = mockAlerts.filter((a) => !a.isRead).length;
  const isOnline     = mockVehicle.status === "online" || mockVehicle.status === "charging";

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Vehicle identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Car size={15} className="text-aegis-navy" />
          <span className="font-semibold text-slate-800">
            {mockVehicle.make} {mockVehicle.model}
          </span>
          <span className="text-slate-400 text-xs">·</span>
          <span className="text-slate-500 text-xs font-mono">{mockVehicle.registrationNo}</span>
        </div>

        {/* Online dot */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${isOnline ? "bg-status-green-bg text-status-green" : "bg-slate-100 text-slate-500"}`}>
          {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
          {isOnline ? "Online" : "Offline"}
          {isOnline && (
            <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse-slow" />
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* SOC chip */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
          <div className="w-6 h-3 rounded-sm border border-slate-300 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-status-green rounded-sm"
              style={{ width: `${mockTelemetry.soc}%` }}
            />
          </div>
          <span className="font-medium">{mockTelemetry.soc}%</span>
          <span className="text-slate-400">SOC</span>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <Bell size={17} className="text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-status-red rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Owner */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-aegis-navy flex items-center justify-center text-white text-xs font-bold">
            {mockVehicle.ownerName.charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-700 hidden md:block">
            {mockVehicle.ownerName}
          </span>
        </div>
      </div>
    </header>
  );
}
