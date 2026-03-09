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
        <div className="mt-8 max-w-4xl">
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
          <p className="text-xs uppercase tracking-wide text-slate-400">Direct links</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Use this page as the main scan entrypoint</h2>
          <p className="mt-3 text-sm text-slate-300">
            Good for ads, social links, and homepage call-to-action buttons where you want users to land directly
            on the analyzer.
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <a
              href="/"
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Back to homepage
            </a>
            <a
              href="/methodology"
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              Review methodology
            </a>
            <a
              href="/examples"
              className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white"
            >
              See example reports
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
