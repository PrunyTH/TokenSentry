import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | TokenSentry",
  description: "How TokenSentry calculates token risk scores — transparent heuristics, evidence-backed checks, and scoring explained.",
};

const riskLevels = [
  { range: "0 – 33",  label: "Low Risk",     color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/30",  desc: "No major red flags detected. Always verify independently before investing." },
  { range: "34 – 66", label: "Medium Risk",   color: "text-amber-300",   bg: "bg-amber-500/10 border-amber-500/30",     desc: "One or more concerning signals. Use caution and research further." },
  { range: "67 – 99", label: "High Risk",     color: "text-red-300",     bg: "bg-red-500/10 border-red-500/30",         desc: "Multiple serious red flags. High probability of rug pull, honeypot, or scam." },
  { range: "100 +",   label: "Extreme Risk",  color: "text-fuchsia-300", bg: "bg-fuchsia-500/10 border-fuchsia-500/40", desc: "Extreme danger — token exhibits hallmarks of a confirmed scam or active rug pull." },
];

const allChecks = [
  { flag: "Contract source not verified", points: "+25", severity: "high", chain: "ETH" },
  { flag: "Honeypot — sell failure detected", points: "+40", severity: "high", chain: "All EVM" },
  { flag: "Sell tax > 25%", points: "+30", severity: "high", chain: "All EVM" },
  { flag: "Sell tax 10-25%", points: "+15", severity: "medium", chain: "All EVM" },
  { flag: "Buy tax > 25%", points: "+20", severity: "high", chain: "All EVM" },
  { flag: "Buy tax 10-25%", points: "+10", severity: "medium", chain: "All EVM" },
  { flag: "Owner can mint unlimited tokens", points: "+40", severity: "high", chain: "All EVM" },
  { flag: "Hidden owner detected", points: "+50", severity: "high", chain: "All EVM" },
  { flag: "Contract can reclaim ownership", points: "+45", severity: "high", chain: "All EVM" },
  { flag: "Transfers can be frozen by owner", points: "+35", severity: "high", chain: "All EVM" },
  { flag: "Self-destruct code present", points: "+45", severity: "high", chain: "All EVM" },
  { flag: "Upgradeable proxy contract", points: "+15", severity: "medium", chain: "All EVM" },
  { flag: "Team wallet holds > 30% supply", points: "+30", severity: "high", chain: "All EVM" },
  { flag: "Team wallet holds 10-30% supply", points: "+12", severity: "medium", chain: "All EVM" },
  { flag: "Single whale > 50% of supply", points: "+35", severity: "high", chain: "All EVM" },
  { flag: "Single whale > 20% of supply", points: "+18", severity: "medium", chain: "All EVM" },
  { flag: "Top 5 wallets > 80% of supply", points: "+20", severity: "medium", chain: "All EVM" },
  { flag: "Fewer than 50 total holders", points: "+20", severity: "medium", chain: "All EVM" },
  { flag: "50-200 total holders", points: "+10", severity: "low", chain: "All EVM" },
  { flag: "Liquidity not locked", points: "+30", severity: "high", chain: "All EVM" },
  { flag: "Less than 50% of liquidity locked", points: "+12", severity: "medium", chain: "All EVM" },
  { flag: "Liquidity less than $10k", points: "+25", severity: "high", chain: "All chains" },
  { flag: "Liquidity $10k-$50k", points: "+15", severity: "medium", chain: "All chains" },
  { flag: "Token listed less than 3 days ago", points: "+10", severity: "medium", chain: "All chains" },
  { flag: "Token listed 3-30 days ago", points: "+5", severity: "low", chain: "All chains" },
  { flag: "RugCheck danger flags", points: "+40 each", severity: "high", chain: "Solana" },
  { flag: "RugCheck warning flags", points: "+20 each", severity: "medium", chain: "Solana" },
  { flag: "Largest holder > 50% (Solana)", points: "+35", severity: "high", chain: "Solana" },
  { flag: "Largest holder > 20% (Solana)", points: "+18", severity: "medium", chain: "Solana" },
];

function SeverityDot({ s }: { s: string }) {
  const color = s === "high" ? "bg-red-400" : s === "medium" ? "bg-amber-400" : "bg-emerald-400";
  return <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${color}`} />;
}

export default function MethodologyPage() {
  return (
    <div className="w-full space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Methodology</h1>
        <p className="mt-2 text-sm text-slate-400">How TokenSentry calculates risk scores — transparent, auditable, evidence-backed.</p>
      </div>

      <Card className="space-y-3" id="overview">
        <p className="text-slate-300">
          TokenSentry scores risk using a transparent point-accumulation system. Every flag adds a fixed number of points
          to the score. The final score is clamped between <strong className="text-white">0</strong> and{" "}
          <strong className="text-white">100</strong>. No check is hidden — you can see every contributing factor
          directly in each report.
        </p>
        <p className="text-slate-300">
          Missing data does not automatically raise the score — it is surfaced as a data-quality note.
          A low score with limited data is less reliable than a low score with full coverage.
        </p>
      </Card>

      <Card id="scoring" className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Risk Score Scale</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {riskLevels.map(({ range, label, color, bg, desc }) => (
            <div key={range} className={`rounded-xl border p-4 ${bg}`}>
              <p className={`text-base font-bold ${color}`}>{label}</p>
              <p className="mt-0.5 text-xs text-slate-400">Score {range}</p>
              <p className="mt-2 text-xs text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">How the score is calculated</p>
          <p className="mt-1">
            Each detected flag adds its point value to a running total, clamped to 100.
            Example: mint function (+40) + no locked liquidity (+30) + whale holder (+35) = 105 points,
            capped at <strong className="text-white">100 (High Risk)</strong>.
            Passing checks add 0 points but appear as positive evidence in the report.
          </p>
        </div>
      </Card>

      <Card className="space-y-4" id="checks">
        <h2 className="text-xl font-semibold text-white">All Checks and Point Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-4 font-medium">Flag</th>
                <th className="pb-2 pr-4 font-medium">Chain</th>
                <th className="pb-2 font-medium text-right">Points</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {allChecks.map(({ flag, points, severity, chain }) => (
                <tr key={flag} className="border-b border-slate-800/40">
                  <td className="py-1.5 pr-4">
                    <SeverityDot s={severity} />
                    {flag}
                  </td>
                  <td className="py-1.5 pr-4 text-xs text-slate-500">{chain}</td>
                  <td className="py-1.5 text-right font-semibold text-red-300">{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500">
          <SeverityDot s="high" />High <SeverityDot s="medium" />Medium <SeverityDot s="low" />Low
        </p>
      </Card>

      <section id="honeypot" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Honeypot Detection</h2>
          <p className="text-sm text-slate-300">
            A honeypot is a token where you can buy but cannot sell. The contract includes hidden code that blocks
            the sell transaction or routes it to fail. This is one of the most common crypto scams.
          </p>
          <p className="text-sm text-slate-300">
            TokenSentry uses <strong className="text-white">Honeypot.is</strong> to simulate both a buy and sell
            against the real contract. If the sell fails, the token is flagged (+40 points).
            High taxes detected during simulation are also flagged separately.
          </p>
          <p className="text-xs text-slate-500">Source: honeypot.is — free, no API key. Covers all 7 EVM chains.</p>
        </Card>
      </section>

      <section id="contract" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Contract Risk Scan</h2>
          <p className="text-sm text-slate-300">
            Smart contracts can contain functions giving creators dangerous levels of control.
            TokenSentry checks these via the GoPlus Security API:
          </p>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Uncapped mint (+40)", desc: "Owner can create unlimited tokens at any time, diluting all existing holders." },
              { label: "Hidden owner (+50)", desc: "True owner is concealed. They can act as admin without public accountability." },
              { label: "Ownership reclaim (+45)", desc: "Even after apparent renouncement, a function exists to restore admin control." },
              { label: "Transfer pause (+35)", desc: "Owner can freeze all transfers, locking everyone out of selling." },
              { label: "Self-destruct (+45)", desc: "A function exists to destroy the contract, potentially wiping out liquidity." },
              { label: "Upgradeable proxy (+15)", desc: "Logic can be silently replaced — enabling future backdoors." },
              { label: "Unverified source (+25, ETH only)", desc: "Code not published on Etherscan — cannot be independently audited." },
            ].map(({ label, desc }) => (
              <li key={label} className="rounded-lg border border-slate-700/40 p-3">
                <p className="font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-slate-400">{desc}</p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">Source: GoPlus Security API — free, no key. Covers all 7 EVM chains.</p>
        </Card>
      </section>

      <section id="tax" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Tax Detection</h2>
          <p className="text-sm text-slate-300">
            High taxes make tokens unprofitable to sell and can be raised to 100% by the owner at any time,
            effectively converting a taxed token into a honeypot. TokenSentry flags taxes above 10%.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              { label: "Sell tax 10-25%", pts: "+15 pts", color: "text-amber-300" },
              { label: "Sell tax over 25%", pts: "+30 pts", color: "text-red-300" },
              { label: "Buy tax 10-25%", pts: "+10 pts", color: "text-amber-300" },
              { label: "Buy tax over 25%", pts: "+20 pts", color: "text-red-300" },
            ].map(({ label, pts, color }) => (
              <div key={label} className="flex justify-between rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
                <span className="text-slate-300">{label}</span>
                <span className={`font-semibold ${color}`}>{pts}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Source: Honeypot.is simulation result.</p>
        </Card>
      </section>

      <section id="ownership" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Ownership and Team Holdings</h2>
          <p className="text-sm text-slate-300">
            When a project team retains a large percentage of supply, they can dump their holdings at any time
            and instantly crash the price. This requires no malicious contract code and is one of the most
            common rug pull vectors.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">{"›"}</span>
              Team holds 10-30%: <span className="ml-1 text-amber-300">+12 pts (Medium)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-400">{"›"}</span>
              Team holds more than 30%: <span className="ml-1 text-red-300">+30 pts (High)</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500">Source: GoPlus owner_percent and creator_percent fields.</p>
        </Card>
      </section>

      <section id="holders" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Holder Concentration</h2>
          <p className="text-sm text-slate-300">
            A token dominated by a single wallet or small group is highly vulnerable to price manipulation.
            TokenSentry filters out known DEX liquidity pool addresses before analysing wallets,
            focusing on real wallet holders only.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">{"›"}</span>
              Largest wallet 20-50%: <span className="ml-1 text-amber-300">+18 pts (Medium)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-red-400">{"›"}</span>
              Largest wallet more than 50%: <span className="ml-1 text-red-300">+35 pts (High)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">{"›"}</span>
              Top 5 wallets more than 80% of supply: <span className="ml-1 text-amber-300">+20 pts (Medium)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">{"›"}</span>
              Fewer than 50 total holders: <span className="ml-1 text-amber-300">+20 pts (Medium)</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500">Source: GoPlus holder list (EVM). RugCheck top holders (Solana).</p>
        </Card>
      </section>

      <section id="liquidity" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Liquidity Analysis</h2>
          <p className="text-sm text-slate-300">
            Liquidity is the value of assets available to trade against on a decentralised exchange (DEX).
            Low liquidity means high slippage and makes exiting a position very difficult.
            LP lock status is equally important — if LP tokens are unlocked, the team can drain the pool
            instantly in what is called a rug pull.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              { label: "Liquidity below $10k", pts: "+25 pts (High)", color: "text-red-300" },
              { label: "Liquidity $10k to $50k", pts: "+15 pts (Medium)", color: "text-amber-300" },
              { label: "LP not locked", pts: "+30 pts (High)", color: "text-red-300" },
              { label: "LP less than 50% locked", pts: "+12 pts (Medium)", color: "text-amber-300" },
            ].map(({ label, pts, color }) => (
              <div key={label} className="flex justify-between gap-2 rounded-lg border border-slate-700/40 bg-slate-900/40 p-3">
                <span className="text-slate-300">{label}</span>
                <span className={`text-right text-xs font-semibold ${color}`}>{pts}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">Sources: DexScreener (liquidity depth); GoPlus (LP lock status).</p>
        </Card>
      </section>

      <section id="token-age" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Token Age</h2>
          <p className="text-sm text-slate-300">
            Brand-new tokens have limited on-chain history to assess. Scam tokens are typically launched, drained,
            and abandoned within days. Token age is a risk amplifier, not proof of a scam.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-400">{"›"}</span>
              Listed less than 3 days ago: <span className="ml-1 text-amber-300">+10 pts (Medium)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-slate-400">{"›"}</span>
              Listed 3 to 30 days ago: <span className="ml-1 text-slate-300">+5 pts (Low)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-400">{"›"}</span>
              Listed more than 30 days ago: <span className="ml-1 text-emerald-300">0 pts</span>
            </li>
          </ul>
          <p className="text-xs text-slate-500">Source: DexScreener pair creation timestamp (earliest listing found).</p>
        </Card>
      </section>

      <section id="chains" className="scroll-mt-6">
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold text-white">Supported Chains</h2>
          <div className="grid gap-2 sm:grid-cols-2 text-sm">
            {[
              { chain: "Ethereum (ETH)", checks: "Etherscan + Honeypot.is + GoPlus + DexScreener" },
              { chain: "BNB Chain", checks: "Honeypot.is + GoPlus + DexScreener" },
              { chain: "Polygon", checks: "Honeypot.is + GoPlus + DexScreener" },
              { chain: "Arbitrum", checks: "Honeypot.is + GoPlus + DexScreener" },
              { chain: "Base", checks: "Honeypot.is + GoPlus + DexScreener" },
              { chain: "Avalanche", checks: "Honeypot.is + GoPlus + DexScreener" },
              { chain: "Optimism", checks: "Honeypot.is + GoPlus + DexScreener" },
              { chain: "Solana", checks: "RugCheck + DexScreener" },
            ].map(({ chain, checks }) => (
              <div key={chain} className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
                <p className="font-semibold text-white">{chain}</p>
                <p className="mt-0.5 text-xs text-slate-400">{checks}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card id="sources">
        <h2 className="mb-4 text-xl font-semibold text-white">Data Sources</h2>
        <ul className="space-y-3 text-sm">
          {[
            { name: "Honeypot.is", url: "https://honeypot.is", use: "Buy/sell simulation — detects honeypots and measures tax rates for all EVM chains. Free, no key required." },
            { name: "GoPlus Security", url: "https://gopluslabs.io", use: "Contract security analysis — 10+ checks including mint, hidden owner, LP lock, and holder concentration. Free, no key." },
            { name: "DexScreener", url: "https://dexscreener.com", use: "DEX market data — liquidity depth and pair listing age. Free, no key required." },
            { name: "RugCheck", url: "https://rugcheck.xyz", use: "Solana-specific danger and warning flag analysis. Free, no key required." },
            { name: "Etherscan", url: "https://etherscan.io", use: "Ethereum contract verification and source code. Optional free API key; degrades gracefully without." },
            { name: "CoinGecko", url: "https://coingecko.com", use: "Token name/symbol lookup and multi-chain address resolution. Free, no key required." },
          ].map(({ name, url, use }) => (
            <li key={name} className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
              <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-sky-300 hover:text-sky-200">{name}</a>
              <p className="mt-0.5 text-slate-400">{use}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="text-sm text-slate-400">
        <p className="font-semibold text-white">Disclaimer</p>
        <p className="mt-1">
          TokenSentry provides automated heuristic analysis for educational and security research purposes.
          Scores are not financial advice and do not guarantee safety. Always conduct your own research before investing.
        </p>
      </Card>
    </div>
  );
}
