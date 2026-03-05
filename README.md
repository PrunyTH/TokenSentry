# TokenSentry (MVP)

TokenSentry is a low-cost, educational crypto token risk checker for Ethereum and Solana.

## Scope

- Security/education positioning (not trading signals)
- SEO-friendly routes:
  - `/eth/<address>`
  - `/sol/<mint>`
  - `/search?q=<name>`
- Minimal dependencies
- Graceful behavior when upstream APIs fail or are rate-limited
- Built for Vercel deployment

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Route Handlers for server APIs

## Routes

- `/` home input
- `/search?q=...` disambiguation list
- `/eth/[address]` Ethereum risk report
- `/sol/[mint]` Solana risk report
- `/about`, `/methodology`, `/privacy`

## API Endpoints

- `GET /api/search?q=<text>`
  - CoinGecko-backed search with normalization and chain mapping
- `GET /api/report/eth/<address>`
  - Etherscan + optional Honeypot checks
- `GET /api/report/sol/<mint>`
  - RugCheck best-effort checks

## Caching

- `/api/search`: 15 minutes
- `/api/report/*`: 60 minutes

Storage strategy:

1. Upstash Redis (if `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set)
2. In-memory fallback

## Rate Limiting

- 30 requests / 10 minutes / IP
- Returns `429` with `Retry-After` header and friendly JSON error

## Environment Variables

Copy `.env.example` to `.env.local` and fill what you have:

```bash
cp .env.example .env.local
```

`ETHERSCAN_API_KEY` is optional. Reports still render with limited-data notes when missing.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, import the repo.
3. Add environment variables in Vercel Project Settings.
4. Deploy.

## Domain Setup (`tokensentry.co`) with Cloudflare DNS

1. In Vercel project settings, add:
   - `tokensentry.co`
   - `www.tokensentry.co`
2. Vercel will show required DNS records.
3. In Cloudflare DNS, create those exact records.
4. Keep Cloudflare records **DNS only (grey cloud)** initially to avoid early proxy/certificate issues.
5. Wait for DNS propagation, then verify domain status in Vercel.

## Notes

- The scoring model is intentionally transparent and first-draft.
- This MVP is designed to run near-zero budget by relying on free/public APIs plus caching.
- Always verify token behavior on-chain.
