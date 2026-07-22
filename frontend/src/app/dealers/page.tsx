"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, Star, Wrench, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mockDealers } from "@/lib/mockData";

export default function DealersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [bookingDealer, setBookingDealer] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(1);

  const dealer = mockDealers.find((d) => d.id === selected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-aegis-navy">Dealer & Service Network</h1>
        <p className="text-sm text-slate-500 mt-0.5">Find authorised Tata EV dealers near you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dealer list */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide px-1">
            {mockDealers.length} dealers found near Erode, TN
          </p>
          {mockDealers.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selected === d.id ? "border-aegis-navy bg-aegis-light" : "border-slate-100 bg-white hover:border-slate-200"}`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-slate-800 text-sm leading-tight">{d.name}</p>
                <Badge variant={d.type === "both" ? "blue" : d.type === "service" ? "green" : "grey"}>
                  {d.type}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mb-2">{d.address}, {d.city}</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-aegis-gold font-medium">
                    <Star size={11} fill="currentColor" /> {d.rating}
                  </span>
                  <span className="text-slate-400">{d.totalReviews} reviews</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-slate-400" />
                  <span className="text-slate-500">{d.distanceKm} km</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${d.openNow ? "bg-status-green" : "bg-slate-300"}`} />
                <span className={`text-[11px] ${d.openNow ? "text-status-green" : "text-slate-400"}`}>
                  {d.openNow ? "Open Now" : "Closed"}
                </span>
                {d.nextAvailableSlot && (
                  <span className="text-[11px] text-slate-400 ml-auto">{d.nextAvailableSlot}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {dealer ? (
            <div className="space-y-4">
              {/* Static map placeholder — in production use react-leaflet */}
              <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border border-slate-200">
                <div className="text-center">
                  <MapPin size={28} className="text-aegis-navy mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">{dealer.name}</p>
                  <p className="text-xs text-slate-400">{dealer.latitude.toFixed(4)}, {dealer.longitude.toFixed(4)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">(Map renders with Leaflet in production build)</p>
                </div>
              </div>

              <Card>
                <h3 className="font-bold text-slate-800 mb-1">{dealer.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{dealer.address}, {dealer.city}, {dealer.state}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-aegis-navy" /> {dealer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={14} className="text-aegis-navy" /> {dealer.openHours}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Available Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dealer.services.map((s) => (
                      <span key={s} className="text-[11px] bg-aegis-light text-aegis-navy rounded-full px-2.5 py-0.5 font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                {bookingDealer !== dealer.id ? (
                  <button
                    onClick={() => { setBookingDealer(dealer.id); setBookingStep(1); }}
                    className="aegis-btn-primary flex items-center gap-2 w-full justify-center"
                  >
                    <Calendar size={15} /> Book Service Appointment
                  </button>
                ) : (
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">
                      Step {bookingStep} of 3 — {["Select Service", "Choose Slot", "Confirm"][bookingStep - 1]}
                    </p>

                    {bookingStep === 1 && (
                      <div className="space-y-2">
                        {dealer.services.map((s) => (
                          <button key={s} onClick={() => setBookingStep(2)}
                            className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-aegis-navy hover:bg-aegis-light text-sm text-slate-700 transition-all flex items-center gap-2">
                            <Wrench size={13} className="text-aegis-navy" /> {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {bookingStep === 2 && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500">Available slots this week</p>
                        {["Tomorrow 10:30 AM", "Tomorrow 2:00 PM", "Wed 9:00 AM", "Wed 3:30 PM"].map((slot) => (
                          <button key={slot} onClick={() => setBookingStep(3)}
                            className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-aegis-navy hover:bg-aegis-light text-sm text-slate-700 transition-all flex items-center gap-2">
                            <Calendar size={13} className="text-aegis-navy" /> {slot}
                          </button>
                        ))}
                      </div>
                    )}

                    {bookingStep === 3 && (
                      <div className="space-y-3">
                        <div className="bg-aegis-light rounded-xl p-3 text-sm text-slate-700">
                          Booking confirmed for <strong>Tomorrow 10:30 AM</strong> at <strong>{dealer.name}</strong>
                        </div>
                        <textarea className="input-field text-xs h-16 resize-none" placeholder="Notes for service advisor (optional)…" />
                        <button
                          onClick={() => { alert("Appointment booked! (Test mode)"); setBookingDealer(null); }}
                          className="aegis-btn-primary w-full flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={15} /> Confirm Booking
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="text-center p-8">
                <MapPin size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Select a dealer to view details</p>
                <p className="text-xs text-slate-400 mt-1">Click any dealer card on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
