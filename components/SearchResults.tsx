"use client";

import { useEffect, useState } from "react";
import { Candidate } from "@/lib/types";
import { TokenCard } from "@/components/TokenCard";

export function SearchResults({ query }: { query: string }) {
  const [items, setItems] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Search failed");
          return;
        }
        setItems((data?.candidates as Candidate[]) ?? []);
      } catch {
        setError("Unexpected network error.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [query]);

  if (loading) return <p className="text-slate-300">Searching...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (items.length === 0) return <p className="text-slate-300">No candidates found.</p>;

  return (
    <div className="space-y-3">
      {items.map((candidate) => (
        <TokenCard
          key={`${candidate.chain}:${candidate.address}`}
          candidate={candidate}
        />
      ))}
    </div>
  );
}
