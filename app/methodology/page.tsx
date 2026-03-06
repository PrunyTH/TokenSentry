import { Card } from "@/components/ui/Card";

export default function MethodologyPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-white">Methodology</h1>
      <Card className="space-y-3 text-slate-300">
        <p>TokenSentry scores risk using transparent heuristic rules and explicit evidence.</p>
        <h2 className="text-xl font-semibold text-white">Ethereum</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Contract not verified on Etherscan: +25</li>
          <li>Honeypot sell-failure indicator: +40</li>
        </ul>
        <h2 className="text-xl font-semibold text-white">Solana</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>RugCheck danger flags: +40</li>
          <li>RugCheck warning flags: +20</li>
        </ul>
        <p>
          Missing data does not automatically imply high risk. It is surfaced as a limited-data note in each report.
        </p>
      </Card>
    </div>
  );
}
