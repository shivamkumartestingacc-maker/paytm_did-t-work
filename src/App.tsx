import { useCallback, useRef, useState } from 'react';
import { DeviceShell, type ShellTheme } from './phone/DeviceShell';
import { HomeScreen } from './screens/HomeScreen';
import { UnlockScreen } from './screens/UnlockScreen';
import { BadgeDetailScreen } from './screens/BadgeDetailScreen';
import { RatingSheet } from './screens/RatingSheet';
import { ExportBar } from './export/ExportBar';

type Step = 'home' | 'unlock' | 'detail';

const STEP_TITLE: Record<Step, string> = {
  home: 'Perfect Month — home',
  unlock: 'Perfect Month — badge unlocked',
  detail: 'Perfect Month — badge detail',
};

/**
 * Perfect Month — the three-screen flow.
 *
 *   home  →  unlock (the reference screen)  →  detail
 *      ↑                                          │
 *      └────────────── "Apply ×3 boost" ──────────┘
 */
export default function App() {
  const [step, setStep] = useState<Step>('home');
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [boostApplied, setBoostApplied] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [shellTheme, setShellTheme] = useState<ShellTheme>('dark');

  const deviceRef = useRef<HTMLDivElement>(null);
  const getDevice = useCallback(() => deviceRef.current?.querySelector<HTMLElement>('.device') ?? null, []);

  const openUnlock = useCallback(() => {
    setBadgeEarned(true);
    setStep('unlock');
    setPlayKey((k) => k + 1);
  }, []);

  const goHome = useCallback(() => {
    setSheetOpen(false);
    setStep('home');
  }, []);

  const claim = useCallback(() => {
    setBoostApplied(true);
    setStep('home');
  }, []);

  const reset = useCallback(() => {
    setStep('home');
    setBadgeEarned(false);
    setBoostApplied(false);
    setRating(null);
    setSheetOpen(false);
  }, []);

  return (
    <div className="stage" data-studio={shellTheme === 'light' ? 'light' : 'dark'}>
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__grid" aria-hidden="true" />

      <div className="stage__device" ref={deviceRef}>
        <DeviceShell
          screenTheme="light"
          shellTheme={shellTheme}
          homeIndicatorColor="rgba(0,0,0,0.26)"
          label="Perfect Month badge — interactive prototype"
        >
          <div className="screens" data-step={step}>
            {step === 'home' && (
              <HomeScreen
                badgeEarned={badgeEarned}
                boostApplied={boostApplied}
                onOpenUnlock={openUnlock}
                onOpenDetail={() => setStep('detail')}
              />
            )}

            {step === 'unlock' && (
              <UnlockScreen
                key={playKey}
                playKey={playKey}
                rating={rating}
                onRate={() => setSheetOpen(true)}
                onViewBadge={() => setStep('detail')}
                onGoHome={goHome}
              />
            )}

            {step === 'detail' && (
              <BadgeDetailScreen onBack={openUnlock} onClaim={claim} boostApplied={boostApplied} />
            )}

            <RatingSheet
              open={sheetOpen}
              onClose={() => setSheetOpen(false)}
              onSubmit={(stars) => {
                setRating(stars);
                setSheetOpen(false);
              }}
            />
          </div>
        </DeviceShell>
      </div>

      <div className="stage__meta">
        <span className="stage__caption">
          Perfect Month · {STEP_TITLE[step].split('— ')[1]} · {shellTheme} shell
        </span>

        <ExportBar getTarget={getDevice} title={STEP_TITLE[step]} />

        <div className="stage__controls">
          <button type="button" className="stage__control" onClick={openUnlock}>
            Replay unlock
          </button>
          <button type="button" className="stage__control" onClick={reset}>
            Reset flow
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
      </div>
    </div>
  );
}
