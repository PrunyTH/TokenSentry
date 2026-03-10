"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type Channel = "email" | "browser" | "telegram" | "discord" | "webhook";
type Frequency = "1m" | "5m" | "15m" | "1h";
type ScoreRule = "up" | "down" | "any";
type AuthMode = "signin" | "create";
type WorkspaceSection =
  | "dashboard"
  | "tokens"
  | "rules"
  | "history"
  | "credits"
  | "integrations";

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

const sampleWatchlist = [
  { token: "PEPE", chain: "Ethereum", status: "Monitoring", note: "Notify on risk jump > 10 pts" },
  { token: "BONK", chain: "Solana", status: "Monitoring", note: "Telegram alerts for liquidity drops" },
  { token: "WIF", chain: "Solana", status: "Paused", note: "Muted until volatility settles" },
];

const tokenLibrary = [
  { token: "PEPE", chain: "Ethereum", savedAt: "2 days ago", alerts: 3, category: "Medium" },
  { token: "BONK", chain: "Solana", savedAt: "5 days ago", alerts: 2, category: "Medium" },
  { token: "WIF", chain: "Solana", savedAt: "1 week ago", alerts: 1, category: "High" },
  { token: "AERO", chain: "Base", savedAt: "9 days ago", alerts: 4, category: "Low" },
];

const configuredAlerts = [
  {
    name: "Risk worsens fast",
    scope: "All watched tokens",
    channel: "Email + Browser push",
    rule: "Send when score worsens by 10+ points in one refresh.",
  },
  {
    name: "Liquidity danger floor",
    scope: "PEPE, BONK, WIF",
    channel: "Telegram",
    rule: "Alert if liquidity falls below $50,000 or drops sharply.",
  },
  {
    name: "Contract-event monitor",
    scope: "Ethereum and Base",
    channel: "Webhook",
    rule: "Notify on honeypot flips, mintability changes, or proxy/owner risk flags.",
  },
];

const alertHistory = [
  {
    token: "BONK",
    when: "12 min ago",
    severity: "high",
    text: "Liquidity dropped below the user-defined floor and risk score increased by 15 points.",
  },
  {
    token: "AERO",
    when: "1 h ago",
    severity: "medium",
    text: "Risk category moved from Low to Medium after a holder concentration change.",
  },
  {
    token: "PEPE",
    when: "Yesterday",
    severity: "low",
    text: "Price movement triggered monitoring, but no custom risk thresholds were breached.",
  },
];

const dashboardNav: Array<{ id: WorkspaceSection; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tokens", label: "Saved Tokens" },
  { id: "rules", label: "Alert Rules" },
  { id: "history", label: "Alert History" },
  { id: "credits", label: "Credits" },
  { id: "integrations", label: "Integrations" },
];

const creditPackages = [
  { name: "Starter", amount: 250, price: "$19", note: "Light monitoring for a small watchlist." },
  { name: "Active", amount: 1000, price: "$59", note: "Good fit for 5-minute checks across multiple tokens." },
  { name: "Desk", amount: 3000, price: "$149", note: "Built for larger monitored universes and several channels." },
];

