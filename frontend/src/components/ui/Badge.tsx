import { cn } from "@/lib/utils";

type Variant = "green" | "amber" | "red" | "blue" | "grey";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const variantMap: Record<Variant, string> = {
  green: "aegis-badge-green",
  amber: "aegis-badge-amber",
  red:   "aegis-badge-red",
  blue:  "aegis-badge-blue",
  grey:  "bg-slate-100 text-slate-600 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
};

export function Badge({ children, variant = "blue", className }: BadgeProps) {
  return (
    <span className={cn(variantMap[variant], className)}>
      {children}
    </span>
  );
}
