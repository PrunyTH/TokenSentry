import { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-600 bg-slate-900/55 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-[#E2C98D] focus:ring-2 focus:ring-[#E2C98D]/25 ${props.className ?? ""}`}
    />
  );
}
