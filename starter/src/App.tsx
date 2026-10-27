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
