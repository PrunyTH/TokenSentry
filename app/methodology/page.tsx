import { Card } from "@/components/ui/Card";

const ethRules = [
  { flag: "Contract not verified on Etherscan", score: "+25" },
  { flag: "Honeypot sell-failure indicator", score: "+40" },
];

const solRules = [
  { flag: "RugCheck danger flags", score: "+40 each" },
  { flag: "RugCheck warning flags", score: "+20 each" },
];

const riskLevels = [
  { range: "0 – 24", label: "Low Risk", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/30" },
  { range: "25 – 49", label: "Medium Risk", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/30" },
  { range: "50 – 74", label: "High Risk", color: "text-orange-300", bg: "bg-orange-500/10 border-orange-500/30" },
  { range: "75 – 100", label: "Critical Risk", color: "text-red-300", bg: "bg-red-500/10 border-red-500/30" },
];

export default function MethodologyPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Methodology</h1>
        <p className="mt-2 text-sm text-slate-400">How TokenSentry calculates risk scores</p>
      </div>

      <Card className="space-y-3">
        <p className="text-slate-300">
          TokenSentry scores risk using transparent heuristic rules and explicit evidence.
          Missing data does not automatically imply high risk — it is surfaced as a
          limited-data note in each report.
        </p>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Risk Score Scale</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {riskLevels.map(({ range, label, color, bg }) => (
            <div key={range} className={`rounded-xl border px-4 py-3 ${bg}`}>
              <p className={`text-sm font-bold ${color}`}>{label}</p>
              <p className="mt-0.5 text-xs text-slate-400">Score {range}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Ethereum Rules</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-4 font-medium">Flag</th>
              <th className="pb-2 font-medium text-right">Score Added</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {ethRules.map(({ flag, score }) => (
              <tr key={flag} className="border-b border-slate-800/50">
                <td className="py-2 pr-4">{flag}</td>
                <td className="py-2 text-right font-semibold text-red-300">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Solana Rules</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-4 font-medium">Flag</th>
              <th className="pb-2 font-medium text-right">Score Added</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {solRules.map(({ flag, score }) => (
              <tr key={flag} className="border-b border-slate-800/50">
                <td className="py-2 pr-4">{flag}</td>
                <td className="py-2 text-right font-semibold text-red-300">{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-white">Data Sources</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            { name: "Etherscan", use: "Contract verification, ABI" },
            { name: "Honeypot.is", use: "Honeypot sell simulation" },
            { name: "RugCheck", use: "Solana token risk flags" },
            { name: "CoinGecko", use: "Market prices" },
          ].map(({ name, use }) => (
            <li key={name} className="flex items-center justify-between">
              <span className="font-medium text-amber-200">{name}</span>
              <span className="text-slate-400">{use}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
