# DITHER·FACE

Turn any photo into a **dithered dot / pixel-art portrait** — the "diether + dots + pixel" look —
using nothing but HTML, CSS and vanilla JavaScript.

No build step, no dependencies, no framework. `index.html` + `styles.css` + `app.js`.

---

## Run it

```bash
python3 -m http.server 8080     # then open http://localhost:8080
```

(or just open `index.html` in a browser — but a local server is cleaner for the default image.)

## Use your own photo

Three ways, no code changes needed:

1. **Drag & drop** an image anywhere onto the canvas.
2. **Load image** button in the *Source* row.
3. To make it the default, save it as `assets/portrait.jpg` and set
   `const DEFAULT_SRC = 'assets/portrait.jpg';` near the bottom of `app.js`.

Then tune the sliders until it matches the look you're after. Portraits with one strong light
source work best — the renderer draws dots where the photo is *lit*.

---

## How it works

```
photo ──▶ downsample to a cols × rows grid ──▶ auto-levels + shadow cut ──▶ dither ──▶ draw
```

1. **Sample** — the photo is drawn into a tiny `cols × rows` offscreen canvas, so each pixel is
   already the average of one grid cell. That pixel's luminance becomes the cell's *coverage* (0…1).

2. **Levels** — `auto levels` stretches the 1 %–99 % histogram window, so any photo (however dark
   or washed out) uses the full range. **Shadow cut** then fades everything below a threshold to pure
   paper, which is what makes a dark background drop out and the subject pop.

3. **Dither** — coverage is quantised to `tone levels` steps using your choice of
   **Bayer 2×2 / 4×4 / 8×8** (ordered, gives regular cross-hatch patterns) or
   **Floyd–Steinberg / Atkinson** (error-diffusion, gives organic grain).

4. **Draw** — each cell becomes a mark whose **area is proportional to coverage**
   (`radius = maxRadius × √tone`, which is true halftone), so dark areas are small or absent dots and
   lit areas fill in solid. `Min dot` lifts the ramp so silhouettes don't disappear into the paper.

### Why the pipeline order matters

The appearance ramp is applied to the **continuous** tone *before* quantising — not after. If you dither
first and fade afterwards, a background wall lit at 2 % gets dithered into scattered *full-size* dots
(visible noise across the whole frame). Fading first means the dither quantises *dot size*, so a 2 % wall
simply becomes nothing. This one detail is the difference between a clean portrait and a speckled mess.

---

## Controls

| Group | Control | What it does |
|---|---|---|
| **Render** | Mode | halftone dots · pixel blocks · dots + pixel hybrid |
| | Dither | Bayer 2/4/8, Floyd–Steinberg, Atkinson, or none |
| | Grid | columns of dots — the master "resolution" knob (higher = finer detail) |
| | Dot scale | overall mark size |
| | Tone levels | quantisation steps (2 = pure 1-bit) |
| | Shadow cut | tone below which everything fades to the background |
| **Shape** | Shape | ● ■ ◆ ✚ |
| | Dot gap | spacing between marks |
| | Min dot | minimum mark size — raises visibility of dark shapes |
| | Invert | dark-on-light (for newsprint / light paper) |
| | Glow · Scanlines | CRT bloom and interlacing |
| **Ink** | Paper / Ink / Accent | three colours; accent tints only the brightest tones |
| **Motion** | Reveal wave · Mouse ripple | dots animate in diagonally; cursor displaces and grows nearby dots |
| | ⤓ PNG | export the current render at full canvas resolution |

### Presets

`halftone` (the default look) · `1-bit` · `crt` · `riso` · `news` (light paper, dark ink).

---

## Files

```
index.html    markup + control panel
styles.css    layout and UI chrome
app.js        the whole renderer  (sampling → levels → dither → geometry → draw)
assets/       default portrait (placeholder — swap for your own)
```

## Performance

Everything is baked into a flat array of marks once per parameter change, then drawn in a single pass —
so dragging *Grid*, *Dot scale* or the colour pickers stays interactive even at 200+ columns
(≈20 000 marks). Only bloom, ripple and the reveal wave re-draw per frame.
