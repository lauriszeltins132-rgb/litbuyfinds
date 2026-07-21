# LitBuy AI — Repository Audit & Architecture

**Date:** 2026-07-21  
**Site:** https://litbuyfinds.io  
**Branch:** `cursor/litbuy-ai-1343`

## 1) Repository audit

| Area | Finding |
|------|---------|
| Framework | Next.js **15.3+** (App Router), React **19**, TypeScript **strict** |
| Data | File-based catalog: `src/data/products.json` (~3.1k products) from spreadsheet import — **no Postgres** |
| Product type | `id`, `product_name`, `category`, `category_slug`, `price`, `affiliate_link`, `qc_link`, `image`, `sheet`, `group` |
| Brand | Derived at runtime from product name (`extractBrand`) — not a DB column |
| Search today | Lexical `filterProducts` (tokens + brand + price + QC) + autocomplete index |
| Product UI | Reuse `ProductCard`, `ProductGrid`, buy/agent CTAs |
| API routes | analytics, daily-drop, catalog audit, processed-image — **no AI yet** |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` already wired |
| Auth | **None** (wishlist/preferences in localStorage) |
| Design | Cream/orange LitBuy theme — **do not redesign** |
| Env | No `.env` / secrets in repo historically |
| AI deps (before) | None (`ai`, gateway, zod added for this feature) |

## 2) Architecture decisions (pragmatic production)

1. **No new product database.** Ground all recommendations in `getAllProducts()` / existing filters.
2. **Hybrid search v1 = deterministic + lexical + synonym expansion + ranking** over the JSON catalog.  
   Vector/pgvector deferred — requires Postgres we do not have. Embedding hooks left optional via env.
3. **Vercel AI SDK + AI Gateway** for chat/tool-calling when `AI_GATEWAY_API_KEY` is set.
4. **Graceful degradation:** if no AI key / provider failure, chat falls back to deterministic catalogue search with real product cards.
5. **In-memory rate limits** (per hashed IP, **per serverless instance**).  
   **TODO(distributed-rate-limit):** Redis / Vercel KV for globally consistent limits across Vercel instances.
6. **No automatic SEO doorway pages** from user queries. Indexable `/ai` hub only.
7. **Cron:** `CRON_SECRET` required in production; timing-safe bearer compare. Local/dev without secret is allowed only when not production.

## 3) Product grounding guarantees

- Tool outputs and search/haul responses pass through `rehydratePublicProducts()` → `getProductById()` only.
- Invalid / invented IDs are discarded.
- Prices, product URLs, and affiliate URLs always come from catalogue records (`withCurrentLitBuyInvite` for invite rewrite only).
- Haul subtotals are recalculated server-side (`recalculateHaulTotals`).
- Clients cannot select `model`, `tools`, `provider`, or `system` on `/api/ai/chat`.

## 4) Environment variables

See `.env.example`.

| Variable | Required | Notes |
|----------|----------|-------|
| `AI_GATEWAY_API_KEY` | For LLM chat | Without it, catalogue search mode still works |
| `AI_PRIMARY_MODEL` | Optional | Default `openai/gpt-4o-mini` (validated) |
| `AI_FALLBACK_MODEL` | Optional | Default `openai/gpt-4o` |
| `AI_MAX_OUTPUT_TOKENS` | Optional | Capped |
| `AI_DAILY_REQUEST_LIMIT` | Optional | Per-instance global budget |
| `AI_RATE_LIMIT_PER_MINUTE` / `_PER_DAY` | Optional | Per hashed client key |
| `CRON_SECRET` | **Required in production** | Bearer for `/api/ai/cron/*` |
| `NEXT_PUBLIC_SITE_URL` | Optional | Defaults to `https://litbuyfinds.io` |

Preview vs production: set the same keys in both Vercel environments; use separate Gateway keys if you want spend isolation.

## 5) Package additions

- `ai`, `@ai-sdk/gateway`, `@ai-sdk/react`, `zod`, `tsx` (dev)

## 6) Risks

| Risk | Mitigation |
|------|------------|
| AI cost abuse | Rate limits, daily budget, max tokens, tool-call caps, body size limits |
| Invented products | `rehydratePublicProducts` + tool wrappers |
| Affiliate URL mutation | Catalogue `affiliate_link` + invite rewrite only |
| Homepage JS weight | Dynamic import floating AI / panel chat |
| Prompt injection via product text | System prompt marks catalogue fields as untrusted data |
| Per-instance rate limits | Documented TODO for Redis |

## 7) Local testing

```bash
cp .env.example .env.local
# Optional: set AI_GATEWAY_API_KEY for full LLM chat
npm run dev
# Open http://localhost:3000/ai
npm run test:ai
npx tsc --noEmit
npm run lint
npm run build
npx tsx --tsconfig tsconfig.json scripts/smoke-ai-search.mjs
```

Without `AI_GATEWAY_API_KEY`, chat uses deterministic catalogue search (still real products).

## 8) Vercel production checklist

1. Set env vars (Gateway key, models, **CRON_SECRET**).
2. Deploy after merge.
3. `GET /ai` → 200, unique title, H1, internal links.
4. `POST /api/ai/search` with `{ "query": "black shoes under 50" }`.
5. Chat with Gateway key unset → catalogue mode disclaimer + product cards.
6. Floating AI button does not cover mobile dock.
7. Cron: `Authorization: Bearer $CRON_SECRET` on `/api/ai/cron/index-health`.
8. Cron without secret in production → 401.

## 9) Rollback

Revert the merge commit for this branch or remove `AiLauncher` / `AiHeroEntry` / `/ai` if needed. Catalogue pages remain intact.

## 10) Deferred (non-blocking)

- Postgres + pgvector embeddings
- Distributed Redis rate limits
- Auth-gated admin SEO draft queue
- E2E Playwright with mocked model
- Conversation persistence with consent
