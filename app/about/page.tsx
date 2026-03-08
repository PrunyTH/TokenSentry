import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About TokenSentry",
  description: "TokenSentry is a free, transparent crypto token risk intelligence platform covering 8 blockchains.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">About TokenSentry</h1>
        <p className="mt-2 text-sm text-slate-400">Transparent on-chain risk intelligence — free, open, evidence-driven.</p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Mission</h2>
        <p className="text-sm text-slate-300">
          TokenSentry exists to make crypto safer for everyone — especially people who are new to the space and
          lack the technical knowledge to read a smart contract or interpret on-chain data.
        </p>
        <p className="text-sm text-slate-300">
          Every day, thousands of people lose money to honeypots, rug pulls, and scam tokens that could have
          been identified before investment with the right tools. TokenSentry provides those tools for free,
          with no account required and no hidden agenda.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">What Makes TokenSentry Different</h2>
        <ul className="space-y-3 text-sm text-slate-300">
          {[
            {
              label: "Transparent scoring",
              desc: "Every point in a risk score is explained. You can see exactly which checks contributed and why — no black boxes.",
            },
            {
              label: "Multi-chain from day one",
              desc: "8 blockchains supported: Ethereum, BNB Chain, Polygon, Arbitrum, Base, Avalanche, Optimism, and Solana.",
            },
            {
              label: "15+ checks per token",
              desc: "Honeypot simulation, contract function analysis, ownership concentration, liquidity lock status, holder distribution, token age, and more.",
            },
            {
              label: "Always free",
              desc: "No paid tier, no API key required, no account needed. TokenSentry is built on free public data sources.",
            },
            {
              label: "Educational by design",
              desc: "Every flag includes a plain-language explanation. The goal is to help users understand risk, not just receive a number.",
            },
          ].map(({ label, desc }) => (
            <li key={label} className="flex items-start gap-3 rounded-lg border border-slate-700/40 p-3">
              <span className="mt-0.5 text-sky-400">{"›"}</span>
              <div>
                <p className="font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-slate-400">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Blockchains Supported", value: "8" },
          { label: "Checks Per Report", value: "15+" },
          { label: "API Keys Required", value: "None" },
        ].map(({ label, value }) => (
          <Card key={label} className="text-center">
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Data Sources</h2>
        <div className="grid gap-2 sm:grid-cols-2 text-sm">
          {[
            { name: "Honeypot.is", use: "Sell simulation & tax detection" },
            { name: "GoPlus Security", use: "Contract flags & holder data" },
            { name: "DexScreener", use: "Liquidity depth & token age" },
            { name: "RugCheck", use: "Solana risk flags" },
            { name: "Etherscan", use: "ETH contract verification" },
            { name: "CoinGecko", use: "Token search & address lookup" },
          ].map(({ name, use }) => (
            <div key={name} className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
              <p className="font-semibold text-white">{name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{use}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-white">What We Check</h2>
        <ul className="space-y-1.5 text-sm text-slate-300">
          {[
            "Honeypot detection — simulated buy/sell against the actual contract",
            "Contract verification status (Ethereum)",
            "Dangerous contract functions: mint, pause, self-destruct, hidden owner, proxy upgrade",
            "Buy and sell tax percentages",
            "Team/creator wallet holdings as % of total supply",
            "Whale concentration — largest single wallet % of supply",
            "Top-5 holder concentration",
            "Total holder count",
            "Liquidity USD depth",
            "LP (liquidity provider) token lock status and coverage",
            "Token listing age",
            "RugCheck danger and warning flags (Solana)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 text-sky-400">{"›"}</span>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Disclaimer</h2>
        <p className="text-sm text-slate-300">
          TokenSentry is an educational and security research tool. Risk scores are automated heuristic assessments
          and are not financial advice. A low score does not guarantee safety, and a high score does not make recovery
          impossible. Always verify on-chain data independently and conduct your own research before investing.
        </p>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p className="text-sm text-slate-300">
          Questions, feedback, or partnership enquiries:{" "}
          <a href="mailto:contact@tokensentry.co">contact@tokensentry.co</a>
        </p>
        <p className="text-sm text-slate-300">
          Follow us on{" "}
          <a href="https://x.com/TokenSentry" target="_blank" rel="noreferrer">X / Twitter</a>{" "}
          for updates and risk alerts.
        </p>
      </Card>
    </div>
  );
}
