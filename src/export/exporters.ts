/**
 * Export helpers — no dependencies.
 *
 * • `snapshotPng` rasterises the live device DOM with an SVG `foreignObject`,
 *   so the exported image is the real prototype, not a redraw.
 * • `buildStandaloneHtml` returns one self-contained HTML file: the device
 *   markup plus every same-origin CSS rule, animations included.
 */

/** Copy every readable CSS rule (animations included) into one string. */
function collectCss(): string {
  const chunks: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | null = null;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin (e.g. Google Fonts) — skipped, fallbacks cover it
    }
    if (!rules) continue;
    for (const rule of Array.from(rules)) chunks.push(rule.cssText);
  }
  return chunks.join('\n');
}

const RESPONSIVE_SCREEN_W = 'min(393px, calc(100vw - 56px), calc((100svh - 132px) * 393 / 886))';

/**
 * Deep clone of the device with the responsive scale resolved.
 * `mode: 'image'` freezes exact pixel dimensions (a still frame);
 * `mode: 'html'` keeps the pt-based scale so the export stays fluid.
 */
function cloneDevice(device: HTMLElement, mode: 'image' | 'html'): HTMLElement {
  const clone = device.cloneNode(true) as HTMLElement;
  const cs = getComputedStyle(device);
  const current = clone.getAttribute('style') ?? '';
  const style =
    mode === 'image'
      ? `width:${cs.width};height:${cs.height};--screen-w:${cs.getPropertyValue('--screen-w').trim() || cs.width}`
      : `--screen-w:${RESPONSIVE_SCREEN_W}`;
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
  const css = `${collectCss()}\n*, *::before, *::after { animation: none !important; transition: none !important; }`;

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

/** The full HTML document for the current screen, animations included. */
export function buildStandaloneHtml(device: HTMLElement, title: string): string {
  const clone = cloneDevice(device, 'html');
  const css = collectCss();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
${css}

/* export shell: centre the device on the studio backdrop */
body {
  margin: 0;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(120% 90% at 50% -10%, #24252e 0%, #14151a 46%, #0a0a0c 100%), #0f0f12;
}
.device { margin: 0; }
</style>
</head>
<body>
${clone.outerHTML}
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

/** Copy the self-contained HTML for the device. */
export async function copyCode(device: HTMLElement, title = 'screen'): Promise<CopyResult> {
  const html = buildStandaloneHtml(device, title);
  try {
    await navigator.clipboard.writeText(html);
    return 'copied';
  } catch {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return 'downloaded';
  }
}
