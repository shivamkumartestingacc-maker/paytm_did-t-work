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
glyphs, home indicator and default backdrop), `statusBar`, `time`,
`homeIndicator`, `label`, `className`.

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
| `src/App.tsx` | Stage: device + light/dark and guides toggles |

To build a real screen, drop a component into `src/screens/` and pass it as
`children` of `DeviceShell`; it automatically inherits the device scale,
the display clipping and the chrome layering.
