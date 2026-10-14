// Temporary interaction smoke test — deleted after use.
import { createRoot } from 'react-dom/client';
import App from '../App';

const errors: string[] = [];
const origError = console.error;
console.error = (...a: unknown[]) => { errors.push(a.map(String).join(' ')); origError(...(a as [])); };
window.addEventListener('error', (e) => errors.push(`window.error: ${e.message}`));

const root = document.getElementById('root')!;
createRoot(root).render(<App />);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const inScope = (scope: ParentNode, sel: string, txt: RegExp) =>
  Array.from(scope.querySelectorAll(sel)).find((el) => txt.test(el.textContent ?? ''));
const click = (el: Element | undefined, label: string) => {
  if (!el) { console.log(`FAIL  cannot find "${label}"`); return false; }
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  return true;
};
const results: [string, boolean][] = [];
const check = (name: string, pass: boolean) => { results.push([name, pass]); };

setTimeout(async () => {
  const rail = document.querySelector('aside')!;
  const stage = document.querySelector('main')!;
  const stageText = () => stage.textContent ?? '';

  check('initial render shows home', stageText().includes('Sharma Kirana Store'));

  await wait(60);
  click(inScope(rail, 'ol button', /Scan & Pay/), 'rail step: Scan & Pay');
  await wait(150);
  check('rail step → scan & pay screen', stageText().includes('Pay ₹450 & earn reward'));

  click(inScope(rail, 'button', /^Error$/), 'state chip: Error');
  await wait(150);
  check('state chip → error variant', stageText().includes('QR not detected'));

  click(inScope(rail, 'button', /^Default$/), 'state chip: Default');
  await wait(150);
  check('state chip → back to default', stageText().includes('Pay ₹450 & earn reward'));

  click(inScope(stage, 'button', /Pay ₹450/), 'device CTA: Pay');
  await wait(200);
  check('device tap → payment success', stageText().includes('Reveal my reward'));

  click(inScope(stage, 'button', /Reveal my reward/), 'device CTA: Reveal');
  await wait(200);
  check('device tap → reward reveal', stageText().includes('Scratch to reveal'));

  click(inScope(stage, 'button', /Scratch to reveal/), 'scratch card');
  await wait(250);
  check('scratch → prize revealed', stageText().includes('Cashback won'));
  check('scratch → CTA unlocked', stageText().includes('See my rewards'));

  click(inScope(rail, 'button', /Redeem: browse offer/), 'flow: browse-redeem');
  await wait(200);
  check('flow switch → rewards hub', stageText().includes('Points balance'));

  click(inScope(rail, 'ol button', /Offer detail/), 'rail step: Offer detail');
  await wait(200);
  check('rail step → offer detail', stageText().includes('Redeem 300 points'));

  click(inScope(stage, 'button', /Redeem 300 points/), 'device CTA: Redeem');
  await wait(200);
  check('device tap → confirm redeem', stageText().includes('Confirm redemption'));

  click(inScope(stage, 'button', /^Confirm redemption$/), 'device CTA: Confirm');
  await wait(200);
  check('sheet opened', stageText().includes('Redeem now'));

  const real = errors.filter((e) => !/not wrapped in act/i.test(e));
  for (const [n, p] of results) console.log(`${p ? 'PASS' : 'FAIL'}  ${n}`);
  console.log(`console.error count: ${real.length}`);
  real.slice(0, 4).forEach((e) => console.log('ERR> ' + e.slice(0, 300)));
  const ok = results.every(([, p]) => p) && real.length === 0;
  console.log(ok ? 'CLIENT_OK' : 'CLIENT_FAILED');
}, 600);
