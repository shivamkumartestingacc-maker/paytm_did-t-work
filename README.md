# Making UPI Rewards Worth Earning

A long-form product-design case study with an interactive mobile prototype for a Paytm rewards concept.
Independent concept: not affiliated with, commissioned or endorsed by Paytm. All payments and rewards are simulated.

## Run / host

```bash
npm install
npm run dev            # local development
npm test               # reducer + config unit tests
npm run build:single   # one self-contained HTML file in dist-single/ — host it anywhere (Netlify drop, GitHub Pages, S3)
```

E2E checks (the 12 required scenarios + walkthrough):

```bash
npm run build && npx vite preview --port 4180 &
node e2e/scenarios.mjs
```

## Where things live

| File | What it holds |
|---|---|
| `src/config.ts` | **All demo configuration**: threshold (5), start progress, minimum amount, eligible payment types, reward cards and their outcome (50% / 100%), benefit bounds, expiry, processing and scan timings, payment presets, persistence. |
| `src/state.tsx` | The single reducer: payments, eligibility, progress, the pick, reward grant, claim/redeem, tabs, reset. Guards against double-submit and duplicate grants. Optional `localStorage` persistence. |
| `src/phone/screens.tsx` | Home, Scan, Pay + processing, Success, Failed, Pick, Reveal, Reward details. |
| `src/phone/walkthrough.tsx` | The guided walkthrough: a timed list of real reducer actions. Scrubbing replays actions up to that moment; tapping the phone hands control to the visitor. |
| `src/case/*` | Case-study sections, decision carousels (live screens rendered from scripted states), prototype panel. |
| `src/art.tsx` | Inline-SVG illustrations and icons. |
| `src/styles/*` | Tokens, page layout, phone UI, motion (with reduced-motion fallback). |

## Product logic

Progress decides **when** the user can pick; the card decides **what** they get.

1. Only successful, eligible payments (merchant or bill, ₹100+) add progress. Failed, cancelled, small and self-transfer payments don't.
2. At the threshold, a reward pick unlocks. Further payments don't add progress until the reward is claimed.
3. The user selects 1 of 3 cards and confirms. The benefit comes from configuration (`outcomePct × baseValue`, clamped to `benefitBounds`), never from animation.
4. Claiming completes the cycle: progress restarts at 0. Vouchers can then be redeemed; cashback is final at claim.
