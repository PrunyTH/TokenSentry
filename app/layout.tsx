import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TokenSentry - Crypto Token Risk Checker",
  description:
    "TokenSentry provides educational token risk checks for Ethereum and Solana using transparent heuristics.",
  metadataBase: new URL("https://tokensentry.co"),
  icons: {
    icon: "/tokensentry-appicon.png",
    apple: "/tokensentry-appicon.png",
  },
  openGraph: {
    title: "TokenSentry - Crypto Token Risk Checker",
    description:
      "Educational crypto token risk checks for Ethereum and Solana with transparent heuristics.",
    images: ["/branding/tokensentry-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={raleway.variable}>
      <body className="font-sans">
        <header className="border-b border-slate-700/45 bg-slate-950/35 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between px-4 py-3 md:py-4">
            <a href="/" className="group flex items-center gap-3 text-xl font-bold text-white">
              <span className="main-logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/branding/tokensentry-logo.png" alt="TokenSentry logo" className="main-logo h-12 w-auto md:h-14" />
              </span>
            </a>
            <nav className="flex gap-4 text-sm font-medium text-slate-300 md:gap-6">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/methodology">Methodology</a>
              <a href="/privacy">Privacy</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1760px] px-4 py-8">{children}</main>
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
