/* ============================================================
   DITHER·FACE
   Renders any photo as a grid of halftone dots / pixel blocks,
   quantised with ordered (Bayer) or diffused (Floyd–Steinberg /
   Atkinson) dithering — i.e. the "diether + dots + pixel" look.
   ============================================================ */

const $ = (id) => document.getElementById(id);

/* ---------- DOM ---------- */
const canvas   = $('canvas');
const ctx      = canvas.getContext('2d');
const stage    = $('stage');
const dropHint = $('dropHint');

const els = {
  mode:$('mode'), dither:$('dither'), cols:$('cols'), scale:$('scale'),
  levels:$('levels'), contrast:$('contrast'), bright:$('bright'),
  gap:$('gap'), floor:$('floor'), gamma:$('gamma'), cut:$('cut'), invert:$('invert'), auto:$('auto'), glow:$('glow'), scan:$('scan'),
  bg:$('bg'), fg:$('fg'), accent:$('accent'), mix:$('mix'),
  reveal:$('reveal'), ripple:$('ripple'),
  colsLabel:$('colsLabel'), scaleLabel:$('scaleLabel'), levelsLabel:$('levelsLabel'),
  contrastLabel:$('contrastLabel'), brightLabel:$('brightLabel'), gapLabel:$('gapLabel'),
  mixLabel:$('mixLabel'), floorLabel:$('floorLabel'), gammaLabel:$('gammaLabel'), cutLabel:$('cutLabel'), ditherLabel:$('ditherLabel'),
  statGrid:$('statGrid'), statDots:$('statDots'), statFps:$('statFps'),
  presets:$('presets'),
};

/* ---------- state ---------- */
const S = {
  image:null,
  shape:'circle',
  grid:null,          // {cols, rows, tones:Float32Array}
  dots:[],            // [{x,y,r,tone,color,wave}]
  hover:{x:-1e5, y:-1e5, active:false},
  progress:1,         // reveal animation 0..1
  animating:false,
  dpr:Math.min(window.devicePixelRatio || 1, 2),
  cssW:0, cssH:0,
  fps:0,
};

/* ============================================================
   1.  BAYER MATRICES
   ============================================================ */
function bayer(size){
  let m = [[0]];
  while (m.length < size){
    const n = m.length, out = [];
    for (let y = 0; y < n * 2; y++) out.push(new Array(n * 2).fill(0));
    for (let y = 0; y < n; y++){
      for (let x = 0; x < n; x++){
        const v = m[y][x] * 4;
        out[y][x]           = v + 0;
        out[y][x + n]       = v + 2;
        out[y + n][x]       = v + 3;
        out[y + n][x + n]   = v + 1;
      }
    }
    m = out;
  }
  const total = size * size;
  return m.map(row => row.map(v => v / total));   // 0 … 1
}
const BAYER = { bayer2:bayer(2), bayer4:bayer(4), bayer8:bayer(8) };

/* ============================================================
   2.  TONE SAMPLING  (photo → grid of ink values 0…1)
   ============================================================ */
const sampler = document.createElement('canvas');
const sctx = sampler.getContext('2d', { willReadFrequently:true });

