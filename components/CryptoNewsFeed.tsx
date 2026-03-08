"use client";

import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  tags: string[];
};

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function CryptoNewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (active) {
          if (data.items?.length) {
            setItems(data.items);
            setError(false);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      } catch {
        if (active) { setError(true); setLoading(false); }
      }
    }
    load();
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  return (
    <div className="news-feed-panel">
      <div className="news-feed-header">
        <p className="text-xs uppercase tracking-wide text-slate-300">Crypto News</p>
        <p className="mt-0.5 text-[11px] text-slate-500">Via Messari · refreshes every 5 min</p>
      </div>

      <div className="news-feed-scroll">
        {loading && (
          <div className="space-y-3 pt-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="news-skeleton" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="pt-2 text-xs text-amber-300/70">News feed unavailable — check back shortly.</p>
        )}

        {!loading && !error && items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="news-item"
          >
            <p className="news-item-title">{item.title}</p>
            <div className="news-item-meta">
              <span>{item.source}</span>
              <span className="news-item-dot" aria-hidden="true" />
              <span>{relTime(item.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
