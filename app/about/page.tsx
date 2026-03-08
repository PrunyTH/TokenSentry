import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">About TokenSentry</h1>
        <p className="mt-2 text-sm text-slate-400">Transparent on-chain risk intelligence for crypto investors</p>
      </div>

      <Card className="space-y-4">
        <p className="text-slate-300">
          TokenSentry is a crypto security intelligence platform focused on transparent token-risk
          analysis for Ethereum and Solana. Every score is backed by visible evidence so users can
          verify findings instead of relying on black-box signals.
        </p>
        <p className="text-slate-300">
          The platform is built with public data sources, aggressive caching, and graceful fallback
          behaviour when upstream APIs are limited — designed to be fast and reliable at low cost.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Chains Supported", value: "Ethereum · Solana" },
          { label: "Data Sources", value: "Etherscan, RugCheck, CoinGecko" },
          { label: "No Account Required", value: "Fully anonymous" },
        ].map(({ label, value }) => (
          <Card key={label} className="text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-semibold text-amber-200">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-white">What We Check</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            "Honeypot and sell-restriction indicators",
            "Smart contract verification status",
            "Mint function and owner privilege exposure",
            "Liquidity lock status and depth",
            "Holder concentration and rug-pull signals",
            "RugCheck danger and warning flags (Solana)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">›</span>
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p className="text-sm text-slate-300">
          Questions or feedback?{" "}
          <a href="mailto:contact@tokensentry.co">contact@tokensentry.co</a>
        </p>
      </Card>
    </div>
  );
}
