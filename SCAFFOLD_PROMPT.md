# Scaffold: CSS iPhone shell + screen-flow prototype + copy image / code / embed

> **How to use this document.** Paste this whole thing into a coding agent
> (Claude Code, Cursor, Codex, v0, Replit…), then say:
>
> *"Set up this scaffold exactly as given. Then I'll send you screenshots: this is screen 1, this is screen 2 — build each one inside the shell, wire the flow, and keep the three copy buttons working."*
>
> Files in §8 are the complete, compiling source. Do not "improve" the shell,
> the export logic or the flow harness — only add screens.

---

## 1. What this is

A working starter for turning a set of app screenshots into an interactive
case-study prototype: a photoreal **CSS-only iPhone shell**, a **flow harness**
that plays the screens as a navigable sequence, and three buttons that take the
result out of the browser (**copy image**, **copy code**, **copy embed**).

Stack: **React + TypeScript + Vite + plain CSS**. No UI kit, no Tailwind, no
animation library, no images.

---

## 2. Your job as the agent

1. Lay down every file in §8 verbatim (paths are given).
2. `npm install && npm run dev` — confirm the shell renders with screen 1.
3. For each screenshot I send:
   - **Measure it.** Find the screenshot's screen bounds in pixels, compute
     `scale = screen_px_width / 393`, and convert every element with
     `pt = px / scale`. Write those numbers into the CSS **as comments** so I can audit them.
   - Build it as `src/screens/ScreenX.tsx` + a section in `src/styles/screens.css`,
     laid out in points: `calc(<pt> * var(--u))`.
   - Artwork is **inline SVG** — polygons, gradients, paths. No `<img>`, no icon
     fonts, no emoji, no raster exports.
   - Match the reference's typography: weight, tracking, and its exact line breaks.
   - Add a staggered entrance (spring curves, ~60–120 ms apart) and a
     `prefers-reduced-motion: reduce` fallback.
   - Register it in `src/screens/index.ts` (one entry, in flow order) and wire
     the outgoing control with `go('<next-id>')`, headers with `back()`.
4. Infer the flow. If I only send a middle screen, build the state that leads to
   it and the state its primary action opens. State that a later screen depends
   on must persist across navigation.
5. Keep the acceptance list in §9 true, then hand back a short summary: screens
   added, measurements used, and anything you had to infer.

---

## 3. The shell — do not change these numbers

The screen is the iPhone 15 Pro: **393 × 852 pt**. Four concentric layers:

| Layer | Thickness | Corner radius | Material |
|---|---|---|---|
| `.device` | 1.6 pt | 73 pt | polished titanium chamfer + dark seam |
| `.device__rim` | 4.4 pt | 71.4 pt | brushed metal band |
| `.device__bezel` | 11 pt | 67 pt | black glass |
| `.device__screen` | — | 56 pt | the app |

- No images: every layer is a gradient; depth is stacked `inset` shadows + two
  drop shadows + an elliptical contact shadow.
- One scale variable drives everything:
  `--screen-w: min(393px, calc(100vw - 56px), calc((100svh - 216px) * 393 / 886));`
  `--u: calc(var(--screen-w) / 393);` — **`--u` is one point.** Never write raw px
  inside a screen.
- Chrome above the content: status bar (54 pt, clock + cellular/Wi-Fi/battery as
  inline SVG), dynamic island **101.5 × 36.4 pt at 10.4 pt from the top** with
  camera lens and sensor, home indicator (140 × 5 pt), glass sheen.
- `DeviceShell` props: `children`, `screenTheme`, `shellTheme` (`dark` graphite
  titanium | `light` polished stainless), `statusBar`, `time`, `homeIndicator`,
  `homeIndicatorColor`, `label`.

---

## 4. Screens: rules that keep it coherent

- Stay out of the top **54 pt** and the bottom **34 pt**.
- Layout in points, either absolute against the 393 × 852 box or flex/grid with
  pt gaps. Do not rely on the browser's default line-height.
- The screen clips content to its radius — never add your own corner mask.
- Type stack: `Inter, -apple-system, "SF Pro Text", …`; weights 500/600/700;
  tracking tightens as size grows (`-0.7 pt` at 27 pt, `-0.1 pt` at 13 pt).
- Cards: `#fff` on `#f5f5f5`, radius 24 pt, `0 1pt 2pt rgba(15,15,25,.04)` +
  `0 10pt 26pt rgba(15,15,25,.06)`.
- One accent per flow, used for the primary action, progress and small markers.

---

## 5. The flow harness (`src/app/flow.ts`, `src/App.tsx`)

- `ScreenProps` = `{ go(id), back() }` — the only way a screen navigates.
- `SCREENS` is an ordered registry of `{ id, title, note, View }`.
- The stage renders the current screen inside the shell and exposes: **Prev /
  Next / Replay / dark-light shell**, jump dots, ← → keys to step, `R` to replay.
- Direction-aware push animation (`data-dir="forward" | "back"`) so the flow
  reads like a navigation stack.
- Exports always capture the **currently visible** screen.

---

## 6. The three copy buttons (`src/export/*`)

- **Copy image** — clones the live `.device`, freezes `width`/`height`/`--screen-w`,
  re-applies `xmlns` on every nested `<svg>` (without it the icons vanish),
  inlines all same-origin CSS plus `animation: none !important` (so you capture
  the resting layout), wraps it in an SVG `foreignObject`, rasterises via canvas
  at **3×**, and writes the PNG with `ClipboardItem`. Download fallback.
- **Copy code** — one self-contained HTML document; `@keyframes` come along via
  `rule.cssText`.
- **Copy embed** — only the paste-in region: CSS **scoped** so it cannot restyle a
  host page (`:root` → `.device`, `*` → `.device, .device *`, all `html`/`body`/
  `#root` rules dropped, stage rules skipped), plus the markup. This is the one to
  hand to another project.
- All three: busy state, one `aria-live` status line, download fallback.

---

## 7. Ground rules

- Never add a dependency for animation, icons or export.
- Never use `any`; `tsc --noEmit` must stay clean.
- Never let the device collide with the controls: the caption + buttons need
  ~216 px of viewport, which is what `100svh - 216px` reserves.
- Keep `prefers-reduced-motion` honest — collapse animations to 1 ms, hide confetti.
- If a measurement is impossible to read from the screenshot, say so explicitly
  and state the value you assumed.

---

## 8. Files — create these exactly

Run them in this order: config → shell → export → flow → screens.

---


### `package.json`

```json
{
  "name": "screen-flow-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --config vite.config.ts",
    "build": "vite build --config vite.config.ts",
    "preview": "vite preview --config vite.config.ts"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "~5.6.2",
    "vite": "^5.4.10"
  }
}
```


### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Screen Flow — device prototype</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```


### `vite.config.ts`

```tsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Run with:  npx vite --config starter/vite.config.ts
// `root` is the starter folder, so this app is self-contained.
export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  plugins: [react()],
  base: './',
  server: { host: '0.0.0.0', allowedHosts: true, port: 5199 },
  preview: { host: '0.0.0.0', allowedHosts: true },
  build: { outDir: '../dist-starter', emptyOutDir: true },
});
```


### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src"]
}
```


### `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/stage.css';
import './styles/device.css';
import './styles/screens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```


### `src/vite-env.d.ts`

```tsx
/// <reference types="vite/client" />
```


### `src/App.tsx`

```tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceShell, type ShellTheme } from './phone/DeviceShell';
import { ExportBar } from './export/ExportBar';
import { SCREENS } from './screens';

type Dir = 'forward' | 'back';

/**
 * The stage: one device, the current screen from the registry, and the controls
 * (flow navigation, shell finish, copy image / code / embed).
 *
 * Screens never talk to the stage directly — they call `go(id)` / `back()`.
 */
export default function App() {
  const [history, setHistory] = useState<string[]>([SCREENS[0].id]);
  const [dir, setDir] = useState<Dir>('forward');
  const [shellTheme, setShellTheme] = useState<ShellTheme>('dark');
  const [playKey, setPlayKey] = useState(0);

  const index = SCREENS.findIndex((s) => s.id === history[history.length - 1]);
  const current = SCREENS[index] ?? SCREENS[0];

  const deviceRef = useRef<HTMLDivElement>(null);
  const getDevice = useCallback(() => deviceRef.current?.querySelector<HTMLElement>('.device') ?? null, []);

  const go = useCallback((id: string) => {
    if (!SCREENS.some((s) => s.id === id)) return;
    setDir('forward');
    setHistory((h) => [...h, id]);
  }, []);

  const back = useCallback(() => {
    setDir('back');
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }, []);

  const jump = useCallback(
    (id: string) => {
      setDir('forward');
      setHistory([id]);
    },
    [],
  );

  const step = useCallback(
    (delta: number) => {
      const next = SCREENS[(index + delta + SCREENS.length) % SCREENS.length];
      setDir(delta > 0 ? 'forward' : 'back');
      setHistory([next.id]);
    },
    [index],
  );

  // ← / → step through the flow, R replays the current screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key.toLowerCase() === 'r') setPlayKey((k) => k + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const caption = useMemo(
    () => `${current.title} · ${current.note} · screen ${index + 1} of ${SCREENS.length} · ${shellTheme} shell`,
    [current, index, shellTheme],
  );

  const View = current.View;

  return (
    <div className="stage" data-studio={shellTheme === 'light' ? 'light' : 'dark'}>
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__grid" aria-hidden="true" />

      <div className="stage__device" ref={deviceRef}>
        <DeviceShell screenTheme="light" shellTheme={shellTheme} label={`${current.title} — prototype`}>
          <div className="screens" data-dir={dir} key={`${current.id}-${playKey}`}>
            <View go={go} back={back} />
          </div>
        </DeviceShell>
      </div>

      <div className="stage__meta">
        <span className="stage__caption">{caption}</span>

        <ExportBar getTarget={getDevice} title={current.title} />

        <div className="stage__controls">
          <button type="button" className="stage__control" onClick={() => step(-1)} aria-label="Previous screen">
            ‹ Prev
          </button>
          <button type="button" className="stage__control" onClick={() => step(1)} aria-label="Next screen">
            Next ›
          </button>
          <button type="button" className="stage__control" onClick={() => setPlayKey((k) => k + 1)}>
            Replay
          </button>
          <button
            type="button"
            className="stage__control"
            aria-pressed={shellTheme === 'light'}
            onClick={() => setShellTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {shellTheme === 'dark' ? 'Dark shell' : 'Light shell'}
          </button>
        </div>

        <div className="stage__jump" role="tablist" aria-label="Screens">
          {SCREENS.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              type="button"
              aria-selected={s.id === current.id}
              aria-label={`Screen ${i + 1}: ${s.title}`}
              className="stage__jump-dot"
              onClick={() => jump(s.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```


### `src/app/flow.ts`

```tsx
import type { ComponentType } from 'react';

/** Every screen receives these. Wire taps with `go`, headers with `back`. */
export type ScreenProps = {
  /** Navigate to a screen id from the registry. */
  go: (id: string) => void;
  /** Pop the history stack. */
  back: () => void;
};

/** One entry in the flow. Add a screen = add one object here. */
export type ScreenDef = {
  id: string;
  /** Shown in the stage caption. */
  title: string;
  /** One line describing the state this screen shows. */
  note: string;
  View: ComponentType<ScreenProps>;
};
```


### `src/phone/DeviceShell.tsx`

```tsx
import type { CSSProperties, ReactNode } from 'react';
import { StatusBar } from './StatusBar';

export type ScreenTheme = 'light' | 'dark';
/** Body finish of the physical phone. */
export type ShellTheme = 'dark' | 'light';

export type DeviceShellProps = {
  /** The app screen. Rendered inside a 393 × 852 area, clipped to the display corners. */
  children?: ReactNode;
  /** Screen chrome theme — status bar glyphs, home indicator, default backdrop. */
  screenTheme?: ScreenTheme;
  /** Body finish: `dark` = graphite titanium, `light` = polished stainless steel. */
  shellTheme?: ShellTheme;
  /** Show the iOS status bar. `false` hides it for full-bleed screens. */
  statusBar?: boolean;
  /** Clock label shown in the status bar. */
  time?: string;
  /** Hide the home indicator (e.g. for a full-screen video or splash). */
  homeIndicator?: boolean;
  /** Override the home-indicator colour (some apps draw it light on light). */
  homeIndicatorColor?: string;
  className?: string;
  /** Accessible label for the device. */
  label?: string;
};

/**
 * A CSS-only iPhone shell (iPhone 15 Pro geometry: 393 × 852 pt screen).
 *
 * Every layer is a gradient — no images — and every measurement is a multiple of
 * `--u`, one point of the 393 pt virtual screen, so the device scales fluidly:
 *
 *   76 pt  outer titanium radius        2 pt  specular silver edge
 *   68 pt  black-frame radius           6 pt  brushed metal band
 *   56 pt  display radius              12 pt  black glass bezel
 *
 *   <DeviceShell><MyScreen /></DeviceShell>
 */
export function DeviceShell({
  children,
  screenTheme = 'light',
  shellTheme = 'dark',
  statusBar = true,
  time = '9:41',
  homeIndicator = true,
  homeIndicatorColor,
  className,
  label = 'iPhone prototype',
}: DeviceShellProps) {
  return (
    <div
      className={`device${className ? ` ${className}` : ''}`}
      data-shell-theme={shellTheme}
      role="group"
      aria-label={label}
    >
      {/* physical side buttons */}
      <span className="device__btn device__btn--mute" aria-hidden="true" />
      <span className="device__btn device__btn--vol-up" aria-hidden="true" />
      <span className="device__btn device__btn--vol-down" aria-hidden="true" />
      <span className="device__btn device__btn--power" aria-hidden="true" />

      <div className="device__rim">
        <div className="device__bezel">
          <div
            className="device__screen"
            data-screen-theme={screenTheme}
            style={homeIndicatorColor ? ({ '--home-indicator': homeIndicatorColor } as CSSProperties) : undefined}
          >
            <div className="device__content">{children}</div>

            {statusBar && <StatusBar time={time} tone={screenTheme === 'light' ? 'dark' : 'light'} />}

            <div className="device__island" aria-hidden="true">
              <span className="device__island-lens" />
              <span className="device__island-sensor" />
            </div>

            {homeIndicator && <div className="device__home" aria-hidden="true" />}
            <div className="device__gloss" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
```


