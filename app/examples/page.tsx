import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token Examples | TokenSentry",
  description: "Real-world examples of safe and dangerous crypto tokens — see how TokenSentry scores them and why.",
};

type RiskLevel = "low" | "medium" | "high" | "extreme";

const riskStyle: Record<RiskLevel, { badge: string; score: string }> = {
  low:     { badge: "border-emerald-500/50 bg-emerald-500/15 text-emerald-200",   score: "text-emerald-300"  },
  medium:  { badge: "border-amber-500/50 bg-amber-500/15 text-amber-200",         score: "text-amber-300"    },
  high:    { badge: "border-red-500/50 bg-red-500/20 text-red-200",               score: "text-red-300"      },
  extreme: { badge: "border-fuchsia-500/60 bg-fuchsia-500/15 text-fuchsia-200",   score: "text-fuchsia-300"  },
};

const examples = [
  {
    name: "Chainlink",
    ticker: "LINK",
    chain: "Ethereum",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
    risk: "low" as RiskLevel,
    score: 6,
    verdict: "Established Infrastructure Token",
    color: "border-emerald-500/20",
    checks: [
      { label: "Honeypot", value: "Clear", ok: true },
      { label: "Mint Function", value: "Disabled", ok: true },
      { label: "LP Locked", value: "N/A – CEX listed", ok: true },
      { label: "Contract", value: "Verified", ok: true },
      { label: "Liquidity", value: ">$200M", ok: true },
      { label: "Holder Count", value: "700,000+", ok: true },
    ],
    summary: "Chainlink is the industry-standard decentralised oracle network. Its contract has been audited multiple times, the source code is fully verified on Etherscan, minting is disabled, and its market capitalisation places it in the top 20 cryptocurrencies. TokenSentry returns a near-zero risk score — the only residual flag is the token age check, which adds no points for a token this mature.",
    why: null,
  },
  {
    name: "PEPE",
    ticker: "PEPE",
    chain: "Ethereum",
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    logo: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
    risk: "low" as RiskLevel,
    score: 14,
    verdict: "Established Meme Token — Low Structural Risk",
    color: "border-emerald-500/20",
    checks: [
      { label: "Honeypot", value: "Clear", ok: true },
      { label: "Mint Function", value: "Disabled", ok: true },
      { label: "LP Locked", value: "100% burned", ok: true },
      { label: "Owner Holds", value: "~0%", ok: true },
      { label: "Liquidity", value: "$12M+", ok: true },
      { label: "Holder Count", value: "218,000+", ok: true },
    ],
    summary: "PEPE is a meme coin with no intrinsic utility — its value is entirely speculative. However, from a structural safety perspective it scores well: the LP tokens were burned (permanently locked), the contract owner renounced ownership, and the sell function works without restriction. The score of 14 reflects the token's early-stage liquidity relative to its market cap, not any active malicious intent. This example illustrates that low risk score does not mean guaranteed gains — only that the contract itself is not a trap.",
    why: null,
  },
  {
    name: "Conflux",
    ticker: "CFX",
    chain: "Ethereum",
    address: "0x8A2279d4A90B6fe1C4B30fa660cC9f926797bAA2",
    logo: "https://assets.coingecko.com/coins/images/13079/small/3vuYMbjN.png",
    risk: "medium" as RiskLevel,
    score: 38,
    verdict: "Medium Risk — Elevated Team Holdings",
    color: "border-amber-500/20",
    checks: [
      { label: "Honeypot", value: "Clear", ok: true },
      { label: "Mint Function", value: "Controlled", ok: null },
      { label: "LP Status", value: "Partial lock", ok: null },
      { label: "Owner Holds", value: "~18% supply", ok: false },
      { label: "Liquidity", value: "$8M", ok: null },
      { label: "Contract", value: "Verified", ok: true },
    ],
    summary: "This example shows a medium-risk profile: the contract is verified and the token can be freely bought and sold. However, team or foundation wallets hold approximately 18% of the total supply — flagged as a medium-risk signal because a coordinated sell from those wallets could significantly suppress the price. LP coverage is only partial. The token is legitimate but holders are exposed to team sell pressure. Always check whether large holders have a vesting or lock schedule before investing.",
    why: null,
  },
  {
    name: "AnubisDAO",
    ticker: "ANKH",
    chain: "Ethereum",
    address: "0x68b0df17a6e8bf5de70b6d3d66ebcf5614d77568",
    logo: null,
    risk: "extreme" as RiskLevel,
    score: 185,
    verdict: "Extreme Rug Pull — $60M stolen in 20 hours",
    color: "border-fuchsia-500/30",
    checks: [
      { label: "Honeypot",       value: "Detected",           ok: false },
      { label: "Mint Function",  value: "Owner-controlled",   ok: false },
      { label: "LP Locked",      value: "None — drained",     ok: false },
      { label: "Contract",       value: "Hidden owner",       ok: false },
      { label: "Owner Holds",    value: ">99% at launch",     ok: false },
      { label: "Liquidity",      value: "$0 after drain",     ok: false },
    ],
    summary: "AnubisDAO raised approximately $60 million USD worth of ETH in October 2021 under the guise of a dog-themed DeFi project. Within 20 hours of the liquidity event closing, all funds were moved from the liquidity pool to a single wallet by the anonymous deployer. No product was ever delivered. It remains one of the largest single-event rug pulls in DeFi history.",
    why: "Every flag in the TokenSentry model was triggered: the contract contained a hidden owner mechanism, the deployer wallet held virtually all supply at launch, LP tokens were never locked, and the contract was structured to allow instant liquidity removal. The 185-point score places it firmly in the Extreme tier. Key lesson: a high-profile raise and active social media presence do not reduce on-chain risk — the contract tells the real story. Searching by name will not find this token because CoinGecko delisted it after the rug. Paste the contract address directly: 0x68b0df17a6e8bf5de70b6d3d66ebcf5614d77568.",
  },
  {
    name: "SQUID Game Token",
    ticker: "SQUID",
    chain: "BNB Chain",
    address: "0x87230146E138d3F296a9a77e497A2A83012e9Bc5",
    logo: null,
    risk: "extreme" as RiskLevel,
    score: 118,
    verdict: "Confirmed Rug Pull — October 2021",
    color: "border-fuchsia-500/30",
    checks: [
      { label: "Honeypot", value: "Detected", ok: false },
      { label: "Sell Function", value: "Blocked", ok: false },
      { label: "Mint Function", value: "Enabled", ok: false },
      { label: "LP Locked", value: "None", ok: false },
      { label: "Owner Holds", value: ">90% supply", ok: false },
      { label: "Contract", value: "Unverified", ok: false },
    ],
    summary: "SQUID was one of the most publicised crypto scams of 2021, riding the wave of the Netflix series of the same name. It was a textbook honeypot: buyers could purchase tokens freely, but the sell function was secretly disabled in the contract — no one could exit.",
    why: "The price rose from $0.01 to over $2,860 in days as retail investors piled in, unable to sell. On 1 November 2021, the anonymous creators drained the liquidity pool — approximately $3.38 million — in seconds. The price collapsed to $0.0007 in minutes. Every single red flag was present before the collapse: unverified contract, owner-held majority of supply, no LP lock, and a honeypot sell restriction. TokenSentry scores this token at 118 pts — well into the Extreme tier — before the first buyer lost a cent.",
  },
  {
    name: "SafeMoon V1",
    ticker: "SAFEMOON",
    chain: "BNB Chain",
    address: "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3",
    logo: "https://assets.coingecko.com/coins/images/14362/small/174x174-white.png",
    risk: "high" as RiskLevel,
    score: 82,
    verdict: "Fraud — SEC Charges Filed 2023",
    color: "border-red-500/20",
    checks: [
      { label: "Honeypot", value: "Clear (technically)", ok: null },
      { label: "Sell Tax", value: "10% on every sell", ok: false },
      { label: "Mint Function", value: "Enabled", ok: false },
      { label: "Owner Control", value: "Can drain LP", ok: false },
      { label: "Holder Count", value: "2.9M (peak)", ok: null },
      { label: "Contract", value: "Verified", ok: true },
    ],
    summary: "SafeMoon illustrates a more sophisticated scam. Technically not a honeypot — users could sell — but every sell carried a 10% tax, which was used to 'reward' holders and fund the LP. The real danger was hidden in plain sight: the contract contained a function allowing the owner to remove liquidity at will.",
    why: "In 2021 SafeMoon attracted millions of retail investors through aggressive social media marketing and celebrity endorsements. In 2023 the US SEC and DOJ filed fraud charges against the founders, alleging they had misappropriated over $200 million from the LP and investor funds. The mint function allowed dilution at any time. The sell tax created artificial buy pressure while making exits costly. Key lesson: a passing honeypot check is not enough — owner-controlled LP and mint functions are red flags regardless of whether sells are technically possible.",
  },
];