function sampleTones(cols, rows){
  sctx.canvas.width = cols;
  sctx.canvas.height = rows;
  sctx.clearRect(0, 0, cols, rows);
  sctx.imageSmoothingEnabled = true;
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(S.image, 0, 0, cols, rows);

  const px = sctx.getImageData(0, 0, cols, rows).data;
  const n  = cols * rows;
  const lum = new Float32Array(n);

  for (let i = 0, p = 0; i < n; i++, p += 4){
    const a = px[p + 3] / 255;
    lum[i] = ((0.2126 * px[p] + 0.7152 * px[p + 1] + 0.0722 * px[p + 2]) / 255) * a;
  }

  /* auto-levels: stretch the 1%–99% percentile window of the histogram */
  let lo = 0, hi = 1;
  if (els.auto.checked){
    const hist = new Uint32Array(256);
    for (let i = 0; i < n; i++) hist[(lum[i] * 255) | 0]++;
    const cut = n * 0.01;
    let acc = 0;
    for (let v = 0; v < 256 && acc < cut; v++){ acc += hist[v]; lo = v / 255; }
    acc = 0;
    for (let v = 255; v >= 0 && acc < cut; v--){ acc += hist[v]; hi = v / 255; }
    if (hi - lo < 0.04){ lo = 0; hi = 1; }            // flat / mostly-empty image
  }
  const span = Math.max(1e-4, hi - lo);

  const tones = new Float32Array(n);
  const c = +els.contrast.value, b = +els.bright.value;
  const g = Math.max(0.05, +els.gamma.value);
  const inv = els.invert.checked;

  for (let i = 0; i < n; i++){
    let v = (lum[i] - lo) / span;                     // normalise
    v = v < 0 ? 0 : v > 1 ? 1 : v;                    // (below-floor pixels → pure paper)
    v = Math.pow(v, g);                               // shadow crush (keeps 0 at 0)
    v = (v - 0.5) * c + 0.5 + b;                      // contrast / brightness
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    /* dots trace the LIT areas (light-on-dark); invert flips to dark-on-light */
    tones[i] = inv ? 1 - v : v;
  }
  return tones;
}

/* ============================================================
   3.  DITHER / QUANTISE  →  ink levels in [0,1]
   ============================================================ */
function quantise(tones, cols, rows){
  const kind  = els.dither.value;
  const L     = +els.levels.value;          // number of tone steps
  const steps = L - 1;
  const out   = new Float32Array(tones.length);

  if (kind === 'none'){
    for (let i = 0; i < tones.length; i++) out[i] = tones[i];
    return out;
  }

  if (kind === 'fs' || kind === 'atkinson'){
    const buf = Float32Array.from(tones, t => t * steps);
    const cap = (v) => v < 0 ? 0 : v > steps ? steps : v;
    const diff = kind === 'fs'
      ? [[1,0,7/16],[-1,1,3/16],[0,1,5/16],[1,1,1/16]]
      : [[1,0,1/8],[2,0,1/8],[-1,1,1/8],[0,1,1/8],[1,1,1/8],[0,2,1/8]];

    for (let y = 0; y < rows; y++){
      for (let x = 0; x < cols; x++){
        const i = y * cols + x;
        const old = cap(buf[i]);
        const q = Math.round(old);
        buf[i] = q;
        const err = (old - q) * (kind === 'atkinson' ? 0.75 : 1);
        for (const [dx, dy, w] of diff){
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= cols || ny >= rows) continue;
          buf[ny * cols + nx] += err * w;
        }
      }
    }
    for (let i = 0; i < out.length; i++) out[i] = buf[i] / steps;
    return out;
  }

  /* ordered Bayer */
  const M = BAYER[kind], n = M.length;
  for (let y = 0; y < rows; y++){
    const mrow = M[y % n];
    for (let x = 0; x < cols; x++){
      const i = y * cols + x;
      const v = tones[i] * steps;
      let q = Math.floor(v + mrow[x % n]);
      q = q < 0 ? 0 : q > steps ? steps : q;
      out[i] = q / steps;
    }
  }
  return out;
}

/* ============================================================
   4.  GEOMETRY + COLOUR  →  dot list
   ============================================================ */
/* `cut` is exposed as the "Shadow cut" slider: everything below it fades to
   pure paper, so a dark background drops out and the subject reads. */
