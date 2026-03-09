import type { Metadata } from "next";
import { InputForm } from "@/components/InputForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Start a Token Report | TokenSentry",
  description:
    "Run a TokenSentry crypto token risk report. Paste a token name, contract address, or Solana mint to analyze honeypot, liquidity, and contract risks.",
};

const checks = [
  "Honeypot and sell simulation",
  "Liquidity depth and LP lock analysis",
  "Contract verification and risk flags",
  "Holder concentration and ownership review",
];

const supportedChains = ["Ethereum", "BNB Chain", "Polygon", "Arbitrum", "Base", "Avalanche", "Optimism", "Solana"];

const partners = [
  {
    name: "Coinbase Affiliate",
    href: "https://www.coinbase.com/affiliates",
    desc: "Useful if you want a mainstream exchange referral aligned with beginner-friendly crypto education.",
    accent: "from-sky-400/25 to-blue-500/15 border-sky-400/30",
    mark: "CB",
  },
  {
    name: "Ledger Affiliate",
    href: "https://affiliate.ledger.com/",
    desc: "Strong fit for TokenSentry because the site already leans into security and self-custody messaging.",
    accent: "from-emerald-300/20 to-white/5 border-emerald-300/25",
    mark: "L",
  },
  {
    name: "Awin Publishers",
    href: "https://www.awin.com/us/publishers",
    desc: "Good umbrella network if you want to test broader finance, software, or security affiliate partners.",
    accent: "from-orange-400/20 to-rose-400/10 border-orange-300/25",
    mark: "A",
  },
];

export default function ReportLandingPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-10 md:px-10 md:py-12">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/70">Run a report</p>
        <h1 className="mt-3 text-[2.1rem] font-extrabold leading-tight text-white md:text-[3rem]">
          Paste a token and get the risk report immediately
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-slate-300 md:text-base">
          This page is focused on one job: getting you from token name or address to the full TokenSentry
          report as fast as possible.
        </p>
        <div className="mt-8">
          <InputForm />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,360px)]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">What happens next</p>
          <h2 className="mt-2 text-2xl font-bold text-white">The report opens on its own dedicated page</h2>
          <p className="mt-3 text-sm text-slate-300">
            TokenSentry generates a chain-specific report URL for the token so you can review the evidence, open
            the market chart, and share or export the result cleanly.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {checks.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                <p className="text-sm font-medium text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Revenue options</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Potential partner programs for TokenSentry</h2>
          <p className="mt-3 text-sm text-slate-300">
            These are practical starting points if you want to monetize without turning the site into an ad-heavy
            directory.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br text-sm font-bold text-white ${partner.accent}`}>
                    {partner.mark}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{partner.name}</p>
                    <p className="mt-1 text-slate-400">{partner.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Supported chains</p>
          <h2 className="mt-2 text-2xl font-bold text-white">The scan covers the main chains users actually need</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {supportedChains.map((chain) => (
              <div
                key={chain}
                className="rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-sm text-slate-200"
              >
                {chain}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Quick actions</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Keep the report flow moving</h2>
          <div className="mt-5 space-y-3 text-sm">
            <a
              href="/examples"
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Browse example reports
            </a>
            <a
              href="/methodology"
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Review the scoring methodology
            </a>
            <a
              href="/learn"
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Learn the basics before scanning
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
