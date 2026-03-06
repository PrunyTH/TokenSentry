import { ReactNode } from "react";

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-400/35 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200 ${className}`}
    >
      {children}
    </span>
  );
}