function fadeWindow(){
  const hi = Math.max(0.02, +els.cut.value);
  return [Math.min(hi * 0.2, hi - 0.01), hi];
}
const hex2rgb = (h) => {
  const v = parseInt(h.slice(1), 16);
  return [v >> 16 & 255, v >> 8 & 255, v & 255];
};
const mix = (a, b, t) => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function build(cols, rows){
  const raw = sampleTones(cols, rows);          // continuous brightness 0…1

  /* appearance ramp first (on the CONTINUOUS tone), so the dither later
     quantises coverage (= dot size) instead of raw shadow values —
     otherwise a 2%-lit wall gets dithered into full-size stray dots */
  const [fadeLo, fadeHi] = fadeWindow();
  const cov = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i++){
    const a = smooth(fadeLo, fadeHi, raw[i]);
    cov[i] = a * raw[i];
  }
  const tones = quantise(cov, cols, rows);      // dithered, L-level coverage

  const cell   = S.cssW / cols;
  const gap    = +els.gap.value;
  const fl     = +els.floor.value;
  const k      = (+els.scale.value) * (1 - gap) * 0.5;   // max radius ÷ cell
  const mode   = els.mode.value;
  const paper  = hex2rgb(els.bg.value);
  const ink    = hex2rgb(els.fg.value);
  const acc    = hex2rgb(els.accent.value);
  const amt    = +els.mix.value;

  const dots = [];
  for (let y = 0; y < rows; y++){
    for (let x = 0; x < cols; x++){
      const t = tones[y * cols + x];
      if (t <= 0.02) continue;

      /* sqrt keeps mark AREA proportional to coverage ⇒ true halftone ramp;
         `floor` lifts the ramp so dark shapes still leave a visible dot */
      const ramp  = Math.sqrt(t);
      const sizeT = fl + (1 - fl) * ramp;
      const r     = mode === 'pixel' ? 0 : cell * k * sizeT;
      const side  = cell * (1 - gap) * (mode === 'pixel' ? sizeT : 1) * (mode === 'hybrid' ? sizeT : 1);

      let col = mix(paper, ink, Math.min(1, 0.18 + t * 1.3));
      if (amt > 0) col = mix(col, acc, amt * smooth(0.5, 1, t));

      dots.push({
        x:(x + 0.5) * cell,
        y:(y + 0.5) * cell,
        tone:t,
        r:mode === 'pixel' ? 0 : r,
        side,
        pixel:mode === 'pixel' ? 'only' : mode === 'hybrid' ? 'under' : 'none',
        col:'rgb(' + col.join(',') + ')',
        /* diagonal wave for the reveal animation */
        wave:(x / cols * 0.55 + y / rows * 0.45),
      });
    }
  }

  S.grid = { cols, rows, tones };
  S.dots = dots;
  els.statGrid.textContent = cols + '×' + rows;
  els.statDots.textContent = dots.length.toLocaleString('en') + ' marks';
}

/* ============================================================
   5.  DRAW
   ============================================================ */
function drawShape(g, dot, grows, dx, dy){
  const size = dot.r * grows;
  if (size <= 0.06) return;
  const x = dot.x + dx, y = dot.y + dy;
  g.fillStyle = dot.col;
  switch (S.shape){
    case 'square':  g.fillRect(x - size, y - size, size * 2, size * 2); break;
    case 'diamond': {
      g.beginPath();
      g.moveTo(x, y - size); g.lineTo(x + size, y);
      g.lineTo(x, y + size); g.lineTo(x - size, y);
      g.closePath(); g.fill(); break;
    }
    case 'plus': {
      const w = size * 0.42;
      g.fillRect(x - w, y - size, w * 2, size * 2);
      g.fillRect(x - size, y - w, size * 2, w * 2);
      break;
    }
    default: {
      g.beginPath();
      g.arc(x, y, size, 0, 6.283185307179586);
      g.fill();
    }
  }
}