### `src/phone/StatusBar.tsx`

```tsx
type Tone = 'dark' | 'light';

export type StatusBarProps = {
  /** Clock label, iOS style. */
  time?: string;
  /** `dark` = dark glyphs on a light screen, `light` = light glyphs on a dark screen. */
  tone?: Tone;
  className?: string;
};

/**
 * iOS status bar: clock on the left, cellular / Wi‑Fi / battery on the right.
 * Sits above screen content and is drawn from the same CSS unit scale as the
 * shell, so it stays proportional at any device size.
 */
export function StatusBar({ time = '9:41', tone = 'dark', className }: StatusBarProps) {
  return (
    <div className={`status-bar status-bar--${tone}${className ? ` ${className}` : ''}`}>
      <span className="status-bar__time">{time}</span>
      <span className="status-bar__icons">
        <svg className="status-bar__icon status-bar__icon--cell" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg className="status-bar__icon status-bar__icon--wifi" viewBox="0 0 16 12" aria-hidden="true">
          <path
            d="M8 11.2 5.55 8.42a3.72 3.72 0 0 1 4.9 0L8 11.2Z"
            fill="currentColor"
          />
          <path
            d="M8 6.05c-1.42 0-2.72.52-3.72 1.38L2.86 5.9A7.44 7.44 0 0 1 8 3.95c1.94 0 3.73.74 5.14 1.95l-1.42 1.53A5.5 5.5 0 0 0 8 6.05Z"
            fill="currentColor"
          />
          <path
            d="M8 1.85a9.3 9.3 0 0 1 6.5 2.6L13.1 5.9A7.1 7.1 0 0 0 8 3.95a7.1 7.1 0 0 0-5.1 1.95L1.5 4.45a9.3 9.3 0 0 1 6.5-2.6Z"
            fill="currentColor"
          />
        </svg>
        <svg className="status-bar__icon status-bar__icon--battery" viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2.2" y="2.2" width="18.6" height="8.6" rx="2.2" fill="currentColor" />
          <path d="M24 4.4c1.1.35 1.1 3.85 0 4.2V4.4Z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}
```


### `src/export/exporters.ts`

```tsx
/**
 * Export helpers — no dependencies.
 *
 * • `snapshotPng` rasterises the live device DOM with an SVG `foreignObject`,
 *   so the exported image is the real prototype, not a redraw.
 * • `buildStandaloneHtml` returns one self-contained HTML file: the device
 *   markup plus every same-origin CSS rule, animations included.
 */

/**
 * Walk every same-origin stylesheet and return the rules, scoped so the result
 * can live inside someone else's page:
 *   · `html` / `body` / `#root` page-level rules are dropped
 *   · `*` becomes `.device, .device *` (no global box-sizing leaks)
 *   · `:root` becomes `.device`, so the design tokens never override the host's
 *   · stage/export chrome is skipped — it is not part of the screen
 */
/** Every rule, unscoped — used for the image, whose clone has its own document. */
function collectAllCss(): string {
  const out: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) out.push(rule.cssText);
    } catch {
      continue;
    }
  }
  return out.join('\n');
}

function collectScopedCss(): string {
  const out: string[] = [];

  const scopeSelector = (selector: string): string | null => {
    const head = selector.trim();
    if (!head) return null;
    if (/^(html|body|#root)$/i.test(head)) return null;
    if (/^\.(stage|export)(__|\b)/.test(head)) return null;
    if (head === ':root') return '.device';
    if (head === '*') return '.device, .device *';
    return head;
  };

  const visit = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        const selectors = rule.selectorText.split(',').map(scopeSelector).filter(Boolean) as string[];
        if (!selectors.length) continue;
        let body = rule.style.cssText;
        if (rule.selectorText.trim() === ':root') {
          // drop the host-affecting declarations, keep the tokens
          body = body
            .split(';')
            .filter((decl) => !/^\s*color-scheme\s*:/i.test(decl))
            .join(';');
        }
        out.push(`${selectors.join(',')} { ${body} }`);
        continue;
      }
      // media / supports blocks recurse; keyframes are copied verbatim
      if ('cssRules' in rule && !(rule instanceof CSSKeyframesRule)) {
        const inner = collectFrom((rule as CSSGroupingRule).cssRules);
        if (inner.trim()) {
          const prelude = rule.cssText.slice(0, rule.cssText.indexOf('{')).trim();
          out.push(`${prelude} {\n${inner}\n}`);
        }
        continue;
      }
      out.push(rule.cssText);
    }
  };

  const collectFrom = (rules: CSSRuleList): string => {
    const before = out.length;
    visit(rules);
    return out.slice(before).join('\n');
  };

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | null = null;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin (Google Fonts) — the font stack covers it
    }
    if (rules) visit(rules);
  }

  return out.join('\n');
}

const FONT_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com" />' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />';

/**
 * Fallback scale, used only if the responsive formula cannot be read back out of
 * the collected CSS. The live value is always taken from the stylesheet, so the
 * export can never drift from `tokens.css`.
 */
const RESPONSIVE_SCREEN_W = 'min(393px, calc(100vw - 56px), calc((100svh - 216px) * 393 / 886))';

/**
 * Deep clone of the device with the responsive scale resolved.
 * `mode: 'image'` freezes exact pixel dimensions (a still frame);
 * `mode: 'html'` keeps the pt-based scale so the export stays fluid.
 */
