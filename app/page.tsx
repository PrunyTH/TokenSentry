import { InputForm } from "@/components/InputForm";
import { HeroMarketPanel } from "@/components/HeroMarketPanel";
import { Card } from "@/components/ui/Card";

const features = [
  {
    label: "Honeypot Detection",
    href: "/methodology#honeypot",
    desc: "Simulates a buy and sell to verify the token can actually be sold. Flags tokens designed to trap buyers in.",
  },
  {
    label: "Liquidity Analysis",
    href: "/methodology#liquidity",
    desc: "Checks total liquidity depth and whether LP tokens are locked — key indicators of rug-pull risk.",
  },
  {
    label: "Contract Risk Scan",
    href: "/methodology#contract",
    desc: "Detects dangerous functions: self-destruct, uncapped mint, transfer freeze, hidden owner, upgradeable proxy.",
  },
  {
    label: "Ownership Checks",
    href: "/methodology#ownership",
    desc: "Flags when a team wallet controls a large share of supply — a common pre-dump warning sign.",
  },
  {
    label: "Holder Concentration",
    href: "/methodology#holders",
    desc: "Identifies tokens where a single whale can crash the price by selling their position at any time.",
  },
  {
    label: "Token Age",
    href: "/methodology#token-age",
    desc: "New tokens carry higher uncertainty. Tokens listed under 3 days ago receive an elevated risk flag.",
  },
  {
    label: "Tax Detection",
    href: "/methodology#tax",
    desc: "Measures buy/sell tax. Taxes above 10% are a medium risk signal; above 25% is flagged as high risk.",
  },
  {
    label: "Multi-Chain",
    href: "/methodology#chains",
    desc: "Covers ETH, BNB, Polygon, Arbitrum, Base, Avalanche, Optimism, and Solana. More coming.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-12 md:px-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-4 lg:items-center">
          <div className="lg:col-span-3">
            <h1 className="text-[2.2rem] font-extrabold leading-tight text-white md:text-[3.2rem] lg:text-[3.8rem]">
              On-Chain Crypto Risk Intelligence
            </h1>
            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Scan any token for honeypots, rug pulls, and smart contract red flags across 8 blockchains, in seconds, for free.
            </p>
            <div className="mt-8">
              <InputForm />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              New to crypto?{" "}
              <a href="/learn" className="text-sky-400 hover:text-sky-300">
                Learn what these checks mean →
              </a>
            </p>
          </div>
          <div className="lg:col-span-1">
            <HeroMarketPanel />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">What We Check</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ label, href, desc }) => (
            <a
              key={label}
              href={href}
              className="group block rounded-2xl border border-slate-700/50 bg-slate-950/85 p-4 transition-colors hover:border-white/20 hover:bg-slate-900/70"
            >
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-sky-300">
                {label}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Score preview + Why TokenSentry */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Live Example Report</p>
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg"
              alt="PEPE"
              width={40}
              height={40}
              className="rounded-full border border-slate-700 flex-shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white">PEPE <span className="text-sm font-normal text-slate-400">· Ethereum</span></h2>
              <p className="text-xs text-slate-500 font-mono">0x6982...1933</p>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
              <span className="rounded-full border border-emerald-500/50 bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-200">
                Low Risk
              </span>
              <p className="mt-1 text-2xl font-extrabold text-white">14 pts</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Honeypot", value: "Clear", ok: true },
              { label: "Mint Function", value: "Disabled", ok: true },
              { label: "LP Locked", value: "100%", ok: true },
              { label: "Owner Holds", value: "~0%", ok: true },
              { label: "Liquidity", value: "$12.4M", ok: true },
              { label: "Holder Count", value: "218,000+", ok: true },
              { label: "Contract", value: "Verified", ok: true },
              { label: "Token Age", value: "690 days", ok: true },
            ].map(({ label, value, ok }) => (
              <div key={label} className="rounded-lg border border-slate-700/60 bg-slate-900/60 p-2.5">
                <p className="text-slate-400">{label}</p>
                <p className={`mt-0.5 font-semibold ${ok === true ? "text-emerald-300" : ok === false ? "text-red-300" : "text-amber-200"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Static snapshot for illustration. <a href="/methodology#scoring" className="hover:text-slate-300">How scores are calculated →</a>
          </p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Why TokenSentry</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Security-First, Evidence-Driven</h2>
          <p className="mt-3 text-sm text-slate-300">
            TokenSentry runs 15+ automated checks on every token and shows you the evidence behind every score — no black boxes,
            no guesswork. Each flag includes a plain-language explanation of what it means and why it matters.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {[
              "Free — no account, no API key needed",
              "8 blockchains: ETH, BNB, Polygon, Arbitrum, Base, Avalanche, Optimism, Solana",
              "Powered by GoPlus, Honeypot.is, DexScreener, and RugCheck",
              "Score capped at 100 — every point is explained",
              "Transparent methodology — verify every check yourself",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 text-sky-400">›</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3 text-sm">
            <a href="/methodology" className="rounded-lg border border-slate-600 px-3 py-1.5 text-slate-300 transition-colors hover:border-white hover:text-white">
              Read Methodology
            </a>
            <a href="/learn" className="rounded-lg border border-sky-700/50 bg-sky-900/20 px-3 py-1.5 text-sky-300 transition-colors hover:bg-sky-900/40">
              Learn the Basics
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
