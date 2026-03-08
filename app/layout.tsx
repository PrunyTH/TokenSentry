import type { Metadata } from "next";
import { Raleway, Montserrat } from "next/font/google";
import "./globals.css";
import { HomeMarketPrices } from "@/components/HomeMarketPrices";
import { CryptoNewsFeed } from "@/components/CryptoNewsFeed";
import { BrandLogo } from "@/components/BrandLogo";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-raleway",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TokenSentry - Crypto Token Risk Checker",
  description:
    "TokenSentry provides educational token risk checks for Ethereum and Solana using transparent heuristics.",
  metadataBase: new URL("https://tokensentry.co"),
  icons: {
    icon: [
      { url: "/favicon.ico",    sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-32.png", sizes: "32x32",  type: "image/png" },
      { url: "/favicon-192.png",sizes: "192x192",type: "image/png" },
      { url: "/favicon.svg",    type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#060a14",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "TokenSentry",
  },
  openGraph: {
    title: "TokenSentry - Crypto Token Risk Checker",
    description:
      "Educational crypto token risk checks for Ethereum and Solana with transparent heuristics.",
    images: ["/branding/tokensentry-logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable} ${montserrat.variable}`}>
      <body className="font-sans layout-root">

        {/* ── Left sidebar – locked in place ── */}
        <aside className="sidebar-nav">
          <div className="sidebar-logo-area">
            <a href="/" className="group block">
              <BrandLogo className="brand-logo-svg" />
            </a>
          </div>

          <p className="sidebar-section-label">Navigation</p>

          <nav className="sidebar-links">
            {[
              { href: "/",            label: "Home" },
              { href: "/about",       label: "About" },
              { href: "/methodology", label: "Methodology" },
              { href: "/privacy",     label: "Privacy" },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="sidebar-link">
                <span className="sidebar-link-bar" aria-hidden="true" />
                <span className="sidebar-link-text">{label}</span>
              </a>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <p className="text-[11px] text-slate-600 leading-relaxed">© {new Date().getFullYear()} TokenSentry</p>
            <p className="text-[10px] text-slate-700 mt-0.5 tracking-wide uppercase">Security Intelligence</p>
          </div>
        </aside>

        {/* ── Middle scrollable content ── */}
        <div className="content-scroll-area">
          <main className="px-6 py-8">{children}</main>
          <footer className="mt-10 border-t border-slate-800/70 bg-slate-950/30">
            <div className="flex flex-col gap-4 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <p>TokenSentry © {new Date().getFullYear()} — Security Intelligence for Crypto Tokens</p>
              <div className="flex gap-4">
                <a href="/methodology" className="footer-link">Docs</a>
                <a href="/about" className="footer-link">About</a>
                <a href="mailto:contact@tokensentry.co" className="footer-link">Contact</a>
                <a href="https://x.com/TokenSentry" target="_blank" rel="noreferrer" className="footer-link">X / Twitter</a>
              </div>
            </div>
          </footer>
        </div>

        {/* ── Right sidebar: market prices + news ── */}
        <aside className="right-sidebar">
          <div className="right-sidebar-inner">
            <HomeMarketPrices />
            <CryptoNewsFeed />
          </div>
        </aside>

      </body>
    </html>
  );
}