function cloneDevice(device: HTMLElement, mode: 'image' | 'html', screenW = RESPONSIVE_SCREEN_W): HTMLElement {
  const clone = device.cloneNode(true) as HTMLElement;
  const cs = getComputedStyle(device);
  const current = clone.getAttribute('style') ?? '';
  const style =
    mode === 'image'
      ? `width:${cs.width};height:${cs.height};--screen-w:${cs.getPropertyValue('--screen-w').trim() || cs.width}`
      : `--screen-w:${screenW}`;
  clone.setAttribute('style', `${current};${style};`);

  if (mode === 'image') {
    // The SVG is parsed as XML, so inline <svg> children need the namespace
    // spelled out or the renderer treats them as unknown HTML elements.
    clone.querySelectorAll('svg').forEach((svg) => svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg'));
  }

  return clone;
}

/** Rasterise the device at `scale`× and return a PNG blob. */
export async function snapshotPng(device: HTMLElement, scale = 3): Promise<Blob> {
  const rect = device.getBoundingClientRect();
  const clone = cloneDevice(device, 'image');
  // A still frame: skip entry animations so the resting layout is drawn.
  const css = `${collectAllCss()}\n*, *::before, *::after { animation: none !important; transition: none !important; }`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${rect.width}px;height:${rect.height}px">
      <style>${css}</style>
      ${clone.outerHTML}
    </div>
  </foreignObject>
</svg>`;

  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  const img = new Image();
  img.decoding = 'sync';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Could not rasterise the device'));
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode PNG'))), 'image/png'),
  );
}

/** The device at its current scale, ready to be pasted into any page. */
function buildParts(device: HTMLElement) {
  const css = collectScopedCss();
  // keep the exported scale identical to the one the app is using right now
  const fluid = css.match(/--screen-w:\s*([^;]+);/)?.[1].trim() || RESPONSIVE_SCREEN_W;
  const clone = cloneDevice(device, 'html', fluid);
  return { css, markup: clone.outerHTML };
}

/**
 * Just the embeddable region: scoped CSS + device markup.
 * This is the thing to drop into an existing page or component — it does not
 * touch `html`, `body`, `*`, `:root`, and needs no build step.
 */
export function buildEmbed(device: HTMLElement): string {
  const { css, markup } = buildParts(device);
  return `<!-- iPhone shell + screen · self-contained. Paste inside <body>. -->
<style>
/* scoped: tokens live on .device, not :root */
${css}
.device { margin: 0; }
</style>
${markup}`;
}

/** The full HTML document for the current screen (animation included). */
export function buildStandaloneHtml(device: HTMLElement, title: string): string {
  const { css, markup } = buildParts(device);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
${FONT_LINK}
<style>
/* ── PASTE-IN START ────────────────────────────────────────────────────
   Everything down to "PASTE-IN END" is self-contained: the markup at the
   bottom of this file plus these rules. The design tokens live on .device,
   not :root, so this block cannot affect the page it lands in.
   ───────────────────────────────────────────────────────────────────── */
${css}

/* block layout when embedded in a host page (no centering) */
.device { margin: 0; }
/* ── PASTE-IN END ────────────────────────────────────────────────────── */

/* standalone page shell only — do NOT copy this part */
body {
  margin: 0;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(120% 90% at 50% -10%, #24252e 0%, #14151a 46%, #0a0a0c 100%), #0f0f12;
}
</style>
</head>
<body>
${markup}
</body>
</html>`;
}

export type CopyResult = 'copied' | 'downloaded';

/** Copy the device as a PNG; falls back to a download when the Clipboard API is unavailable. */
export async function copyImage(device: HTMLElement, filename = 'screen.png'): Promise<CopyResult> {
  const blob = await snapshotPng(device);
  try {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') throw new Error('no clipboard');
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return 'copied';
  } catch {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return 'downloaded';
  }
}

async function copyText(text: string, filename: string): Promise<CopyResult> {
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/html' }));
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return 'downloaded';
  }
}

/** Copy the self-contained HTML document for the device. */
export function copyCode(device: HTMLElement, title = 'screen'): Promise<CopyResult> {
  return copyText(buildStandaloneHtml(device, title), `${title.replace(/\s+/g, '-').toLowerCase()}.html`);
}

/** Copy only the paste-in region (scoped CSS + markup) for embedding elsewhere. */
export function copyEmbed(device: HTMLElement, title = 'screen'): Promise<CopyResult> {
  return copyText(buildEmbed(device), `${title.replace(/\s+/g, '-').toLowerCase()}-embed.html`);
}
```


### `src/export/ExportBar.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { copyCode, copyEmbed, copyImage, type CopyResult } from './exporters';

export type ExportBarProps = {
  /** Returns the device element to capture. */
  getTarget: () => HTMLElement | null;
  /** Used for the exported file name / document title. */
  title: string;
};

type Job = 'image' | 'code' | 'embed';
type Status =
  | { kind: 'idle' }
  | { kind: 'busy'; what: Job }
  | { kind: 'done'; what: Job; result: CopyResult }
  | { kind: 'error'; message: string };

const BUSY: Record<Job, string> = {
  image: 'Rendering PNG…',
  code: 'Packing HTML…',
  embed: 'Packing embed…',
};

const DONE: Record<Job, Record<CopyResult, string>> = {
  image: { copied: 'Screenshot copied to clipboard', downloaded: 'Clipboard blocked — PNG downloaded' },
  code: { copied: 'Single-file HTML copied', downloaded: 'Clipboard blocked — HTML downloaded' },
  embed: { copied: 'Embed copied — paste into any page', downloaded: 'Clipboard blocked — embed downloaded' },
};

/**
 * Two actions:
 *   Copy image → PNG of the device (3×), straight to the clipboard.
 *   Copy code  → one self-contained HTML file with the markup and every CSS rule.
 */
