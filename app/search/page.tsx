import { SearchResults } from "@/components/SearchResults";

type SearchParams = {
  q?: string;
  chain?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const chain = params.chain === "eth" || params.chain === "sol" ? params.chain : undefined;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-white">Search Results</h1>
      <p className="text-sm text-slate-300">
        Query: <span className="font-mono text-slate-200">{q || "(empty)"}</span>
      </p>
      {q ? (
        <div className="panel rounded-2xl p-4">
          <SearchResults query={q} chainFilter={chain} />
        </div>
      ) : (
        <p className="text-slate-300">Please enter a search query.</p>
      )}
    </div>
  );
}
