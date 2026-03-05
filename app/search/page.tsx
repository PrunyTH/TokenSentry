import { SearchResults } from "@/components/SearchResults";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-white">Search Results</h1>
      <p className="text-sm text-slate-400">
        Query: <span className="font-mono text-slate-200">{q || "(empty)"}</span>
      </p>
      {q ? (
        <SearchResults query={q} />
      ) : (
        <p className="text-slate-300">Please enter a search query.</p>
      )}
    </div>
  );
}
