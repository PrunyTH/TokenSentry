import type { Metadata } from "next";
import { AlertConfigurator } from "@/components/AlertConfigurator";

export const metadata: Metadata = {
  title: "Alerts and Watchlists | TokenSentry",
  description:
    "Configure watchlists and token risk alerts for TokenSentry. Choose your own thresholds, delivery channels, and monitoring frequency.",
};

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-950/80 px-6 py-10 md:px-10 md:py-12">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/70">Alerts and watchlists</p>
        <h1 className="mt-3 text-[2.1rem] font-extrabold leading-tight text-white md:text-[3rem]">
          Let each user define their own trading-risk alerts
        </h1>
        <p className="mt-4 max-w-4xl text-sm text-slate-300 md:text-base">
          TokenSentry should not decide what matters to every trader. The product should let users choose the
          thresholds, channels, and monitoring cadence that match their own strategy.
        </p>
      </section>

      <AlertConfigurator />
    </div>
  );
}
