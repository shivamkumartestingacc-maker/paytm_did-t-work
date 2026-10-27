import { useState } from 'react';
import { DeviceShell, type ScreenTheme } from './phone/DeviceShell';
import { PlaceholderScreen } from './phone/PlaceholderScreen';

export default function App() {
  const [theme, setTheme] = useState<ScreenTheme>('light');
  const [guides, setGuides] = useState(false);

  return (
    <div className="stage">
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__grid" aria-hidden="true" />

      <DeviceShell screenTheme={theme} label="iPhone 15 Pro mockup shell">
        <PlaceholderScreen theme={theme} guides={guides} />
      </DeviceShell>

      <div className="stage__meta">
        <span className="stage__caption">iPhone 15 Pro · CSS shell · 393 × 852 pt</span>
        <div className="stage__controls">
          <button
            type="button"
            className="stage__control"
            aria-pressed={guides}
            onClick={() => setGuides((v) => !v)}
          >
            Guides
          </button>
          <button
            type="button"
            className="stage__control"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? 'Light screen' : 'Dark screen'}
          </button>
        </div>
      </div>
    </div>
  );
}
