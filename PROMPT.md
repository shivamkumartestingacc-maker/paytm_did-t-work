# Prompt pack — CSS iPhone shell + screen UI + copy buttons

Three prompts, in increasing scope. Use **A** when you want the whole thing from scratch,
**B** when you only need one more screen added to an existing shell, **C** when you only
want the two export buttons added to a working prototype.

Everything below is written against a stack of **React + TypeScript + Vite + plain CSS**
(no UI kit, no Tailwind, no animation library). Swap the framework name if you must —
keep the rest, it is what makes the output consistent.

---

## A. The master prompt

> Copy from here ⟶

**Role.** You are building a device-mockup system: one CSS-only iPhone shell plus the
app screens that live inside it, and two export buttons that let me take the screen out
as an image or as code.

**Deliverables**

1. `src/phone/DeviceShell.tsx` + `src/phone/StatusBar.tsx` — the shell.
2. `src/styles/tokens.css`, `device.css`, `stage.css` — shell, stage, tokens.
3. `src/screens/*.tsx` + `src/styles/screens.css` — the screens I describe.
4. `src/export/exporters.ts` + `src/export/ExportBar.tsx` — the two copy buttons.
5. `src/App.tsx` — the stage: device + controls.

### 1. The shell — non-negotiables

Reference geometry is the **iPhone 15 Pro: a 393 × 852 pt screen**.

| Layer | Thickness | Corner radius | Material |
|---|---|---|---|
| `.device` | 1.6 pt | 73 pt | polished titanium chamfer, dark seam at the very edge |
| `.device__rim` | 4.4 pt | 71.4 pt | brushed metal band |
| `.device__bezel` | 11 pt | 67 pt | black glass |
| `.device__screen` | — | 56 pt | the app, 393 × 852 |

- **No images, no PNG frame.** Every layer is a CSS gradient; depth comes from stacked
  `inset` shadows plus two drop shadows and an elliptical contact shadow.
- One scale variable drives everything:
  `--screen-w: min(393px, calc(100vw - 56px), calc((100svh - 216px) * 393 / 886));`
  `--u: calc(var(--screen-w) / 393);` — `--u` is **one point**. Every measurement in the
  shell and in every screen is `calc(<pt> * var(--u))`, never a raw px.
- Chrome, drawn above the screen content: status bar (clock left; cellular, Wi-Fi and
  battery as inline SVG right, 54 pt tall), dynamic island **101.5 × 36.4 pt at 10.4 pt
  from the top** with a camera lens + ambient sensor, home indicator 140 × 5 pt, and a
  barely-visible glass sheen layer (`pointer-events: none`).
- Physical buttons: mute 26 pt, volume up/down 58 pt each, power 100 pt, as thin
  gradient slivers just outside the rim.
- `DeviceShell` props: `children`, `screenTheme: 'light' | 'dark'` (drives status-bar
  glyphs, home indicator, default backdrop), `shellTheme: 'dark' | 'light'` (body finish),
  `statusBar`, `time`, `homeIndicator`, `homeIndicatorColor`, `label`.

**Two shell finishes.** `data-shell-theme="dark"` = graphite titanium with a bright
1.6 pt chamfer highlight at the top-left falling away to near-black. `data-shell-theme="light"`
= polished stainless steel: white→#a7a8b2→white chamfer, silver rim, lighter shadow, and the
stage background swaps to a light studio. Both must look intentional, not like an inverted filter.

### 2. The screens — rules

- Lay out **in points**: absolute positioning against the 393 × 852 box (`top: calc(295 * var(--u))`)
  or flex/grid with pt gaps. Never rely on the browser's default line-height for the design.
- Respect the chrome: nothing interactive under 54 pt (status bar + island) or in the last
  34 pt (home indicator).
- Content is clipped by the screen's border radius — do not add your own corner masks.
- When I give you a screenshot, **measure it**: find the screen's pixel bounds, compute
  `scale = screen_px_width / 393`, convert every element's box with `pt = px / scale`, and
  write those numbers into the CSS with a comment. Do not eyeball spacing.
- Type: system-ish stack (`Inter`, `-apple-system`, `SF Pro Text` fallback). Weights 500/600/700.
  Letter-spacing tightens as size grows (`-0.5pt` at 22 pt, `-0.1pt` at 13 pt).
- Illustrations are **inline SVG built from polygons/gradients** (facets as polygons with
  alternating white/dark overlays, emblem on a white disc). No icon fonts, no emoji, no
  exported raster assets.

### 3. Motion — the part that usually gets skipped

- Give each element its own entrance with a delay ladder (badge pop at 90 ms, chip at 520 ms,
  caption at 420 ms, title at 500 ms, copy at 600 ms, cards at 700–860 ms).
- Use spring-ish curves: `cubic-bezier(.2,1.32,.3,1)` for pops, `cubic-bezier(.22,.9,.24,1)`
  for rises, `cubic-bezier(.2,1,.3,1)` for the sheet.
- Loop only what should loop (1–2 s drifts, slow ray rotation), and animate
  `transform`/`opacity`/`rotate` so it stays on the compositor.
- One-shot flourishes are allowed: a conic-gradient ray burst that scales in, a specular
  sweep across the artwork, a 26-piece confetti burst (deterministic, index-derived).
- Always ship `@media (prefers-reduced-motion: reduce)` that collapses every animation to
  1 ms and hides confetti.
- Never use `transform-origin` tricks that leave an element visually offset in its resting state.

### 4. The two copy buttons — exact behaviour

Place them on the stage under the device (not inside the phone).

