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
