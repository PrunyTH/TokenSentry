export default function AboutPage() {
  return (
    <article className="prose prose-invert max-w-3xl">
      <h1>About TokenSentry</h1>
      <p>
        TokenSentry is an educational token risk checker focused on transparent
        security heuristics for Ethereum and Solana tokens.
      </p>
      <p>
        The project is designed as a low-cost MVP with public data sources,
        aggressive caching, and graceful degradation when upstream APIs are
        unavailable.
      </p>
    </article>
  );
}