function draw(){
  const { cssW, cssH, dpr } = S;
  if (!cssW) return;
  const g = ctx;

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = 1;
  g.filter = 'none';
  g.fillStyle = els.bg.value;
  g.fillRect(0, 0, canvas.width, canvas.height);

  g.setTransform(dpr, 0, 0, dpr, 0, 0);

  const rippleOn = els.ripple.checked && S.hover.active;
  const hx = S.hover.x, hy = S.hover.y;
  const R  = Math.min(S.cssW, S.cssH) * 0.32;

  S.dots.forEach(dot => {
    /* reveal wave */
    let appear = 1;
    if (S.progress < 1){
      appear = smooth(0, 1, (S.progress * 1.35 - dot.wave * 0.35) / 1);
      if (appear <= 0) return;
    }

    let grow = appear, dx = 0, dy = 0, burst = 0;
    if (rippleOn){
      const ox = dot.x - hx, oy = dot.y - hy;
      const d = Math.hypot(ox, oy);
      if (d < R){
        const f = 1 - d / R, f2 = f * f;
        burst = f2;
        grow = Math.min(2.1, appear + f2 * 1.25);
        dx = (ox / (d || 1)) * f2 * 10;
        dy = (oy / (d || 1)) * f2 * 10;
      }
    }

    /* pixel underlay (pixel + hybrid modes) */
    if (dot.pixel !== 'none'){
      const s = dot.side * (dot.pixel === 'under' ? 0.55 + dot.tone * 0.45 : 1) * (1 + burst * 0.3);
      g.fillStyle = dot.col;
      g.globalAlpha = (dot.pixel === 'under' ? 0.34 : 1) * appear;
      g.fillRect(dot.x + dx - s / 2, dot.y + dy - s / 2, s, s);
      g.globalAlpha = 1;
    }

    if (dot.r <= 0) return;

    drawShape(g, dot, grow, dx, dy);
  });

  /* bloom */
  if (els.glow.checked) bloom();

  /* scanlines */
  if (els.scan.checked){
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = 'rgba(0,0,0,.30)';
    for (let y = 0; y < cssH; y += 3) g.fillRect(0, y, cssW, 1.15);
    g.fillStyle = 'rgba(255,255,255,.020)';
    for (let y = 1; y < cssH; y += 3) g.fillRect(0, y, cssW, 1);
  }
}

let bloomCanvas = document.createElement('canvas');
let bctx = bloomCanvas.getContext('2d');
function bloom(){
  bloomCanvas.width = canvas.width;
  bloomCanvas.height = canvas.height;
  bctx.setTransform(1, 0, 0, 1, 0, 0);
  bctx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
  bctx.drawImage(canvas, 0, 0);

  const g = ctx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'lighter';
  g.globalAlpha = 0.5;
  g.filter = 'blur(' + Math.max(2, S.cssW / 220) * S.dpr + 'px)';
  g.drawImage(bloomCanvas, 0, 0);
  g.filter = 'none';
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
}

/* ============================================================
   6.  SIZE / REBUILD
   ============================================================ */
function fitCanvas(){
  if (!S.image) return;
  const pad = 44;
  const availW = Math.max(160, stage.clientWidth  - pad);
  const availH = Math.max(160, stage.clientHeight - pad);
  const ar = S.image.naturalWidth / S.image.naturalHeight;

  let w = Math.min(availW, 1180);
  let h = w / ar;
  if (h > availH){ h = availH; w = h * ar; }

  S.cssW = Math.round(w);
  S.cssH = Math.round(h);
  canvas.style.width  = S.cssW + 'px';
  canvas.style.height = S.cssH + 'px';
  canvas.width  = Math.round(S.cssW * S.dpr);
  canvas.height = Math.round(S.cssH * S.dpr);
}

function render({ keepProgress = false } = {}){
  if (!S.image) return;
  fitCanvas();
  const cols = +els.cols.value;
  const rows = Math.max(4, Math.round(cols * S.cssH / S.cssW));
  build(cols, rows);
  if (!keepProgress){ S.progress = els.reveal.checked ? 0 : 1; }
  if (S.progress < 1) startAnim(); else { draw(); measureFps(); }
}

/* ============================================================
   7.  ANIMATION LOOPS
   ============================================================ */
let revealRAF = 0, rippleRAF = 0, lastT = 0, fpsAcc = [], fpsRAF = 0;

function startAnim(){
  cancelAnimationFrame(revealRAF);
  const t0 = performance.now();
  const dur = 900;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    S.progress = 1 - Math.pow(1 - p, 3);            // ease-out cubic
    draw();
    if (p < 1) revealRAF = requestAnimationFrame(step);
    else { S.progress = 1; draw(); measureFps(); }
  };
  revealRAF = requestAnimationFrame(step);
}

