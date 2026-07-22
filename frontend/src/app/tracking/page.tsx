"use client";
import { useState } from "react";
import { Navigation, Thermometer, Lock, Zap, Shield, MapPin, Clock, Bell } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockVehicle, mockTelemetry } from "@/lib/mockData";

export default function TrackingPage() {
  const [acActive,   setAcActive]   = useState(false);
  const [acTemp,     setAcTemp]     = useState(22);
  const [sentryOn,   setSentryOn]   = useState(true);
  const [geofences,  setGeofences]  = useState([
    { id: "gf1", name: "Home — Erode",     radius: "2 km", active: true  },
    { id: "gf2", name: "Office — Coimbatore", radius: "500 m", active: false },
  ]);

  function toggleGeofence(id: string) {
    setGeofences((g) => g.map((f) => f.id === id ? { ...f, active: !f.active } : f));
  }

  function handlePreCondition() {
    if (mockTelemetry.soc < 15) {
      alert("⚠ SOC below 15% — Pre-conditioning disabled to preserve range.");
      return;
    }
    setAcActive(true);
    alert(`✅ Pre-conditioning started. Cabin will reach ${acTemp}°C in ~15 min.\nEstimated battery cost: 2% SOC (test mode simulation)`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Live Tracking & Remote</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time location · Remote control · Security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Static map placeholder */}
          <div className="h-72 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 rounded-2xl relative overflow-hidden border border-slate-200">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-aegis-navy rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Navigation size={18} className="text-white" fill="white" />
                  </div>
                  <div className="absolute -inset-3 rounded-full bg-aegis-navy/20 animate-ping" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-3">{mockVehicle.registeredCity}</p>
                <p className="text-xs text-slate-500">11.3410° N, 77.7172° E</p>
                <p className="text-[10px] text-slate-400 mt-1">(Leaflet map in production build)</p>
              </div>
            </div>
            {/* Live status overlay */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                <span className="font-medium text-slate-800">Online · Parked</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Last updated: just now</p>
            </div>
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-sm">
              <p className="text-[10px] text-slate-500">SOC</p>
              <p className="text-sm font-bold text-status-green">{mockTelemetry.soc}%</p>
            </div>
          </div>

          {/* Geofencing */}
          <Card title="Geofencing" subtitle="Alert when vehicle enters or leaves defined areas">
            <div className="mt-2 space-y-2">
              {geofences.map((gf) => (
                <div key={gf.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MapPin size={14} className={gf.active ? "text-aegis-navy" : "text-slate-400"} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{gf.name}</p>
                      <p className="text-xs text-slate-500">Radius: {gf.radius}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={gf.active ? "green" : "grey"}>{gf.active ? "Active" : "Off"}</Badge>
                    <button
                      onClick={() => toggleGeofence(gf.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${gf.active ? "bg-aegis-navy" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${gf.active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => alert("Geofence drawing tool — draw on map in production (Test mode)")}
                className="w-full text-xs text-aegis-navy font-medium py-2 border border-dashed border-aegis-navy/30 rounded-xl hover:bg-aegis-light transition-colors"
              >
                + Add Geofence
              </button>
            </div>
          </Card>
        </div>

        {/* Remote controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Climate pre-conditioning */}
          <Card title="Remote Climate">
            <div className="space-y-3 mt-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Cabin Temp</span>
                <span className="font-bold text-status-red">{mockTelemetry.cabinTempC}°C</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Ambient</span>
                <span className="font-medium text-slate-800">{mockTelemetry.ambientTempC}°C</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Target Temperature</span>
                  <span className="font-semibold text-aegis-navy">{acTemp}°C</span>
                </div>
                <input type="range" min={16} max={30} value={acTemp}
                  onChange={(e) => setAcTemp(Number(e.target.value))}
                  className="w-full accent-aegis-navy" />
              </div>
              <button
                onClick={handlePreCondition}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${acActive ? "bg-status-green text-white" : "bg-aegis-navy text-white hover:bg-aegis-dark"}`}
              >
                <Thermometer size={15} />
                {acActive ? "Pre-conditioning Active" : "Start Pre-conditioning"}
              </button>
              {acActive && (
                <p className="text-[11px] text-status-green text-center">Target {acTemp}°C in ~15 min · −2% SOC</p>
              )}
            </div>
          </Card>

          {/* Sentry Mode */}
          <Card title="Sentry Mode">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className={sentryOn ? "text-status-green" : "text-slate-400"} />
                <span className="text-sm font-medium text-slate-800">{sentryOn ? "Active" : "Inactive"}</span>
              </div>
              <button
                onClick={() => setSentryOn(!sentryOn)}
                className={`w-11 h-6 rounded-full transition-colors relative ${sentryOn ? "bg-status-green" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${sentryOn ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            {sentryOn && (
              <div className="space-y-1.5">
                {[
                  { icon: Bell,   text: "Motion alerts: ON" },
                  { icon: Zap,    text: "OBD tamper detect: ON" },
                  { icon: Lock,   text: "Unauthorised start: ON" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-status-green">
                    <Icon size={11} /> {text}
                  </div>
                ))}
                <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-2">No security events in last 24h</p>
              </div>
            )}
          </Card>

          {/* Smart Charge Scheduler */}
          <Card title="Smart Charge Scheduler">
            <div className="space-y-3 mt-1">
              <div>
                <p className="text-xs text-slate-500 mb-1">Departure Time</p>
                <input type="time" defaultValue="07:30" className="input-field text-sm" />
              </div>
              <div className="bg-status-green-bg rounded-xl p-3">
                <p className="text-[11px] text-status-green font-semibold mb-1">Optimal Window Found</p>
                <p className="text-xs text-slate-600">10:30 PM – 6:00 AM</p>
                <p className="text-[10px] text-slate-500 mt-0.5">480 gCO₂/kWh · ₹5.2/kWh off-peak rate</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Est. cost to full</span>
                <span className="font-semibold text-aegis-navy">₹{Math.round((100 - mockTelemetry.soc) / 100 * 40.5 * 5.2)}</span>
              </div>
              <button
                onClick={() => alert("Smart charge scheduled for 10:30 PM (Test mode)")}
                className="aegis-btn-primary w-full text-sm"
              >
                <Zap size={13} className="inline mr-1" /> Schedule Smart Charge
              </button>
            </div>
          </Card>

          {/* OTA Update */}
          <Card title="Software Update">
            <div className="bg-status-blue-bg rounded-xl p-3 mb-3">
              <p className="text-xs font-semibold text-status-blue">v2.5.1 Available</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Cold-weather charging +12% speed · Regen braking optimised</p>
              <p className="text-[10px] text-slate-400 mt-1">Size: 234 MB · ~18 min to install</p>
            </div>
            <button
              onClick={() => alert("OTA update scheduled for tonight (Test mode)")}
              className="aegis-btn-outline w-full text-xs"
            >
              Schedule for Tonight
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
