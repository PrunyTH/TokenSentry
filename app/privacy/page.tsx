export default function PrivacyPage() {
  return (
    <article className="prose prose-invert max-w-3xl">
      <h1>Privacy</h1>
      <p>
        TokenSentry does not require user accounts and does not collect personal
        profile information.
      </p>
      <p>
        Basic request metadata (like IP-derived rate-limit counters) may be
        processed to protect service stability.
      </p>
      <p>
        Third-party services (CoinGecko, Etherscan, RugCheck, Honeypot) are
        queried server-side for report generation.
      </p>
    </article>
  );
}