export function AlertConfigurator() {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [workspaceSection, setWorkspaceSection] = useState<WorkspaceSection>("dashboard");
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("Richard's alert desk");
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

  const creditsPerDay = useMemo(() => {
    const base =
      frequency === "1m" ? 48 : frequency === "5m" ? 18 : frequency === "15m" ? 8 : 3;
    const channelMultiplier = Math.max(1, channels.length * 0.75);
    const eventMultiplier = Math.max(1, selectedEvents.length * 0.35);
    return Math.ceil(base * channelMultiplier * eventMultiplier);
  }, [channels.length, frequency, selectedEvents.length]);

  const creditsPerMonth = creditsPerDay * 30;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/70">Private access</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Each user gets their own alert workspace</h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                This should feel like a private control room, not a public calculator. Users sign in, keep their
                watched tokens, and adjust notification rules over time without rebuilding everything from scratch.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  authMode === "signin"
                    ? "border-sky-400/60 bg-sky-400/10 text-sky-100"
                    : "border-slate-700 bg-slate-900/55 text-slate-300"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("create")}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  authMode === "create"
                    ? "border-sky-400/60 bg-sky-400/10 text-sky-100"
                    : "border-slate-700 bg-slate-900/55 text-slate-300"
                }`}
              >
                Create account
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {authMode === "signin" ? "Email address" : "Work email"}
                  </label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {authMode === "signin" ? "Password" : "Create password"}
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === "signin" ? "Enter your password" : "Minimum 12 characters"}
                    className="mt-2"
                  />
                </div>
              </div>

              {authMode === "create" ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-[0.22em] text-slate-500">Workspace name</label>
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="My TokenSentry desk"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.22em] text-slate-500">Primary channel</label>
                    <div className="mt-2 rounded-xl border border-slate-700 bg-slate-900/55 px-4 py-3 text-sm text-slate-300">
                      Email first, then connect Telegram / Discord / webhooks later
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Button type="button" onClick={() => setSignedIn(true)}>
                  {authMode === "signin" ? "Enter workspace" : "Create workspace"}
                </Button>
                <Button type="button" variant="secondary">
                  Continue with magic link
                </Button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/55 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Saved presets</p>
                  <p className="mt-2 text-lg font-semibold text-white">4</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/55 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Watched tokens</p>
                  <p className="mt-2 text-lg font-semibold text-white">12</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/55 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Alert channels</p>
                  <p className="mt-2 text-lg font-semibold text-white">3 active</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/60 bg-[radial-gradient(circle_at_top,rgba(226,201,141,0.18),transparent_46%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#E2C98D]">Workspace preview</p>
              <h3 className="mt-2 text-xl font-bold text-white">
                {signedIn ? workspaceName || "Private alert workspace" : "What the user sees after login"}
              </h3>
              <div className="mt-5 space-y-3">
                {sampleWatchlist.map((item) => (
                  <div key={item.token} className="rounded-2xl border border-slate-700/60 bg-slate-950/55 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{item.token}</p>
                        <p className="text-sm text-slate-400">{item.chain}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "Monitoring"
                            ? "bg-emerald-500/15 text-emerald-200"
                            : "bg-amber-500/15 text-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Account model</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Access</p>
              <p className="mt-1 font-medium text-white">Email + password or magic link</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Private area contents</p>
              <p className="mt-1 font-medium text-white">Watchlists, channels, billing, alert history</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Best v1 auth</p>
              <p className="mt-1 font-medium text-white">Clerk or Supabase Auth</p>
            </div>
          </div>
        </Card>
      </section>

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

      <section className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Workspace nav</p>
          <div className="mt-4 space-y-2">
            {dashboardNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setWorkspaceSection(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                  workspaceSection === item.id
                    ? "border-sky-400/45 bg-sky-400/10 text-white"
                    : "border-slate-700/60 bg-slate-900/55 text-slate-300 hover:border-slate-500 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] opacity-60">
                  {item.id === "dashboard"
                    ? "Home"
                    : item.id === "tokens"
                      ? "DB"
                      : item.id === "rules"
                        ? "Rules"
                        : item.id === "history"
                          ? "Feed"
                          : item.id === "credits"
                            ? "Billing"
                            : "Apps"}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Credit balance</p>
              <p className="mt-3 text-3xl font-bold text-white">1,420</p>
              <p className="mt-2 text-sm text-slate-400">Enough for roughly 23 days at current monitoring settings.</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Active watches</p>
              <p className="mt-3 text-3xl font-bold text-white">12</p>
              <p className="mt-2 text-sm text-slate-400">9 active, 3 paused across 4 chains.</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Alerts today</p>
              <p className="mt-3 text-3xl font-bold text-white">7</p>
              <p className="mt-2 text-sm text-slate-400">2 high-severity triggers need review.</p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Monitoring burn</p>
              <p className="mt-3 text-3xl font-bold text-white">{creditsPerDay}/day</p>
              <p className="mt-2 text-sm text-slate-400">{creditsPerMonth} credits estimated over 30 days.</p>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
            <Card>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
                    {workspaceSection === "dashboard"
                      ? "Monitoring overview"
                      : workspaceSection === "tokens"
                        ? "Saved token database"
                        : workspaceSection === "rules"
                          ? "Rule library"
                          : workspaceSection === "history"
                            ? "Triggered events"
                            : workspaceSection === "credits"
                              ? "Credit system"
                              : "Integrations"}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-white">
                    {workspaceSection === "dashboard"
                      ? "Continuous monitoring dashboard"
                      : workspaceSection === "tokens"
                        ? "Token inventory and watch status"
                        : workspaceSection === "rules"
                          ? "Alert rules priced by monitoring intensity"
                          : workspaceSection === "history"
                            ? "History of triggered events"
                            : workspaceSection === "credits"
                              ? "Buy credits for continuous monitoring"
                              : "Connected channels and future trading hooks"}
                  </h2>
                </div>
                <Button type="button" variant="secondary">
                  {workspaceSection === "credits" ? "Top up credits" : "Add new"}
                </Button>
              </div>

              {workspaceSection === "dashboard" ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent alerts</p>
                    <div className="mt-4 space-y-3">
                      {alertHistory.map((item) => (
                        <div key={`${item.token}-${item.when}`} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-white">{item.token}</p>
                            <span className="text-xs text-slate-400">{item.when}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-300">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next scheduled checks</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">PEPE {"->"} 2 min</div>
                        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">BONK {"->"} 3 min</div>
                        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">AERO {"->"} 5 min</div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Why users pay</p>
                      <p className="mt-3 text-sm text-slate-300">
                        Credits fund continuous checks, not one-off pings. Faster cadence and more monitored tokens
                        increase usage in a way the user can understand and control.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {workspaceSection === "tokens" ? (
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950/60">
                  <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-800 px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <span>Token</span>
                    <span>Chain</span>
                    <span>Saved</span>
                    <span>Alerts</span>
                    <span>Risk</span>
                  </div>
                  <div className="divide-y divide-slate-800/80">
                    {tokenLibrary.map((item) => (
                      <div
                        key={`${item.token}-${item.chain}`}
                        className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-4 text-sm text-slate-200"
                      >
                        <span className="font-semibold text-white">{item.token}</span>
                        <span>{item.chain}</span>
                        <span>{item.savedAt}</span>
                        <span>{item.alerts}</span>
                        <span
                          className={
                            item.category === "Low"
                              ? "text-emerald-300"
                              : item.category === "Medium"
                                ? "text-amber-300"
                                : "text-rose-300"
                          }
                        >
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {workspaceSection === "rules" ? (
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {configuredAlerts.map((alert, index) => (
                    <div key={alert.name} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                      <p className="text-sm font-semibold text-white">{alert.name}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Scope</p>
                      <p className="mt-1 text-sm text-slate-300">{alert.scope}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Channel</p>
                      <p className="mt-1 text-sm text-slate-300">{alert.channel}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Rule</p>
                      <p className="mt-1 text-sm text-slate-300">{alert.rule}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Est. cost</p>
                      <p className="mt-1 text-sm text-[#E2C98D]">{12 + index * 8} credits / day</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {workspaceSection === "history" ? (
                <div className="mt-6 space-y-3">
                  {alertHistory.map((item) => (
                    <div key={`${item.token}-${item.when}`} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{item.token}</p>
                          <p className="text-sm text-slate-400">{item.when}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.severity === "high"
                              ? "bg-rose-500/15 text-rose-200"
                              : item.severity === "medium"
                                ? "bg-amber-500/15 text-amber-200"
                                : "bg-sky-500/15 text-sky-200"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {workspaceSection === "credits" ? (
                <div className="mt-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current balance</p>
                      <p className="mt-2 text-2xl font-bold text-white">1,420 credits</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estimated burn</p>
                      <p className="mt-2 text-2xl font-bold text-white">{creditsPerMonth} / month</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Next refill trigger</p>
                      <p className="mt-2 text-2xl font-bold text-white">Below 300</p>
                    </div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {creditPackages.map((pack) => (
                      <div key={pack.name} className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-5">
                        <p className="text-sm font-semibold text-white">{pack.name}</p>
                        <p className="mt-3 text-3xl font-bold text-[#E2C98D]">{pack.amount}</p>
                        <p className="mt-1 text-sm text-slate-400">credits</p>
                        <p className="mt-4 text-2xl font-semibold text-white">{pack.price}</p>
                        <p className="mt-2 text-sm text-slate-300">{pack.note}</p>
                        <Button type="button" className="mt-5 w-full">
                          Buy package
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {workspaceSection === "integrations" ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {channelOptions.map((option, index) => (
                    <div key={option.id} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                      <p className="font-semibold text-white">{option.label}</p>
                      <p className="mt-2 text-sm text-slate-400">{option.desc}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
                      <p className="mt-1 text-sm text-slate-200">
                        {index < 2 ? "Connected in concept" : option.id === "telegram" ? "Planned next" : "Future"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card className="h-fit">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Monitoring economics</p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                  <p className="text-slate-400">Charging model</p>
                  <p className="mt-1 font-medium text-white">Credits pay for continuous monitoring, not per alert sent</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                  <p className="text-slate-400">Current cadence</p>
                  <p className="mt-1 font-medium text-white">Every {frequency} across {tokenLibrary.length} saved tokens</p>
                </div>
                <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                  <p className="text-slate-400">Cost drivers</p>
                  <p className="mt-1 font-medium text-white">More tokens, faster checks, more channels, richer rules</p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,380px)]">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/70">User database</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Saved tokens and configured alert sets</h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                The private area should store the user&apos;s token universe, their active alert presets, and the
                history of what actually fired, so they can refine the rules over time.
              </p>
            </div>
            <Button type="button" variant="secondary">
              Add token to library
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950/60">
            <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-800 px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">
              <span>Token</span>
              <span>Chain</span>
              <span>Saved</span>
              <span>Alerts</span>
              <span>Risk</span>
            </div>
            <div className="divide-y divide-slate-800/80">
              {tokenLibrary.map((item) => (
                <div
                  key={`${item.token}-${item.chain}`}
                  className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-4 text-sm text-slate-200"
                >
                  <span className="font-semibold text-white">{item.token}</span>
                  <span>{item.chain}</span>
                  <span>{item.savedAt}</span>
                  <span>{item.alerts}</span>
                  <span
                    className={
                      item.category === "Low"
                        ? "text-emerald-300"
                        : item.category === "Medium"
                          ? "text-amber-300"
                          : "text-rose-300"
                    }
                  >
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {configuredAlerts.map((alert) => (
              <div key={alert.name} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">{alert.name}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Scope</p>
                <p className="mt-1 text-sm text-slate-300">{alert.scope}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Channel</p>
                <p className="mt-1 text-sm text-slate-300">{alert.channel}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Rule</p>
                <p className="mt-1 text-sm text-slate-300">{alert.rule}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Alert history</p>
          <h3 className="mt-3 text-2xl font-bold text-white">Triggered events feed</h3>
          <div className="mt-5 space-y-3">
            {alertHistory.map((item) => (
              <div key={`${item.token}-${item.when}`} className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{item.token}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.severity === "high"
                        ? "bg-rose-500/15 text-rose-200"
                        : item.severity === "medium"
                          ? "bg-amber-500/15 text-amber-200"
                          : "bg-sky-500/15 text-sky-200"
                    }`}
                  >
                    {item.when}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-sky-300/70">Future execution layer</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Telegram bot can sit on top of the alert engine later</h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
            The user space should already anticipate bot-based execution, even if we do not activate it yet. The
            immediate job is to build a solid watchlist, alert-rule, and alert-history foundation.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phase 1</p>
              <p className="mt-2 font-semibold text-white">Notification-only</p>
              <p className="mt-2 text-sm text-slate-300">Email, push, Telegram, Discord, webhook. No trading actions.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phase 2</p>
              <p className="mt-2 font-semibold text-white">Telegram bot control</p>
              <p className="mt-2 text-sm text-slate-300">Users subscribe their bot, receive alerts, and acknowledge or mute rules.</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Phase 3</p>
              <p className="mt-2 font-semibold text-white">Trade execution layer</p>
              <p className="mt-2 text-sm text-slate-300">Only after permissions, auditability, and user controls are fully designed.</p>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Telegram readiness</p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Bot status</p>
              <p className="mt-1 font-medium text-white">Disabled for now</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Needed later</p>
              <p className="mt-1 font-medium text-white">Bot token, user chat mapping, permissioned commands, audit log</p>
            </div>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4">
              <p className="text-slate-400">Current focus</p>
              <p className="mt-1 font-medium text-white">Database-backed workspace, saved tokens, alert rules, triggered-event history</p>
            </div>
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
