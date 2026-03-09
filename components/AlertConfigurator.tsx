"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type Channel = "email" | "browser" | "telegram" | "discord" | "webhook";
type Frequency = "1m" | "5m" | "15m" | "1h";
type ScoreRule = "up" | "down" | "any";

const channelOptions: Array<{
  id: Channel;
  label: string;
  desc: string;
}> = [
  { id: "email", label: "Email", desc: "Best default for most users and easiest paid tier." },
  { id: "browser", label: "Browser push", desc: "Fast for active users already on desktop." },
  { id: "telegram", label: "Telegram", desc: "Good for traders who want mobile alerts immediately." },
  { id: "discord", label: "Discord", desc: "Useful for group monitoring or private alert channels." },
  { id: "webhook", label: "Webhook", desc: "Best for advanced users who want alerts in their own systems." },
];

const eventOptions = [
  { id: "riskCategory", label: "Risk category changes", desc: "Low to Medium, Medium to High, and similar jumps." },
  { id: "scoreDelta", label: "Score changes by threshold", desc: "User decides the score movement that matters." },
  { id: "honeypot", label: "Honeypot status changes", desc: "Critical if a token becomes sell-restricted." },
  { id: "liquidity", label: "Liquidity drops", desc: "Alert when liquidity falls below your threshold." },
  { id: "taxes", label: "Buy or sell tax changes", desc: "Useful for strategy rules and sudden token changes." },
  { id: "holders", label: "Holder concentration worsens", desc: "Watch for rising whale concentration." },
  { id: "contract", label: "Contract / ownership flags change", desc: "Minting, proxy, pause, or owner-related flags." },
  { id: "data", label: "Data quality degrades", desc: "Useful if you rely on specific upstream checks." },
];

export function AlertConfigurator() {
  const [email, setEmail] = useState("");
  const [channels, setChannels] = useState<Channel[]>(["email"]);
  const [frequency, setFrequency] = useState<Frequency>("5m");
  const [scoreRule, setScoreRule] = useState<ScoreRule>("any");
  const [scoreDelta, setScoreDelta] = useState(10);
  const [liquidityFloor, setLiquidityFloor] = useState("50000");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "riskCategory",
    "scoreDelta",
    "honeypot",
    "liquidity",
  ]);

  function toggleChannel(channel: Channel) {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel]
    );
  }

  function toggleEvent(eventId: string) {
    setSelectedEvents((current) =>
      current.includes(eventId)
        ? current.filter((item) => item !== eventId)
        : [...current, eventId]
    );
  }

  const realtimeLabel = useMemo(() => {
    if (frequency === "1m") return "Near real-time";
    if (frequency === "5m") return "Fast monitoring";
    if (frequency === "15m") return "Balanced";
    return "Low-cost";
  }, [frequency]);

  const deliverySummary = useMemo(() => {
    const names = channelOptions
      .filter((option) => channels.includes(option.id))
      .map((option) => option.label)
      .join(", ");
    return names || "No delivery channel selected";
  }, [channels]);

  const previewText = useMemo(() => {
    const scoreDirection =
      scoreRule === "up" ? "worsens" : scoreRule === "down" ? "improves" : "changes";
    return `Check watched tokens every ${frequency}. Notify via ${deliverySummary.toLowerCase()} when the risk category changes, when the score ${scoreDirection} by ${scoreDelta}+ points, or when any selected custom trigger fires.`;
  }, [deliverySummary, frequency, scoreDelta, scoreRule]);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-sky-300/70">Alert builder</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Users choose what counts as meaningful</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
            Different traders use different risk rules. TokenSentry should let each user define their own triggers,
            save the watch settings, and update them over time as their strategy evolves.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.22em] text-slate-500">Email destination</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.22em] text-slate-500">Monitoring frequency</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { id: "1m", label: "1 min" },
                  { id: "5m", label: "5 min" },
                  { id: "15m", label: "15 min" },
                  { id: "1h", label: "1 hour" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrequency(item.id as Frequency)}
                    className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                      frequency === item.id
                        ? "border-sky-400/60 bg-sky-400/10 text-sky-100"
                        : "border-slate-700 bg-slate-900/55 text-slate-300 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Delivery channels</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {channelOptions.map((option) => {
                const active = channels.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleChannel(option.id)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-sky-400/45 bg-sky-400/10"
                        : "border-slate-700/60 bg-slate-900/55 hover:border-slate-500"
                    }`}
                  >
                    <p className="font-semibold text-white">{option.label}</p>
                    <p className="mt-1 text-sm text-slate-400">{option.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Trigger types</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {eventOptions.map((event) => {
                  const active = selectedEvents.includes(event.id);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => toggleEvent(event.id)}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        active
                          ? "border-emerald-400/35 bg-emerald-400/10"
                          : "border-slate-700/60 bg-slate-900/55 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-medium text-white">{event.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{event.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Thresholds</p>
              <div className="mt-4">
                <label className="text-sm text-slate-300">Score direction</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "up", label: "Worsens" },
                    { id: "down", label: "Improves" },
                    { id: "any", label: "Any" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setScoreRule(item.id as ScoreRule)}
                      className={`rounded-xl border px-3 py-2 text-sm ${
                        scoreRule === item.id
                          ? "border-sky-400/60 bg-sky-400/10 text-sky-100"
                          : "border-slate-700 bg-slate-950/60 text-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="flex items-center justify-between text-sm text-slate-300">
                  <span>Score threshold</span>
                  <span className="font-semibold text-white">{scoreDelta} pts</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={5}
                  value={scoreDelta}
                  onChange={(e) => setScoreDelta(Number(e.target.value))}
                  className="mt-3 w-full accent-[#E2C98D]"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm text-slate-300">Liquidity alert floor (USD)</label>
                <Input
                  value={liquidityFloor}
                  onChange={(e) => setLiquidityFloor(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Preview</p>
          <div className="mt-4 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200/80">{realtimeLabel}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-100">{previewText}</p>
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Delivery</p>
              <p className="mt-1 font-medium text-white">{deliverySummary}</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Cadence</p>
              <p className="mt-1 font-medium text-white">Every {frequency}</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Liquidity floor</p>
              <p className="mt-1 font-medium text-white">${liquidityFloor || "0"}</p>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Button type="button">Save alert preset</Button>
            <Button type="button" variant="secondary">
              View pricing idea
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">How users receive alerts</p>
          <h3 className="mt-2 text-xl font-bold text-white">Start with email, then expand</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Email is the lowest-friction v1 and easiest to monetize.</li>
            <li>Browser push is useful for active desktop users but requires permission and subscription state.</li>
            <li>Telegram, Discord, and webhooks are strong paid-tier channels for more advanced users.</li>
          </ul>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">What real-time means</p>
          <h3 className="mt-2 text-xl font-bold text-white">Near real-time is realistic, true instant is expensive</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>For v1, poll watched tokens every 1 to 5 minutes and compare the new report to the previous snapshot.</li>
            <li>That is fast enough for most users and much cheaper than maintaining full chain-level live streams.</li>
            <li>Only move to true streaming when you know which events users actually pay for.</li>
          </ul>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-400">Proposed backend</p>
          <h3 className="mt-2 text-xl font-bold text-white">Watchlist + scheduler + notifier</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>Store user watchlists, trigger preferences, and previous report snapshots in a real database.</li>
            <li>Run scheduled checks, generate diffs, then send alerts only when a user-defined rule is matched.</li>
            <li>Use per-user API or channel credentials only for delivery, not for the core risk computation.</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
