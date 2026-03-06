import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-white">About TokenSentry</h1>
      <Card className="space-y-3">
        <p className="text-slate-300">
          TokenSentry is a crypto security intelligence platform focused on transparent token-risk analysis for Ethereum and Solana.
        </p>
        <p className="text-slate-300">
          The product is built as a practical low-cost MVP with public data sources, aggressive caching, and graceful fallback behavior when upstream APIs are limited.
        </p>
      </Card>
    </div>
  );
}
