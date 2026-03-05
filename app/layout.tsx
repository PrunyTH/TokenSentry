import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokenSentry - Crypto Token Risk Checker",
  description:
    "TokenSentry provides educational token risk checks for Ethereum and Solana using transparent heuristics.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold text-white">
              TokenSentry
            </a>
            <nav className="flex gap-4 text-sm text-slate-300">
              <a href="/about">About</a>
              <a href="/methodology">Methodology</a>
              <a href="/privacy">Privacy</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
