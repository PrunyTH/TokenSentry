import { Card } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated March 2026</p>
      </div>

      <Card className="space-y-4 text-slate-300">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">No User Accounts</h2>
          <p className="text-sm">
            TokenSentry does not require user accounts and does not collect personal profile information.
            You can use the full service anonymously.
          </p>
        </section>

        <div className="border-t border-slate-700/40" />

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">Request Metadata</h2>
          <p className="text-sm">
            Basic request metadata — such as IP-derived rate-limit counters — may be processed
            temporarily to protect service stability. This data is not stored beyond the rate-limit
            window and is never sold or shared.
          </p>
        </section>

        <div className="border-t border-slate-700/40" />

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">Third-Party Services</h2>
          <p className="text-sm">
            The following third-party services are queried server-side when generating reports.
            No user data is forwarded to them; only token addresses or identifiers are transmitted.
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {["CoinGecko (prices)", "Etherscan (contract data)", "RugCheck (Solana flags)", "Honeypot.is (sell simulation)"].map((s) => (
              <li key={s} className="flex items-start gap-2">
                <span className="mt-0.5 text-amber-400">›</span>{s}
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-slate-700/40" />

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">Contact</h2>
          <p className="text-sm">
            Privacy questions: <a href="mailto:contact@tokensentry.co">contact@tokensentry.co</a>
          </p>
        </section>
      </Card>
    </div>
  );
}