function loopRipple(){
  if (!S.hover.active || !els.ripple.checked){ rippleRAF = 0; draw(); return; }
  draw();
  rippleRAF = requestAnimationFrame(loopRipple);
}

function measureFps(){
  const tick = (now) => {
    const dt = now - lastFpsTime; lastFpsTime = now;
    if (dt > 0 && dt < 500){
      fpsAcc.push(1000 / dt);
      if (fpsAcc.length > 30) fpsAcc.shift();
    }
    if (now - lastFpsPush > 600 && fpsAcc.length){
      const avg = fpsAcc.reduce((a, b) => a + b, 0) / fpsAcc.length;
      els.statFps.textContent = Math.round(avg) + ' fps';
      lastFpsPush = now;
    }
    if (fpsRAF) fpsRAF = requestAnimationFrame(tick);
  };
  if (fpsRAF) return;
  lastFpsTime = performance.now(); lastFpsPush = lastFpsTime; fpsAcc = [];
  fpsRAF = requestAnimationFrame(tick);
}
let lastFpsTime = 0, lastFpsPush = 0;
function stopFps(){ cancelAnimationFrame(fpsRAF); fpsRAF = 0; }

/* ============================================================
   8.  IMAGE LOADING
   ============================================================ */
const DEFAULT_SRC = 'assets/placeholder-portrait.png';

function loadImage(src, isObjectURL){
  const img = new Image();
  img.onload = () => {
    S.image = img;
    dropHint.classList.remove('hot');
    stage.classList.add('has-image');
    render();
    const el = document.createElement('canvas');
    console.log('%cDITHER·FACE', 'color:#ff3d68;font-weight:700',
                'loaded ' + (isObjectURL ? 'user image' : src) + ' — ' + img.naturalWidth + '×' + img.naturalHeight);
  };
  img.onerror = () => alert('Could not load that image.');
  img.src = src;
}

function loadFile(file){
  if (!file || !file.type.startsWith('image/')) return;
  loadImage(URL.createObjectURL(file), true);
}

$('file').addEventListener('change', (e) => loadFile(e.target.files[0]));
$('reset').addEventListener('click', () => { applyPreset('halftone'); loadImage(DEFAULT_SRC); });
$('replay').addEventListener('click', () => { S.progress = 0; startAnim(); });
$('save').addEventListener('click', () => {
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'dither-face.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
});

/* drag & drop anywhere on the stage */
['dragenter', 'dragover'].forEach(ev =>
  stage.addEventListener(ev, (e) => { e.preventDefault(); stage.classList.add('hot'); }));
['dragleave', 'drop'].forEach(ev =>
  stage.addEventListener(ev, () => stage.classList.remove('hot')));
stage.addEventListener('drop', (e) => {
  e.preventDefault();
  loadFile(e.dataTransfer.files[0]);
});
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop',  (e) => e.preventDefault());

/* ============================================================
   9.  CONTROLS
   ============================================================ */
const labels = {
  cols:[els.colsLabel, v => v + ' cols'],
  scale:[els.scaleLabel, v => (+v).toFixed(2)],
  levels:[els.levelsLabel, v => v + ''],
  contrast:[els.contrastLabel, v => (+v).toFixed(2)],
  bright:[els.brightLabel, v => (+v).toFixed(2)],
  gap:[els.gapLabel, v => (+v).toFixed(2)],
  floor:[els.floorLabel, v => (+v).toFixed(2)],
  gamma:[els.gammaLabel, v => (+v).toFixed(2)],
  cut:[els.cutLabel, v => (+v).toFixed(2)],
  mix:[els.mixLabel, v => (+v).toFixed(2)],
  dither:[els.ditherLabel, v => ({
    none:'smooth', bayer2:'Bayer 2×2', bayer4:'Bayer 4×4',
    bayer8:'Bayer 8×8', fs:'Floyd–Steinberg', atkinson:'Atkinson' }[v])],
};

function refreshLabels(){
  for (const key in labels){
    const [node, fn] = labels[key];
    if (node) node.textContent = fn(els[key].value);
  }
}

