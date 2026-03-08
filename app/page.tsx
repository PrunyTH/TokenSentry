import { InputForm } from "@/components/InputForm";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative rounded-3xl border border-amber-200/20 bg-black/20 px-5 py-10">
        <h1 className="text-[2rem] font-extrabold leading-tight text-white md:text-[3.2rem]">
          On-Chain Crypto Risk Intelligence
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-200 md:text-lg">
          Instant on-chain risk analysis for crypto tokens. Scan contracts for
          honeypot behavior, liquidity risks, ownership traps, and smart contract
          red flags in seconds.
        </p>
        <div className="mt-8">
          <InputForm />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["Honeypot Detection", "Liquidity Analysis", "Contract Risk Scan", "Ownership Checks"].map((f) => (
          <Card key={f} className="p-4">
            <p className="text-sm font-semibold text-amber-200">{f}</p>
            <p className="mt-1 text-sm text-slate-400">
              Automated checks with transparent evidence and clear risk signals.
            </p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Results Preview</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Token Risk Score</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full border border-red-500/50 bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-200">
              High Risk
            </span>
            <span className="text-3xl font-extrabold text-white">78 / 100</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/70 p-3">
              <p className="text-slate-400">Liquidity Locked</p>
              <p className="mt-1 font-semibold text-amber-200">Partial</p>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/70 p-3">
              <p className="text-slate-400">Mint Function</p>
              <p className="mt-1 font-semibold text-red-300">Enabled</p>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/70 p-3">
              <p className="text-slate-400">Owner Privileges</p>
              <p className="mt-1 font-semibold text-red-300">Active</p>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/70 p-3">
              <p className="text-slate-400">Contract Verified</p>
              <p className="mt-1 font-semibold text-emerald-300">Yes</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Why TokenSentry</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Security-First, Evidence-Driven
          </h2>
          <p className="mt-3 text-slate-300">
            TokenSentry scans smart contracts and on-chain behavior to detect risks
            before you invest. Every score is backed by visible evidence so users can
            verify findings instead of relying on black-box signals.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>Rug pull exposure and holder concentration signals</li>
            <li>Honeypot and sell restriction indicators</li>
            <li>Ownership, mint, and contract control risk checks</li>
            <li>Cross-chain support with transparent methodology</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
