import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_30px_rgba(247,147,26,0.28)] hover:brightness-105",
  secondary:
    "border border-slate-600 bg-slate-900/80 text-slate-100 hover:border-sky-400/70 hover:text-white",
  ghost: "text-slate-300 hover:text-white",
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`}
    />
  );
}