**Button 1 — “Copy image”.**
- Rasterise the **live** device element: `getBoundingClientRect()`, clone it, freeze its
  size (`width`, `height`, and `--screen-w`) so it is viewport-independent, then serialise
  `XMLSerializer`-style into
  `<svg xmlns=…><foreignObject><div xmlns="http://www.w3.org/1999/xhtml"><style>…</style>{clone}</div></foreignObject></svg>`.
- Collect CSS by walking `document.styleSheets` and concatenating `rule.cssText`, skipping
  cross-origin sheets. Append `*,*::before,*::after{animation:none!important;transition:none!important}`
  so the still frame shows the resting layout, not a mid-animation state.
- **Gotcha that will bite you:** inside the SVG, every child `<svg>` needs
  `xmlns="http://www.w3.org/2000/svg"` re-applied or the icons render as empty boxes.
- Draw the data-URL image onto a canvas at **3× device pixel ratio** and
  `canvas.toBlob('image/png')`.
- Write the blob to the clipboard via
  `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])`;
  on failure (no permission, insecure context) fall back to a download and say so.

**Button 2 — “Copy code”.**
- Same cloned device, but keep it **fluid** (`--screen-w` stays responsive).
- Output one self-contained HTML document: `<style>` with every collected rule + the cloned
  markup + a tiny `body` wrapper that centres the device on the studio backdrop.
- Include the keyframes (they come for free from `cssText`), so the recipient gets the
  artwork, the layout **and** the animation. Target size: under ~80 KB, no network requests.
- `navigator.clipboard.writeText(html)`, download fallback.

**Button 3 — “Copy embed”.**
- Same rules as button 2, but emit **only the paste-in region**: `<style>` with
  the scoped CSS plus the device markup, no `<html>`, `<head>`, `body` or page shell.
- This is what gets added to an existing web file. It must be safe to drop into
  someone else's page: scope `:root` → `.device`, `*` → `.device, .device *`,
  drop any `html` / `body` / `#root` rule, and never emit a `body` rule.
- Verify by pasting it into a page that sets its own `* { box-sizing }`, `:root`
  variables and a `body` background; the device must still land at exactly
  393 × 852 pt and keep its animations.

**All three buttons:** a `busy` state while working, an `aria-live="polite"` status line
("Screenshot copied to clipboard" / "Code copied to clipboard" / "Clipboard blocked — file
downloaded"), keep the message ~4 s, and `disabled` while a job runs.

### 5. Stage & QA

- Dark studio backdrop by default (radial glow + faint grid), swapping to a light one with
  the light shell. Device drops a contact shadow.
- Controls: `Replay <animation>`, `Reset flow`, `Dark/Light shell`.
- Must not overflow at 390 × 844 or at 1440 × 900; `document.documentElement.scrollWidth`
  must equal the viewport width.
- TypeScript strict, no `any`, no unused imports, `tsc -b` and `eslint` clean.

### 6. Sequences

Because you will judge it as a flow, not a screen: when I describe a moment (e.g. "badge
unlocked"), infer the **previous** screen (the state that led to it) and the **next** screen
(what the primary action opens), build all three, and wire real transitions — a tap that
pushes, a sheet that slides, a back that pops. State changes must persist into the other
screens (an earned badge shows as earned on home).

⟵ to here

---

## B. Adding one more screen (short version)

> You have a Working device shell (393 × 852 pt, `--u = 1pt`) with `DeviceShell`,
> `shellTheme` (dark/light) and the copy-image / copy-code buttons. Add a new screen from
> the screenshot I attached.
>
> 1. Measure the screenshot: locate the screen's pixel bounds, `scale = px_width / 393`,
>    convert each block's box and type size with `pt = px / scale`. Write the numbers into
>    the CSS as comments so I can verify.
> 2. Build it with inline SVG artwork only — no images, no icon fonts, no emoji.
> 3. Match typography: weight, tracking, and the exact line breaks visible in the reference.
> 4. Add entrance motion (staggered, spring curves) and a reduced-motion fallback.
> 5. Wire it into the existing flow at the right step, keeping state consistent.
> 6. Verify at 390 × 844 and desktop; `tsc -b` clean; then commit.

---

## C. Only the two buttons

> Add two buttons under the prototype: **Copy image** and **Copy code**.
>
> - *Copy image*: clone the live `.device` node, freeze its width/height and `--screen-w`,
>   re-apply `xmlns` on every nested `<svg>`, inline all same-origin CSS
>   (`document.styleSheets` → `cssText`) plus a rule that disables animations, wrap it in an
>   SVG `foreignObject`, rasterise through a canvas at 3× and copy the PNG blob to the
>   clipboard (`ClipboardItem`), falling back to a download.
> - *Copy code*: emit a single self-contained HTML file (all CSS including `@keyframes` + the
>   device markup, responsive `--screen-w`), copy it as text, falling back to a download.
> - Show busy / success / failure states through one `aria-live` line; disable during work.

---

## Pitfalls worth pre-empting

| Symptom | Cause | Fix |
|---|---|---|
| Exported PNG has a blank screen | nested `<svg>` lost its namespace when parsed as XML | set `xmlns` on every nested `<svg>` in the clone |
| Exported PNG is half-empty | entry animations still running at capture | append `animation:none!important` to the inlined CSS |
| Export looks tiny / wrong scale | clone kept `--screen-w` from the current viewport | freeze `width`, `height` and `--screen-w` to the measured px |
| Buttons unclickable on the stage | the stage overlay wrapper has `pointer-events: none` | re-enable it on the button group |
| Rings/rings of confetti flash on load | `animation-fill-mode` missing | use `both` on every entrance animation |
| Device clipped at the bottom | viewport reservation too small | reserve room for the caption + buttons: `100svh - 216px` |