export default function ExamplesPage() {
  return (
    <div className="w-full space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Token Examples</h1>
        <p className="mt-2 text-sm text-slate-400">
          Real tokens scored by TokenSentry — from clean infrastructure to confirmed rug pulls. See what the checks reveal.
        </p>
      </div>

      <Card className="space-y-3">
        <p className="text-sm text-slate-300">
          These examples are drawn from real tokens across Ethereum and BNB Chain. The scores shown reflect
          the TokenSentry heuristic model applied to historical data. For the fraud cases, all red flags
          were detectable before the collapse — this is exactly the kind of analysis TokenSentry automates for any token you paste.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Low Risk",          cls: "border-emerald-700/50 text-emerald-300 bg-emerald-950/30" },
            { label: "Medium Risk",       cls: "border-amber-700/50 text-amber-300 bg-amber-950/30" },
            { label: "High Risk / Scam",  cls: "border-red-700/50 text-red-300 bg-red-950/30" },
            { label: "Extreme Risk",      cls: "border-fuchsia-700/60 text-fuchsia-300 bg-fuchsia-950/30" },
          ].map(({ label, cls }) => (
            <span key={label} className={`rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {examples.map((ex) => {
          const style = riskStyle[ex.risk];
          const riskLabel =
            ex.risk === "low"     ? "Low Risk"
            : ex.risk === "medium"  ? "Medium Risk"
            : ex.risk === "high"    ? "High Risk"
            : "Extreme Risk";
          return (
            <Card key={ex.ticker} className={`space-y-4 border-2 ${ex.color}`}>
              {/* Header */}
              <div className="flex items-center gap-4">
                {ex.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ex.logo} alt={ex.name} width={44} height={44} className="rounded-full border border-slate-700 flex-shrink-0" />
                ) : (
                  <div className="h-11 w-11 flex-shrink-0 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-bold">
                    {ex.ticker.slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{ex.name}</h2>
                    <span className="text-sm text-slate-400">{ex.ticker}</span>
                    <span className="rounded-full border border-slate-700/50 bg-slate-900/50 px-2 py-0.5 text-xs text-slate-400">{ex.chain}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-mono text-slate-500">{ex.address}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${style.badge}`}>
                    {riskLabel}
                  </span>
                  <p className={`mt-1 text-2xl font-extrabold ${style.score}`}>{ex.score} pts</p>
                </div>
              </div>

              {/* Verdict */}
              <p className="text-sm font-semibold text-slate-200">{ex.verdict}</p>

              {/* Check grid */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {ex.checks.map(({ label, value, ok }) => (
                  <div key={label} className="rounded-lg border border-slate-700/60 bg-slate-900/60 p-2.5">
                    <p className="text-slate-400">{label}</p>
                    <p className={`mt-0.5 font-semibold ${ok === true ? "text-emerald-300" : ok === false ? "text-red-300" : "text-amber-200"}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 border-t border-slate-700/40 pt-3 text-sm text-slate-300">
                <p>{ex.summary}</p>
                {ex.why && (
                  <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-400">What Happened</p>
                    <p className="text-slate-300">{ex.why}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="space-y-2 text-sm text-slate-400">
        <p className="font-semibold text-white">Disclaimer</p>
        <p>
          Examples are for educational purposes only. Historical data may differ from live contract state.
          Scores shown are illustrative reconstructions based on the TokenSentry heuristic model applied to
          known public data. This is not financial advice. Always run a live scan and conduct your own research before investing.
        </p>
        <p className="mt-2">
          <a href="/methodology" className="text-sky-300 hover:text-sky-200">Read the full methodology →</a>
        </p>
      </Card>
    </div>
  );
}
