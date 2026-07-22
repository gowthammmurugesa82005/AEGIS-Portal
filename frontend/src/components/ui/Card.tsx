import { cn } from "@/lib/utils";

interface CardProps {
  children:  React.ReactNode;
  className?: string;
  title?:    string;
  subtitle?: string;
  action?:   React.ReactNode;
}

export function Card({ children, className, title, subtitle, action }: CardProps) {
  return (
    <div className={cn("aegis-card", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title    && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