export function ExportBar({ getTarget, title }: ExportBarProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const announce = useCallback((next: Status) => {
    setStatus(next);
    if (timer.current) window.clearTimeout(timer.current);
    if (next.kind === 'done' || next.kind === 'error') {
      timer.current = window.setTimeout(() => setStatus({ kind: 'idle' }), 4200);
    }
  }, []);

  const run = useCallback(
    async (what: Job) => {
      const target = getTarget();
      if (!target) return;
      announce({ kind: 'busy', what });
      try {
        const result =
          what === 'image'
            ? await copyImage(target, `${title.replace(/\s+/g, '-').toLowerCase()}.png`)
            : what === 'code'
              ? await copyCode(target, title)
              : await copyEmbed(target, title);
        announce({ kind: 'done', what, result });
      } catch (err) {
        announce({ kind: 'error', message: err instanceof Error ? err.message : 'Export failed' });
      }
    },
    [announce, getTarget, title],
  );

  const message =
    status.kind === 'busy'
      ? BUSY[status.what]
      : status.kind === 'done'
        ? DONE[status.what][status.result]
        : status.kind === 'error'
          ? status.message
          : '';

  return (
    <div className="export">
      <div className="export__group">
        <button className="export__btn export__btn--primary" type="button" onClick={() => run('image')} disabled={status.kind === 'busy'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M6.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5" />
          </svg>
          Copy image
        </button>

        <button className="export__btn" type="button" onClick={() => run('code')} disabled={status.kind === 'busy'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 17-5-5 5-5m6 10 5-5-5-5" />
          </svg>
          Copy code
        </button>

        <button
          className="export__btn"
          type="button"
          onClick={() => run('embed')}
          disabled={status.kind === 'busy'}
          title="Just the scoped CSS + markup, ready to paste into an existing page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 5h16v14H4z" />
            <path d="M9 5v14M4 10h5" />
          </svg>
          Copy embed
        </button>
      </div>

      <span className={`export__status${status.kind === 'error' ? ' export__status--error' : ''}`} role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
```


### `src/styles/tokens.css`

```css
:root {
  color-scheme: dark;

  /* Geometry, derived from the reference mockup (screen = 393 × 852 pt):
       screen radius 56pt · frame 17pt · outer radius 73pt
       device = 427 × 886 pt                                          */
  --screen-w: min(393px, calc(100vw - 56px), calc((100svh - 216px) * 393 / 886));
  --u: calc(var(--screen-w) / 393);
  --device-w: calc(var(--screen-w) * 427 / 393);
  --device-h: calc(var(--screen-w) * 886 / 393);

  /* Shell materials */
  --titanium-hi: rgba(255, 255, 255, 0.7);
  --titanium-body: #0c0d11;

  /* Studio backdrop */
  --studio-bg: #0f0f12;
  --studio-glow: rgba(132, 146, 200, 0.26);

  --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
  --font-round: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
}

body {
  margin: 0;
  background: var(--studio-bg);
  color: #f5f5f7;
  font-family: var(--font-ui);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow: hidden;
}

button {
  font: inherit;
  color: inherit;
}
```


### `src/styles/device.css`

```css
/* ── The physical device ────────────────────────────────────────────────
   Four concentric layers, outside → in, traced from the reference mockup:

     .device        1.6 pt specular silver edge      radius 73 pt
     .device__rim   4.4 pt brushed metal band        radius 71.4 pt
     .device__bezel 11 pt black glass frame          radius 67 pt
     .device__screen 393 × 852 display               radius 56 pt

   Every measurement is an `--u` (1 pt of the 393 pt screen), so the shell
   scales with the viewport and screens can be laid out in "points".
   ─────────────────────────────────────────────────────────────────────── */

.device {
  position: relative;
  width: var(--device-w);
  height: var(--device-h);
  border-radius: calc(73 * var(--u));
  padding: calc(1.6 * var(--u));
  /* polished titanium chamfer: bright top-left, dimmer bottom-right */
  background-image: linear-gradient(
    150deg,
    #ffffff 0%,
    #ded9e1 10%,
    #a8a3ac 24%,
    #7b7781 40%,
    #585560 56%,
    #6e6a75 72%,
    #9a95a0 86%,
    #ddd8e0 100%
  );
  box-shadow:
    /* dark seam at the very edge */
    inset 0 0 0 calc(0.5 * var(--u)) rgba(8, 5, 10, 0.9),
    inset 0 0 calc(1.2 * var(--u)) rgba(0, 0, 0, 0.55),
    /* drop shadow */
    0 calc(26 * var(--u)) calc(60 * var(--u)) calc(-14 * var(--u)) rgba(0, 0, 0, 0.8),
    0 calc(8 * var(--u)) calc(22 * var(--u)) rgba(0, 0, 0, 0.55),
    0 0 calc(1 * var(--u)) rgba(0, 0, 0, 0.9);
  isolation: isolate;
}

/* contact shadow on the studio floor */
.device::after {
  content: '';
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: calc(-18 * var(--u));
  height: calc(30 * var(--u));
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.62), transparent);
  filter: blur(calc(7 * var(--u)));
  z-index: -1;
}

/* ── light finish: polished stainless steel ───────────────────────────── */

.device[data-shell-theme='light'] {
  background-image: linear-gradient(
    150deg,
    #ffffff 0%,
    #f7f6f9 10%,
    #e2e2e8 22%,
    #c3c4cc 38%,
    #a7a8b2 54%,
    #c0c0c9 70%,
    #e0e0e6 86%,
    #fbfafc 100%
  );
  box-shadow:
    inset 0 0 0 calc(0.5 * var(--u)) rgba(60, 60, 70, 0.55),
    inset 0 0 calc(1.2 * var(--u)) rgba(0, 0, 0, 0.25),
    0 calc(26 * var(--u)) calc(60 * var(--u)) calc(-14 * var(--u)) rgba(0, 0, 0, 0.35),
    0 calc(8 * var(--u)) calc(22 * var(--u)) rgba(0, 0, 0, 0.22);
}

.device[data-shell-theme='light'] .device__rim {
  background-image: linear-gradient(
    152deg,
    #fdfdfe 0%,
    #ececf1 16%,
    #d2d3da 36%,
    #bcbdc6 56%,
    #d5d5dc 78%,
    #f4f3f7 100%
  );
  box-shadow:
    inset 0 0 0 calc(0.4 * var(--u)) rgba(255, 255, 255, 0.75),
    inset 0 0 calc(2 * var(--u)) rgba(0, 0, 0, 0.28);
}

.device[data-shell-theme='light'] .device__btn {
  background-image: linear-gradient(90deg, #f2f2f5 0%, #c2c3cb 48%, #8f909a 100%);
  box-shadow:
    inset 0 0 0 calc(0.4 * var(--u)) rgba(255, 255, 255, 0.7),
    calc(-1 * var(--u)) calc(1 * var(--u)) calc(2 * var(--u)) rgba(0, 0, 0, 0.28);
}

.device[data-shell-theme='light'] .device__btn--power {
  background-image: linear-gradient(270deg, #f2f2f5 0%, #c2c3cb 48%, #8f909a 100%);
}

.device[data-shell-theme='light'] .device__bezel {
  background: #101116;
  box-shadow:
    inset calc(0.6 * var(--u)) calc(0.6 * var(--u)) calc(2 * var(--u)) rgba(255, 255, 255, 0.12),
    inset 0 calc(1.5 * var(--u)) calc(6 * var(--u)) rgba(0, 0, 0, 0.9);
}

.device[data-shell-theme='light']::after {
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.3), transparent);
}

/* ── brushed metal band, lit from the top-left ────────────────────────── */

.device__rim {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(71.4 * var(--u));
  padding: calc(4.4 * var(--u));
  background-image:
    linear-gradient(
      152deg,
      #3e3c45 0%,
      #24222b 18%,
      #141318 40%,
      #100f16 60%,
      #1a1921 80%,
      #302e37 100%
    );
  box-shadow:
    inset 0 0 0 calc(0.4 * var(--u)) rgba(255, 255, 255, 0.1),
    inset 0 0 calc(2 * var(--u)) rgba(0, 0, 0, 0.75);
}

/* ── side buttons ─────────────────────────────────────────────────────── */

.device__btn {
  position: absolute;
  width: calc(2.2 * var(--u));
  border-radius: calc(1.4 * var(--u));
  background-image: linear-gradient(90deg, #565761 0%, #23242c 50%, #0d0e13 100%);
  box-shadow:
    inset 0 0 0 calc(0.4 * var(--u)) rgba(255, 255, 255, 0.16),
    calc(-1 * var(--u)) calc(1 * var(--u)) calc(2 * var(--u)) rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.device__btn--mute {
  left: calc(-1 * var(--u));
  top: calc(158 * var(--u));
  height: calc(26 * var(--u));
}

.device__btn--vol-up {
  left: calc(-1 * var(--u));
  top: calc(208 * var(--u));
  height: calc(58 * var(--u));
}

.device__btn--vol-down {
  left: calc(-1 * var(--u));
  top: calc(282 * var(--u));
  height: calc(58 * var(--u));
}

.device__btn--power {
  right: calc(-1 * var(--u));
  top: calc(222 * var(--u));
  height: calc(100 * var(--u));
  background-image: linear-gradient(270deg, #565761 0%, #23242c 50%, #0d0e13 100%);
}

/* ── black glass frame ────────────────────────────────────────────────── */

.device__bezel {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(67 * var(--u));
  padding: calc(11 * var(--u));
  background: #000;
  box-shadow:
    /* faint top-left bevel catch */
    inset calc(0.6 * var(--u)) calc(0.6 * var(--u)) calc(2 * var(--u)) rgba(255, 255, 255, 0.07),
    inset 0 calc(1.5 * var(--u)) calc(6 * var(--u)) rgba(0, 0, 0, 0.9);
}

/* ── display ──────────────────────────────────────────────────────────── */

.device__screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: calc(56 * var(--u));
  overflow: hidden;
  background: var(--screen-bg, #fff);
  color: var(--screen-ink, #0b0b0f);
  isolation: isolate;
}

.device__screen[data-screen-theme='dark'] {
  --screen-bg: #05060a;
  --screen-ink: #f6f7fb;
  --home-indicator: rgba(255, 255, 255, 0.92);
}

.device__screen[data-screen-theme='light'] {
  --screen-bg: #ffffff;
  --screen-ink: #0b0b0f;
  --home-indicator: rgba(8, 8, 12, 0.85);
}

.device__content {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

/* ── dynamic island ───────────────────────────────────────────────────── */

.device__island {
  position: absolute;
  top: calc(10.4 * var(--u));
  left: 50%;
  transform: translateX(-50%);
  width: calc(101.5 * var(--u));
  height: calc(36.4 * var(--u));
  border-radius: calc(18.4 * var(--u));
  background: #000;
  z-index: 5;
}

/* front camera behind the glass */
.device__island-lens {
  position: absolute;
  right: calc(1.9 * var(--u));
  top: 50%;
  transform: translateY(-50%);
  width: calc(10.4 * var(--u));
  height: calc(10.4 * var(--u));
  border-radius: 50%;
  background: radial-gradient(circle at 66% 34%, #2d3f86 0%, #131c46 30%, #05071a 62%, #02030a 84%);
  box-shadow: inset 0 0 calc(1.2 * var(--u)) rgba(110, 140, 255, 0.35);
}

.device__island-lens::after {
  content: '';
  position: absolute;
  inset: calc(2.4 * var(--u));
  border-radius: 50%;
  background: radial-gradient(circle at 36% 28%, rgba(160, 190, 255, 0.5), transparent 58%);
}

/* ambient light sensor */
.device__island-sensor {
  position: absolute;
  right: calc(16 * var(--u));
  top: 50%;
  transform: translateY(-50%);
  width: calc(3 * var(--u));
  height: calc(3 * var(--u));
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #2a2e39, #05060a 72%);
}

/* ── home indicator ───────────────────────────────────────────────────── */

.device__home {
  position: absolute;
  left: 50%;
  bottom: calc(8 * var(--u));
  transform: translateX(-50%);
  width: calc(140 * var(--u));
  height: calc(5 * var(--u));
  border-radius: calc(3 * var(--u));
  background: var(--home-indicator, rgba(8, 8, 12, 0.85));
  z-index: 6;
  pointer-events: none;
}

/* ── glass sheen ──────────────────────────────────────────────────────── */

.device__gloss {
  position: absolute;
  inset: 0;
  z-index: 7;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(118deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.012) 22%, transparent 42%),
    radial-gradient(120% 60% at 100% 0%, rgba(255, 255, 255, 0.03), transparent 60%);
}

/* ── status bar ───────────────────────────────────────────────────────── */

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(54 * var(--u));
  padding: 0 calc(30 * var(--u)) 0 calc(34 * var(--u));
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 4;
  pointer-events: none;
  font-family: var(--font-round);
}

.status-bar__time {
  font-size: calc(16.5 * var(--u));
  font-weight: 600;
  letter-spacing: calc(0.1 * var(--u));
  /* optically centred against the taller icon cluster */
  margin-top: calc(2 * var(--u));
}

.status-bar__icons {
  display: flex;
  align-items: center;
  gap: calc(6 * var(--u));
  margin-top: calc(1 * var(--u));
}

.status-bar__icon {
  display: block;
  color: currentColor;
}

.status-bar__icon--cell {
  width: calc(18 * var(--u));
  height: calc(12 * var(--u));
}

.status-bar__icon--wifi {
  width: calc(16 * var(--u));
  height: calc(12 * var(--u));
}

.status-bar__icon--battery {
  width: calc(27 * var(--u));
  height: calc(13 * var(--u));
}

.status-bar--dark {
  color: #000;
}

.status-bar--light {
  color: #fff;
}
```


### `src/styles/stage.css`

```css
.stage {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 20px;
  background:
    radial-gradient(120% 90% at 50% -10%, #24252e 0%, #14151a 46%, #0a0a0c 100%),
    var(--studio-bg);
  overflow: hidden;
}

/* ambient light behind the device */
.stage__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -54%);
  width: calc(var(--device-w) * 1.55);
  height: calc(var(--device-w) * 1.55);
  border-radius: 50%;
  background: radial-gradient(closest-side, var(--studio-glow), transparent 72%);
  filter: blur(calc(var(--device-w) * 0.07));
  pointer-events: none;
}

/* faint grid so screens can be judged against straight edges */
.stage__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(70% 60% at 50% 50%, #000 0%, transparent 100%);
  pointer-events: none;
}

.stage__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.stage__caption {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.34);
}

.stage__controls {
  pointer-events: auto;
  display: flex;
  gap: 6px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(20, 21, 26, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.11);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

.stage__control {
  appearance: none;
  border: 0;
  background: transparent;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.62);
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease;
}

.stage__control:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.07);
}

.stage__control[aria-pressed='true'] {
  color: #0a0a0c;
  background: #f2f2f5;
}

.stage__control:focus-visible {
  outline: 2px solid #7c9bff;
  outline-offset: 2px;
}

@media (max-width: 560px) {
  .stage {
    padding: 10px;
    gap: 10px;
  }

  .stage__caption {
    display: none;
  }
}

/* ── device wrapper (also the capture target) ─────────────────────────── */

.stage__device {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* light studio for the light shell */
.stage[data-studio='light'] {
  background:
    radial-gradient(120% 90% at 50% -10%, #fdfdff 0%, #eef0f4 46%, #e3e5ea 100%),
    #eaecef;
}

.stage[data-studio='light'] .stage__grid {
  background-image:
    linear-gradient(rgba(20, 24, 40, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 24, 40, 0.05) 1px, transparent 1px);
}

.stage[data-studio='light'] .stage__glow {
  background: radial-gradient(closest-side, rgba(140, 150, 200, 0.22), transparent 72%);
}

.stage[data-studio='light'] .stage__caption {
  color: rgba(24, 26, 38, 0.42);
}

.stage[data-studio='light'] .stage__controls,
.stage[data-studio='light'] .export__group {
  background: rgba(255, 255, 255, 0.78);
  border-color: rgba(20, 24, 40, 0.1);
}

.stage[data-studio='light'] .stage__control {
  color: rgba(24, 26, 38, 0.66);
}

.stage[data-studio='light'] .stage__control:hover {
  color: #0a0a0c;
  background: rgba(20, 24, 40, 0.06);
}

.stage[data-studio='light'] .stage__control[aria-pressed='true'] {
  color: #f7f7fa;
  background: #16171c;
}

/* ── export bar ───────────────────────────────────────────────────────── */

.export {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  pointer-events: none;
}

.export__group {
  pointer-events: auto;
  display: flex;
  gap: 4px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(20, 21, 26, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.11);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.export__btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  border-radius: 999px;
  padding: 8px 15px;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, opacity 160ms ease;
}

.export__btn svg {
  width: 15px;
  height: 15px;
}

.export__btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
}

.export__btn--primary {
  background: #f2f2f5;
  color: #0b0b0e;
}

.export__btn--primary:hover:not(:disabled) {
  background: #ffffff;
  color: #0b0b0e;
}

.export__btn:disabled {
  opacity: 0.55;
  cursor: progress;
}

.export__btn:focus-visible {
  outline: 2px solid #7c9bff;
  outline-offset: 2px;
}

.export__status {
  min-height: 15px;
  font-size: 11px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.55);
}

.export__status--error {
  color: #ff9c8a;
}

.stage[data-studio='light'] .export__btn {
  color: rgba(24, 26, 38, 0.7);
}

.stage[data-studio='light'] .export__btn--primary {
  background: #16171c;
  color: #f7f7fa;
}

.stage[data-studio='light'] .export__btn--primary:hover:not(:disabled) {
  background: #000;
  color: #fff;
}

.stage[data-studio='light'] .export__status {
  color: rgba(24, 26, 38, 0.5);
}

.stage[data-studio='light'] .export__status--error {
  color: #b03a26;
}

@media (max-width: 560px) {
  .export__btn {
    padding: 7px 12px;
    font-size: 11px;
  }

  .export__status {
    display: none;
  }
}

/* ── screen jump dots ─────────────────────────────────────────────────── */

.stage__jump {
  pointer-events: auto;
  display: flex;
  gap: 6px;
  align-items: center;
}

.stage__jump-dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}

.stage__jump-dot:hover {
  background: rgba(255, 255, 255, 0.5);
}

.stage__jump-dot[aria-selected='true'] {
  background: #fff;
  transform: scale(1.35);
}

.stage[data-studio='light'] .stage__jump-dot {
  background: rgba(20, 24, 40, 0.22);
}

.stage[data-studio='light'] .stage__jump-dot[aria-selected='true'] {
  background: #16171c;
}
```


### `src/styles/screens.css`

```css
/* ───────────────────────────────────────────────────────────────────────
   Screen styles. Every number is points of the 393 × 852 screen:
   calc(<pt> * var(--u)).
   ─────────────────────────────────────────────────────────────────────── */

.screens {
  position: absolute;
  inset: 0;
  background: #f5f5f5;
}

.scr {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  color: #0a0a0b;
  font-family: var(--font-ui);
  -webkit-user-select: none;
  user-select: none;
  animation: scr-fade 320ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

/* direction-aware push, so the flow reads like a navigation stack */
.screens[data-dir='forward'] .scr {
  animation-name: push-from-right;
}

.screens[data-dir='back'] .scr {
  animation-name: push-from-left;
}

@keyframes scr-fade {
  from {
    opacity: 0;
    transform: scale(0.995);
  }
}

@keyframes push-from-right {
  from {
    opacity: 0.4;
    transform: translateX(calc(26 * var(--u)));
  }
}

@keyframes push-from-left {
  from {
    opacity: 0.4;
    transform: translateX(calc(-26 * var(--u)));
  }
}

/* shared atoms --------------------------------------------------------- */

.pill {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: calc(50 * var(--u));
  border: 0;
  border-radius: calc(25 * var(--u));
  background: #17171a;
  color: #fff;
  font-size: calc(15 * var(--u));
  font-weight: 600;
  letter-spacing: calc(-0.1 * var(--u));
  cursor: pointer;
  transition: transform 160ms cubic-bezier(0.3, 0.9, 0.3, 1), background 160ms ease;
}

.pill:hover {
  background: #000;
}

.pill:active {
  transform: scale(0.975);
}

.text-btn {
  border: 0;
  background: none;
  height: calc(34 * var(--u));
  font-size: calc(14 * var(--u));
  font-weight: 600;
  color: #2a2a2f;
  cursor: pointer;
  transition: opacity 160ms ease;
}

.text-btn:hover {
  opacity: 0.6;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: calc(34 * var(--u));
  height: calc(34 * var(--u));
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: #17171a;
  cursor: pointer;
  box-shadow: 0 calc(1 * var(--u)) calc(2 * var(--u)) rgba(15, 15, 25, 0.06);
  transition: transform 160ms ease;
}

.icon-btn:active {
  transform: scale(0.94);
}

.icon-btn svg {
  width: calc(18 * var(--u));
  height: calc(18 * var(--u));
}

.pill:focus-visible,
.text-btn:focus-visible,
.icon-btn:focus-visible {
  outline: calc(2 * var(--u)) solid #5b6cff;
  outline-offset: calc(2 * var(--u));
}

/* SCREEN A — hero + two actions ---------------------------------------- */

.scr--a {
  padding: calc(54 * var(--u)) calc(24 * var(--u)) calc(34 * var(--u));
  justify-content: center;
}

.a__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: calc(10 * var(--u));
}

.a__badge {
  width: calc(84 * var(--u));
  height: calc(84 * var(--u));
  border-radius: calc(26 * var(--u));
  display: grid;
  place-items: center;
  background: #fff;
  box-shadow:
    0 calc(2 * var(--u)) calc(4 * var(--u)) rgba(15, 15, 25, 0.05),
    0 calc(16 * var(--u)) calc(38 * var(--u)) rgba(15, 15, 25, 0.12);
  animation: pop-in 620ms 40ms cubic-bezier(0.2, 1.3, 0.3, 1) both;
}

.a__badge svg {
  width: calc(48 * var(--u));
  height: calc(48 * var(--u));
}

@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.6) translateY(calc(8 * var(--u)));
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.a__title {
  margin: 0;
  font-size: calc(27 * var(--u));
  font-weight: 700;
  letter-spacing: calc(-0.7 * var(--u));
  animation: rise-in 520ms 120ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

.a__body {
  margin: 0;
  max-width: calc(300 * var(--u));
  font-size: calc(14 * var(--u));
  line-height: calc(21 * var(--u));
  color: #6b6b70;
  animation: rise-in 520ms 200ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(calc(10 * var(--u)));
  }
}

