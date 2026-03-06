import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#E2C98D] to-[#D8AD60] text-slate-950 shadow-[0_0_24px_rgba(216,173,96,0.32)] hover:brightness-105",
  secondary:
    "border border-slate-500/70 bg-slate-900/55 text-slate-100 hover:border-sky-400/70 hover:text-white",
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
