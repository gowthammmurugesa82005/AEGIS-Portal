import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getHealthGradeColor(score: number): string {
  if (score >= 80) return "text-status-green";
  if (score >= 60) return "text-status-amber";
  if (score >= 40) return "text-orange-600";
  return "text-status-red";
}

export function getHealthGradeBg(score: number): string {
  if (score >= 80) return "bg-status-green-bg border-status-green";
  if (score >= 60) return "bg-status-amber-bg border-status-amber";
  if (score >= 40) return "bg-orange-50 border-orange-400";
  return "bg-status-red-bg border-status-red";
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "text-status-red bg-status-red-bg";
    case "high":     return "text-status-red bg-status-red-bg";
    case "medium":   return "text-status-amber bg-status-amber-bg";
    case "low":      return "text-status-green bg-status-green-bg";
    default:         return "text-status-blue bg-status-blue-bg";
  }
}

export function maskChassis(chassis: string): string {
  if (chassis.length <= 6) return chassis;
  return chassis.slice(0, -6).replace(/./g, "•") + chassis.slice(-6);
}
