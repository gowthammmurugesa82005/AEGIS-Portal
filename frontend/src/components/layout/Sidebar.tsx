"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Battery, Wrench, Shield, CreditCard,
  MapPin, Leaf, Navigation, FileText, LogOut, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/battery",      icon: Battery,          label: "Battery Intel" },
  { href: "/maintenance",  icon: Wrench,           label: "Maintenance" },
  { href: "/carbon",       icon: Leaf,             label: "Carbon & ESG" },
  { href: "/insurance",    icon: Shield,           label: "Insurance" },
  { href: "/payments",     icon: CreditCard,       label: "Payments" },
  { href: "/dealers",      icon: MapPin,           label: "Dealers" },
  { href: "/tracking",     icon: Navigation,       label: "Live Tracking" },
  { href: "/documents",    icon: FileText,         label: "Documents" },
];

export function Sidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <aside className="w-60 min-h-screen bg-aegis-dark flex flex-col border-r border-white/5 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-aegis-gold flex items-center justify-center">
            <Zap size={16} className="text-aegis-dark" fill="currentColor" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none">AEGIS</p>
            <p className="text-white/40 text-[10px] leading-tight mt-0.5">Vehicle Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-aegis-navy text-white shadow-sm"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon size={16} className={active ? "text-aegis-gold" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/8 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <p className="text-white/20 text-[10px] text-center mt-3">
          AEGIS v1.0.0-testing
        </p>
      </div>
    </aside>
  );
}