.a__actions {
  display: flex;
  flex-direction: column;
  gap: calc(8 * var(--u));
  margin-top: calc(30 * var(--u));
  animation: rise-in 520ms 280ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

/* SCREEN B — header + summary card + list ------------------------------ */

.scr--b {
  padding: calc(58 * var(--u)) calc(20 * var(--u)) calc(34 * var(--u));
  gap: calc(16 * var(--u));
}

.b__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.b__crumb {
  font-size: calc(13 * var(--u));
  font-weight: 600;
  color: #6b6b70;
}

.b__spacer {
  width: calc(34 * var(--u));
}

.b__card {
  padding: calc(16 * var(--u));
  border-radius: calc(24 * var(--u));
  background: #fff;
  box-shadow:
    0 calc(1 * var(--u)) calc(2 * var(--u)) rgba(15, 15, 25, 0.04),
    0 calc(10 * var(--u)) calc(26 * var(--u)) rgba(15, 15, 25, 0.06);
  animation: rise-in 520ms 60ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

.b__label {
  margin: 0;
  font-size: calc(12.5 * var(--u));
  font-weight: 500;
  color: #7b7b81;
}

.b__value {
  margin: calc(6 * var(--u)) 0 0;
  font-size: calc(28 * var(--u));
  font-weight: 700;
  letter-spacing: calc(-0.9 * var(--u));
}

.b__value span {
  font-size: calc(13 * var(--u));
  font-weight: 500;
  color: #8a8a90;
  letter-spacing: 0;
}

.b__bar {
  height: calc(7 * var(--u));
  margin-top: calc(12 * var(--u));
  border-radius: 999px;
  background: #eeeef1;
  overflow: hidden;
}

.b__bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #5b6cff, #8f9bff);
  transform-origin: left;
  animation: bar-grow 800ms 220ms cubic-bezier(0.2, 0.9, 0.3, 1) both;
}

@keyframes bar-grow {
  from {
    transform: scaleX(0.05);
  }
}

.b__list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border-radius: calc(20 * var(--u));
  overflow: hidden;
  box-shadow: 0 calc(1 * var(--u)) calc(2 * var(--u)) rgba(15, 15, 25, 0.04);
  animation: rise-in 520ms 140ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

.b__row {
  display: flex;
  align-items: center;
  gap: calc(10 * var(--u));
  padding: calc(13 * var(--u)) calc(14 * var(--u));
  border-bottom: calc(0.8 * var(--u)) solid #f1f1f4;
}

.b__row:last-child {
  border-bottom: 0;
}

.b__dot {
  width: calc(7 * var(--u));
  height: calc(7 * var(--u));
  border-radius: 50%;
  background: #5b6cff;
}

.b__row-text {
  flex: 1;
  font-size: calc(13 * var(--u));
  font-weight: 500;
}

.b__row-meta {
  font-size: calc(11 * var(--u));
  color: #92929a;
}

.b__actions {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  animation: rise-in 520ms 220ms cubic-bezier(0.22, 0.9, 0.24, 1) both;
}

/* reduced motion ------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .scr,
  .scr * {
    animation-duration: 1ms !important;
    animation-delay: 0ms !important;
    transition-duration: 1ms !important;
  }
}
```


### `src/screens/index.ts`

```tsx
import type { ScreenDef } from '../app/flow';
import { ScreenA } from './ScreenA';
import { ScreenB } from './ScreenB';

/**
 * THE FLOW — order matters: it drives the stage's prev/next and the caption.
 *
 * When an agent adds a screen it appends one entry here and wires the
 * outgoing button with `go('<id>')`.
 */
export const SCREENS: ScreenDef[] = [
  { id: 'screen-a', title: 'Screen one', note: 'Entry state of the flow', View: ScreenA },
  { id: 'screen-b', title: 'Screen two', note: 'Detail / summary state', View: ScreenB },
];
```


### `src/screens/ScreenA.tsx`

```tsx
import type { ScreenProps } from '../app/flow';

/**
 * TEMPLATE — replace with screen 1.
 *
 * Rules that keep this shell coherent:
 *  · all sizes are points: calc(<pt> * var(--u))
 *  · stay out of the top 54 pt (status bar + island) and bottom 34 pt (home indicator)
 *  · artwork is inline SVG, never an <img>
 */
export function ScreenA({ go }: ScreenProps) {
  return (
    <div className="scr scr--a">
      <div className="a__hero">
        <span className="a__badge" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="40" rx="13" fill="url(#aGrad)" />
            <path d="M16 25.5 22 31l10-12" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="aGrad" x1="4" y1="4" x2="44" y2="44">
                <stop stopColor="#7f8cff" />
                <stop offset="1" stopColor="#4b56d8" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <h1 className="a__title">Screen one</h1>
        <p className="a__body">
          Drop the first screen of your flow here. Everything is measured in points, so it renders identically on any
          device size.
        </p>
      </div>

      <div className="a__actions">
        <button className="pill" type="button" onClick={() => go('screen-b')}>
          Continue
        </button>
        <button className="text-btn" type="button" onClick={() => go('screen-b')}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
```


### `src/screens/ScreenB.tsx`

```tsx
import type { ScreenProps } from '../app/flow';

/** TEMPLATE — replace with screen 2. */
export function ScreenB({ go, back }: ScreenProps) {
  return (
    <div className="scr scr--b">
      <header className="b__header">
        <button className="icon-btn" type="button" onClick={back} aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
        <span className="b__crumb">Screen two</span>
        <span className="b__spacer" />
      </header>

      <section className="b__card">
        <p className="b__label">Summary</p>
        <p className="b__value">
          ₹42,500 <span>left of ₹50,000</span>
        </p>
        <div className="b__bar" role="img" aria-label="85 percent remaining">
          <span style={{ width: '85%' }} />
        </div>
      </section>

      <ul className="b__list">
        {['First row of content', 'Second row of content', 'Third row of content'].map((row) => (
          <li className="b__row" key={row}>
            <span className="b__dot" aria-hidden="true" />
            <span className="b__row-text">{row}</span>
            <span className="b__row-meta">12:40</span>
          </li>
        ))}
      </ul>

      <div className="b__actions">
        <button className="pill" type="button" onClick={() => go('screen-a')}>
          Start over
        </button>
      </div>
    </div>
  );
}
```

## 9. Definition of done (the agent must self-check)

- [ ] `npm install && npm run dev` renders the shell with screen 1 visible.
- [ ] Every screen I described is reachable by tapping through the flow, and `Back` returns.
- [ ] `Copy image` puts a 3× PNG on the clipboard; icons and artwork are not blank.
- [ ] `Copy code` yields one self-contained HTML file that still animates when opened alone.
- [ ] `Copy embed` yields scoped CSS + markup with **no** `body`, `html`, `*` or `:root` rule.
- [ ] At 390 × 844 and at 1440 × 900 there is no horizontal scroll.
- [ ] `tsc --noEmit` passes; no `any`, no unused imports.
- [ ] Every animation has a `prefers-reduced-motion: reduce` fallback.
