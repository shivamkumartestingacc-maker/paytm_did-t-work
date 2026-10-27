# iPhone Shell — CSS mockup for interactive prototypes

A pixel-measured, image-free iPhone shell built entirely from CSS gradients.
Any screen renders inside it at real 393 × 852 pt, clipped to the display
corners and sitting under the dynamic island — so a screen can be prototyped
once and shown as a device mockup at any size.

```bash
npm install
npm run dev            # live preview
npm run build          # static build
npm run build:single   # one self-contained HTML file in dist-single/
```

## Using it

```tsx
import { DeviceShell } from './phone/DeviceShell';
import { HomeScreen } from './screens/HomeScreen';

<DeviceShell screenTheme="light" time="9:41">
  <HomeScreen />
</DeviceShell>
```

`DeviceShell` props: `screenTheme` (`light` | `dark` — drives the status-bar
glyphs, home indicator and default backdrop), `shellTheme` (`dark` graphite
titanium | `light` polished stainless steel), `statusBar`, `time`,
`homeIndicator`, `homeIndicatorColor`, `label`, `className`.

## Exports

Three buttons sit under the device on the stage:

* **Copy image** — rasterises the live device (same DOM, same CSS) through an
  SVG `foreignObject` at 3× and puts the PNG on the clipboard. Entry animations
  are frozen first so you get the resting layout. Falls back to a download when
  the Clipboard API is unavailable.
* **Copy code** — copies one self-contained HTML document: the device markup
  plus every CSS rule, `@keyframes` included. Paste it into a file or a chat and
  the screen still works, animated, with no network requests.
* **Copy embed** — only the paste-in region: CSS scoped to `.device` plus the
  markup. Drop it inside the `<body>` of an existing page/component and the
  screen appears exactly as designed; the export never touches `html`, `body`,
  `*` or `:root`, so it cannot restyle the host page.

Verified by pasting the embed output into a deliberately hostile page (`* {
box-sizing: content-box }`, its own `:root` variables, a `body` background and
padding): the device still renders at exactly 393 × 852 pt with its animations
intact and no console errors.

See `src/export/exporters.ts` (logic) and `src/export/ExportBar.tsx` (UI).

## Prompt pack

`PROMPT.md` holds the reusable prompts for rebuilding this elsewhere: the full
master prompt (shell + screens + motion + export buttons), a short "add one
screen" prompt, and a "just add the buttons" prompt, plus the pitfalls that
usually break image export.

## How the geometry works

The reference mockup was measured pixel-by-pixel; every number below is in
points of the 393 pt virtual screen and is emitted as `--u`:

| Layer | Radius | Thickness | Colour |
|---|---|---|---|
| `.device` | 73 pt | 1.6 pt | polished titanium chamfer + dark seam |
| `.device__rim` | 71.4 pt | 4.4 pt | brushed metal band |
| `.device__bezel` | 67 pt | 11 pt | black glass |
| `.device__screen` | 56 pt | 393 × 852 | the app |

Because the whole shell is scaled by `--u`, screen content should be authored in
points too:

```css
padding: calc(16 * var(--u));   /* 16 pt, whatever the device size */
font-size: calc(17 * var(--u));
```

## Safe areas

Every screen sits under the same chrome the iPhone has:

- **54 pt** status bar (clock left, cellular / Wi-Fi / battery right)
- **34 pt** home-indicator zone at the bottom
- the dynamic island occupies the top-centre **101.5 × 36.4 pt**

The placeholder screen can draw those guides (toggle *Guides* in the stage).

## The prototype

`src/App.tsx` wires a three-screen flow for the "Perfect Month" badge concept:

```
home  ──tap "New badge unlocked" toast──▶  unlock  ──View Badge──▶  badge detail
  ▲                                          │                        │
  └──────────── "Got to Home" / "Apply ×3 boost" ─────────────────────┘
```

* **home** — budget card, badge shelf, recent activity, tab bar. A floating
  snackbar announces the badge; the earned tile opens the detail.
* **unlock** — the reference screen, measured off the mockup: badge at
  295 pt with its `×3` chip, "Perfect Month" caption, the two-line title,
  the rating card at 600 pt, the 48 pt primary pill at 702 pt, and
  "Got to Home" at 778 pt.
* **badge detail** — what the badge is, streak stats, the rules, and the
  `Apply ×3 boost` action that closes the loop back to home.

Motion: badge springs in (`cubic-bezier(.2,1.32,.3,1)`), rays scale and drift,
a specular sweep crosses the stone, confetti bursts outward, the title and copy
rise on a 80 ms stagger, and the rating sheet slides up on a 420 ms spring.
`prefers-reduced-motion` collapses all of it to a single frame.

## Files

| File | What it holds |
|---|---|
| `src/phone/DeviceShell.tsx` | Shell markup: layers, island, home indicator, gloss |
| `src/phone/StatusBar.tsx` | iOS status bar (inline SVG glyphs) |
| `src/phone/PlaceholderScreen.tsx` | The empty screen slot + safe-area guides |
| `src/styles/tokens.css` | Geometry scale (`--u`, `--device-w`) and type |
| `src/styles/device.css` | The shell, island, status bar |
| `src/styles/stage.css` | Studio backdrop, glow, stage controls |
| `src/styles/screen.css` | Placeholder screen styles |
| `src/App.tsx` | Stage + the home → unlock → detail flow |
| `src/screens/*` | The three app screens and the rating sheet |
| `src/art/BadgeGem.tsx` | The faceted SVG gem and pouch emblem |
| `src/art/Sparkles.tsx` | Rating-card sparkles, unlock confetti trail |
| `src/art/Confetti.tsx` | Deterministic CSS-transform confetti burst |
| `src/styles/prototype.css` | All screen layout + motion, in points |
| `src/export/*` | Copy-image / copy-code implementation |

To build a real screen, drop a component into `src/screens/` and pass it as
`children` of `DeviceShell`; it automatically inherits the device scale,
the display clipping and the chrome layering.
