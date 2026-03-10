import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Pricing and Credits | TokenSentry",
  description:
    "Internal pricing draft for TokenSentry continuous monitoring, credit usage, cancellation, payments, and monitoring stack design.",
  robots: {
    index: false,
    follow: false,
  },
};

const tiers = [
  {
    name: "Starter",
    price: "$19",
    credits: "250 credits",
    fit: "For a small watchlist with slower checks.",
    examples: ["3-5 watched tokens", "15 min cadence", "Email delivery"],
  },
  {
    name: "Active",
    price: "$59",
    credits: "1,000 credits",
    fit: "For users who want meaningful continuous monitoring.",
    examples: ["10-20 watched tokens", "5 min cadence", "Email + Telegram"],
  },
  {
    name: "Desk",
    price: "$149",
    credits: "3,000 credits",
    fit: "For heavier users managing larger watchlists.",
    examples: ["20+ watched tokens", "multi-channel delivery", "Webhook or Discord usage"],
  },
];

const costDrivers = [
  "Number of watched tokens",
  "Monitoring cadence: 1 min costs more than 15 min",
  "Number of active rule sets",
  "Delivery channels used",
  "Scope of checks enabled on each token",
];

const freeApiNotes = [
  "Yes, v1 can still rely heavily on free APIs and public endpoints for report refreshes.",
  "The limit is not only API price, but rate limits, reliability, and how many users you monitor at once.",
  "Free APIs are viable for early product-market fit; they become risky when watchlists and cadence scale up.",
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-10 md:px-10 md:py-12">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/70">Hidden pricing draft</p>
        <h1 className="mt-3 text-[2.1rem] font-extrabold leading-tight text-white md:text-[3rem]">
          Credits pay for continuous monitoring, not one-off alerts
        </h1>
        <p className="mt-4 max-w-4xl text-sm text-slate-300 md:text-base">
          The user is paying for the engine that keeps checking watched tokens over time. Alerts are the output of
          that monitoring, not the thing being billed directly.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <p className="text-xs uppercase tracking-wide text-slate-400">{tier.name}</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{tier.price}</h2>
            <p className="mt-1 text-[#E2C98D]">{tier.credits}</p>
            <p className="mt-3 text-sm text-slate-300">{tier.fit}</p>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              {tier.examples.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">How the credit system works</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Users consume credits by keeping watches active</h2>
          <p className="mt-3 text-sm text-slate-300">
            Every active monitoring rule has a cost. Faster cadence, more tokens, and more channels consume more
            credits. That makes the model understandable and maps directly to infrastructure cost.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {costDrivers.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Simple rule</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Do not charge per alert sent</h2>
          <p className="mt-3 text-sm text-slate-300">
            Charging per alert feels punitive. Charging for active monitoring feels logical and gives the user control
            over cost by changing cadence, scope, and channels.
          </p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Payments</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Handle payments with Stripe</h2>
          <p className="mt-3 text-sm text-slate-300">
            The simplest route is Stripe Checkout for purchases and the Stripe Customer Portal for billing management.
            That gives you card handling, receipts, webhooks, and user self-service without building payment flows by
            hand.
          </p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Cancellation</p>
          <h2 className="mt-2 text-2xl font-bold text-white">User cancels from billing or dashboard</h2>
          <p className="mt-3 text-sm text-slate-300">
            If you use subscriptions, the cleanest cancellation flow is:
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">Account page -&gt; Billing</div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">Open Stripe Customer Portal</div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">Cancel or switch plan there</div>
          </div>
          <p className="mt-4 text-sm text-slate-300">
            If you use one-off credit packs only, there is no subscription to cancel; the user just stops buying more.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 text-sm text-slate-300">
            Important: if auto top-up is enabled when credits fall below `300`, cancellation must also let the user
            turn off that auto top-up rule separately. Otherwise the user could stop the subscription but still trigger
            an automatic refill.
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Recommendation</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Use hybrid billing</h2>
          <p className="mt-3 text-sm text-slate-300">
            Best commercial structure:
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">Monthly subscription unlocks the workspace</div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">Credits are consumed by monitoring activity</div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">Top-up packs cover heavier usage</div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Monitoring engine</p>
          <h2 className="mt-2 text-2xl font-bold text-white">How we monitor contracts for change</h2>
          <p className="mt-3 text-sm text-slate-300">
            The monitoring engine should rerun report snapshots on watched tokens at the user&apos;s selected cadence,
            compare the new state with the stored previous state, and create an event only when a user-defined rule is
            matched.
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              1. Load active watches due for refresh
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              2. Rebuild or refresh the token report
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              3. Compare the new snapshot to the last stored snapshot
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              4. Generate alert events only if the user&apos;s own rule conditions are met
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              5. Send to configured channels and store the event in alert history
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Can free APIs work?</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Yes for v1, with limits</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {freeApiNotes.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-300">
            Practical v1 approach: keep using free/public sources for search and report generation, add caching, and
            price monitoring cadence carefully so usage stays within safe limits.
          </p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Auto top-up logic</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Low balance can trigger a refill, but it must stay user-controlled</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              Example rule: when balance drops below `300 credits`, purchase the selected refill pack automatically.
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              The user should be able to enable or disable auto top-up independently from the monitoring plan itself.
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              Cancelling the subscription should prompt: `also disable auto top-up?` and default to yes.
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3">
              Existing credit balance should remain available until consumed, unless your policy says otherwise.
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Product flow</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Pages should now connect like a product</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <a href="/report" className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 hover:border-sky-400/50 hover:text-white">
              Report page - start a scan
            </a>
            <a href="/alerts" className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 hover:border-sky-400/50 hover:text-white">
              User area - create watches and rules
            </a>
            <a href="/pricing" className="block rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-3 hover:border-sky-400/50 hover:text-white">
              Pricing - understand credits and billing
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
