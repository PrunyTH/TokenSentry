import { ReactNode } from "react";

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return <div id={id} className={`panel rounded-2xl p-5 ${className}`}>{children}</div>;
}

