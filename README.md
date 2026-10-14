# paytm_rewards — design direction + prototype shell

An interactive scaffolding prototype for a Paytm Rewards feature: pick a flow on the left,
interact with the phone on the right, read the screen annotations next to it.

**Design direction lives in [`docs/design.md`](docs/design.md).**

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck   # tsc, no emit
npm run smoke       # mounts the shell in jsdom and clicks through both flows
npm run build       # production bundle
```

`npm run smoke` is the regression gate: it drives the real browser code path (effects,
framer-motion, navigation) and asserts 12 interactions — rail steps, state toggles, in-device
taps, the scratch-card reveal, the redemption sheet — with zero console errors. Run it after any
change to `src/shell/` or `src/screens/`.

Stack: Vite + React 18 + TypeScript + Tailwind v4 + framer-motion (chosen so screens can be
animated on request without a rewrite).

## Using the shell

| Where | What |
| --- | --- |
| **Left rail** | Flows, the steps of the selected flow, per-step state toggles, flow meta, reset |
| **Centre stage** | A 390 × 844 device, auto-scaled to fit. Tap through the flow for real |
| **Right panel** | Annotations for the current screen: what / why / rules / design notes / motion / PRD excerpt / open questions |
| **Stage footer** | Back · step progress · next step |
| **Keyboard** | `→` next step · `←` back · `R` reset |
| **URL** | `#/flow-id/step-id` — deep-linkable and shareable |

## Editing content (no component code needed)

- **Flows, steps, annotations, PRD text** → `src/flows/index.ts`
- **Design tokens** (colour, type, radius, shadow, motion) → `src/index.css` + `src/design/tokens.ts`
- **Components** → `src/ui/primitives.tsx`, icons in `src/ui/icons.tsx`
- **Screens** → `src/screens/sample/*.tsx`, registered in `src/screens/registry.tsx`

The screens currently in `src/screens/sample/` are **placeholders** that demonstrate the system
(nudge-before / reveal-after, scratch-card motion, two-step redemption, ledger, all five states).
They get replaced as the PRD lands.

## Status

- [x] Design system draft (`docs/design.md` §1–§13), AA-verified palette
- [x] Prototype shell: flows, steps, states, transitions, annotations, deep links, reduced motion
- [ ] Screenshot audit of the real Paytm screens (`docs/design.md` §16) — awaiting images
- [ ] Feature flows from the PRD (`docs/design.md` §14) — awaiting PRD
