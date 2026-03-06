import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel rounded-2xl p-5 ${className}`}>{children}</div>;
}