/* full rebuild when geometry/tone changes */
['cols', 'scale', 'levels', 'contrast', 'bright', 'gap', 'floor', 'gamma', 'cut', 'mode', 'dither', 'invert', 'auto', 'bg', 'fg', 'accent', 'mix']
  .forEach(id => els[id].addEventListener('input', () => {
    refreshLabels();
    render({ keepProgress: id === 'mix' });
  }));

/* cheap redraws */
['glow', 'scan'].forEach(id => els[id].addEventListener('input', draw));
els.reveal.addEventListener('input', () => { S.progress = 1; draw(); });
els.ripple.addEventListener('input', () => {
  if (els.ripple.checked && S.hover.active){ if (!rippleRAF) loopRipple(); }
  else draw();
});

/* shape segmented control */
$('shape').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  [...e.currentTarget.children].forEach(c => c.classList.toggle('on', c === b));
  S.shape = b.dataset.shape;
  draw();
});

/* pointer → ripple origin */
canvas.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect();
  S.hover.x = (e.clientX - r.left) * (S.cssW / r.width);
  S.hover.y = (e.clientY - r.top)  * (S.cssH / r.height);
  S.hover.active = true;
  if (els.ripple.checked && !rippleRAF) loopRipple();
});
canvas.addEventListener('pointerleave', () => { S.hover.active = false; draw(); });

/* ============================================================
   10. PRESETS
   ============================================================ */
const PRESETS = {
  halftone:{ mode:'dots', dither:'bayer8', cols:116, scale:1, levels:4, contrast:1.05, bright:0, gamma:1.05, cut:0.14,
             gap:0.10, floor:0.22, invert:false, auto:true, glow:false, scan:false, bg:'#06070b', fg:'#eef2f8', accent:'#ff3d68', mix:0.35, shape:'circle' },
  onebit:{ mode:'pixel', dither:'fs', cols:110, scale:1, levels:2, contrast:1.0, bright:0, gamma:1.1, cut:0.10,
           gap:0.04, floor:0.0, invert:false, auto:true, glow:false, scan:false, bg:'#0b0b0b', fg:'#f4f4f0', accent:'#f4f4f0', mix:0, shape:'square' },
  crt:{ mode:'dots', dither:'bayer4', cols:126, scale:1.02, levels:5, contrast:1.2, bright:0.03, gamma:1.05,
        gap:0.16, floor:0.26, invert:false, auto:true, glow:true, scan:true, bg:'#020803', fg:'#8bffb0', accent:'#22ff88', mix:0.7, shape:'circle' },
  riso:{ mode:'hybrid', dither:'bayer8', cols:96, scale:1.05, levels:5, contrast:1.1, bright:0.01, gamma:1.15, cut:0.13,
         gap:0.12, floor:0.20, invert:false, auto:true, glow:false, scan:false, bg:'#12060c', fg:'#ffe9f2', accent:'#ff2e6b', mix:0.8, shape:'diamond' },
  news:{ mode:'dots', dither:'bayer4', cols:132, scale:1, levels:3, contrast:1.4, bright:-0.02, gamma:1.15,
         gap:0.06, floor:0.0, invert:true, auto:true, glow:false, scan:false, bg:'#efe9dd', fg:'#101010', accent:'#101010', mix:0, shape:'circle' },
};

function applyPreset(name){
  const p = PRESETS[name]; if (!p) return;
  for (const k in p){
    if (k === 'shape'){ S.shape = p.shape; continue; }
    const el = els[k]; if (!el) continue;
    if (el.type === 'checkbox') el.checked = p[k]; else el.value = p[k];
  }
  [...$('shape').children].forEach(c => c.classList.toggle('on', c.dataset.shape === S.shape));
  refreshLabels();
  render();
}

Object.keys(PRESETS).forEach(name => {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = name === 'onebit' ? '1-bit' : name;
  b.addEventListener('click', () => applyPreset(name));
  els.presets.appendChild(b);
});

/* ============================================================
   11. BOOT
   ============================================================ */
refreshLabels();
loadImage(DEFAULT_SRC);

let rt = 0;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => render({ keepProgress:true }), 140);
});
