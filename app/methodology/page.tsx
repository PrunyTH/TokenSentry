export default function MethodologyPage() {
  return (
    <article className="prose prose-invert max-w-3xl">
      <h1>Methodology</h1>
      <p>
        TokenSentry scores risk using simple, transparent rules and evidence.
      </p>
      <h2>Ethereum (first-draft)</h2>
      <ul>
        <li>Contract not verified on Etherscan: +25</li>
        <li>Honeypot sell-failure indicator: +40</li>
      </ul>
      <h2>Solana (first-draft)</h2>
      <ul>
        <li>RugCheck danger flags: +40</li>
        <li>RugCheck warning flags: +20</li>
      </ul>
      <p>
        Missing data does not automatically imply high risk, but it is surfaced
        as a limited-data note in each report.
      </p>
      <p>
        This is a security-education tool and not a trading signal engine.
      </p>
    </article>
  );
}
