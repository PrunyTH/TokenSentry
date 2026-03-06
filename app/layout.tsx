import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokenSentry - Crypto Token Risk Checker",
  description:
    "TokenSentry provides educational token risk checks for Ethereum and Solana using transparent heuristics.",
  icons: {
    icon: "/branding/tokensentry-appicon.png",
    apple: "/branding/tokensentry-appicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800/70 bg-slate-950/45 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a href="/" className="group flex items-center gap-3 text-xl font-bold text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/branding/tokensentry-appicon.png" alt="TokenSentry app icon" className="h-9 w-9 rounded-full" />
              <span className="main-logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/branding/tokensentry-logo.png" alt="TokenSentry logo" className="main-logo h-10 w-auto md:h-12" />
              </span>
            </a>
            <nav className="flex gap-4 text-sm text-slate-300">
              <a href="/about">About</a>
              <a href="/methodology">Methodology</a>
              <a href="/privacy">Privacy</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-10 border-t border-slate-800/70 bg-slate-950/30">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>TokenSentry © {new Date().getFullYear()} - Security Intelligence for Crypto Tokens</p>
            <div className="flex gap-4">
              <a href="/methodology">Docs</a>
              <a href="/about">About</a>
              <a href="mailto:contact@tokensentry.co">Contact</a>
              <a href="https://x.com" target="_blank" rel="noreferrer">X / Twitter</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
