import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  pretendToBeVisual: true, url: 'http://localhost:5173/',
});
const w = dom.window;
class RO { observe() {} unobserve() {} disconnect() {} }
w.ResizeObserver = RO;
w.matchMedia = w.matchMedia || ((q) => ({ matches: false, media: q, onchange: null,
  addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }));
for (const k of ['window','document','HTMLElement','Element','Node','Event','CustomEvent','MouseEvent','PointerEvent','requestAnimationFrame','cancelAnimationFrame','getComputedStyle','ResizeObserver','matchMedia','localStorage','DOMParser','SVGElement','CSS','AbortController','AbortSignal','EventTarget','PointerEvent','TouchEvent','KeyboardEvent','FocusEvent','MutationObserver','IntersectionObserver','Image','HTMLCanvasElement','fetch']) {
  if (w[k] !== undefined) globalThis[k] = w[k];
}
Object.defineProperty(globalThis, 'navigator', { value: w.navigator, configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = false;
await import('../.smoke-out/client.js');
