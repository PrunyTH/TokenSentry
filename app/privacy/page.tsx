import { Card } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-white">Privacy</h1>
      <Card className="space-y-3 text-slate-300">
        <p>TokenSentry does not require user accounts and does not collect personal profile information.</p>
        <p>
          Basic request metadata (such as IP-derived rate-limit counters) may be processed to protect service stability.
        </p>
        <p>
          Third-party services (CoinGecko, Etherscan, RugCheck, Honeypot) are queried server-side for report generation.
        </p>
      </Card>
    </div>
  );
}
