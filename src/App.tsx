import { useCallback, useRef, useState } from 'react';
import { DeviceShell, type ShellTheme } from './phone/DeviceShell';
import { PaytmFlow, type PaytmStep } from './paytm/PaytmFlow';
import { HomeScreen } from './screens/HomeScreen';
import { UnlockScreen } from './screens/UnlockScreen';
import { BadgeDetailScreen } from './screens/BadgeDetailScreen';
import { RatingSheet } from './screens/RatingSheet';
import { ExportBar } from './export/ExportBar';

type Flow = 'paytm' | 'badge';
type Step = 'home' | 'unlock' | 'detail';

const PAYTM_TITLE: Record<PaytmStep, string> = {
  pay: 'Paytm — enter UPI PIN',
  success: 'Paytm — payment successful',
  rewards: 'Paytm — scratch & win',
  product: 'Paytm — GIVA coupon',
};

const BADGE_TITLE: Record<Step, string> = {
  home: 'Perfect Month — home',
  unlock: 'Perfect Month — badge unlocked',
  detail: 'Perfect Month — badge detail',
};

const PAYTM_ORDER: PaytmStep[] = ['pay', 'success', 'rewards', 'product'];

/**
 * Stage: one device, two flows.
 *
 *   Paytm   — pay → success → scratch → coupon
 *   Badge   — home → unlock → detail (the Perfect Month concept)
 */
export default function App() {
  const [flow, setFlow] = useState<Flow>('paytm');
  const [shellTheme, setShellTheme] = useState<ShellTheme>('dark');

  // paytm flow
  const [paytmStep, setPaytmStep] = useState<PaytmStep>('pay');

  // badge flow
  const [step, setStep] = useState<Step>('home');
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [boostApplied, setBoostApplied] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  const deviceRef = useRef<HTMLDivElement>(null);
  const getDevice = useCallback(() => deviceRef.current?.querySelector<HTMLElement>('.device') ?? null, []);

  const openUnlock = useCallback(() => {
    setBadgeEarned(true);
    setStep('unlock');
    setPlayKey((k) => k + 1);
  }, []);

  const resetBadge = useCallback(() => {
    setStep('home');
    setBadgeEarned(false);
    setBoostApplied(false);
    setRating(null);
    setSheetOpen(false);
  }, []);

  const title = flow === 'paytm' ? PAYTM_TITLE[paytmStep] : BADGE_TITLE[step];

  return (
    <div className="stage" data-studio={shellTheme === 'light' ? 'light' : 'dark'}>
      <div className="stage__glow" aria-hidden="true" />
      <div className="stage__grid" aria-hidden="true" />

      <div className="stage__device" ref={deviceRef}>
        <DeviceShell
          screenTheme="light"
          shellTheme={shellTheme}
          time={flow === 'paytm' ? '12:30' : '9:41'}
          homeIndicatorColor="rgba(0,0,0,0.26)"
          label={`${title} — interactive prototype`}
        >
          {flow === 'paytm' ? (
            <div className="screens screens--paytm">
              <PaytmFlow step={paytmStep} setStep={setPaytmStep} resetKey={0} />
            </div>
          ) : (
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
                  onGoHome={() => {
                    setSheetOpen(false);
                    setStep('home');
                  }}
                />
              )}

              {step === 'detail' && (
                <BadgeDetailScreen
                  onBack={openUnlock}
                  onClaim={() => {
                    setBoostApplied(true);
                    setStep('home');
                  }}
                  boostApplied={boostApplied}
                />
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
          )}
        </DeviceShell>
      </div>

      <div className="stage__meta">
        <span className="stage__caption">{title}</span>

        <ExportBar getTarget={getDevice} title={title} />

        <div className="stage__controls">
          <button
            type="button"
            className="stage__control"
            aria-pressed={flow === 'paytm'}
            onClick={() => setFlow((f) => (f === 'paytm' ? 'badge' : 'paytm'))}
          >
            {flow === 'paytm' ? 'Paytm flow' : 'Badge flow'}
          </button>

          {flow === 'paytm' ? (
            <>
              <button type="button" className="stage__control" onClick={() => setPaytmStep('pay')}>
                Restart payment
              </button>
              <button
                type="button"
                className="stage__control"
                onClick={() => setPaytmStep(PAYTM_ORDER[(PAYTM_ORDER.indexOf(paytmStep) + 1) % PAYTM_ORDER.length])}
              >
                Next screen ›
              </button>
            </>
          ) : (
            <>
              <button type="button" className="stage__control" onClick={openUnlock}>
                Replay unlock
              </button>
              <button type="button" className="stage__control" onClick={resetBadge}>
                Reset flow
              </button>
            </>
          )}

          <button
            type="button"
            className="stage__control"
            aria-pressed={shellTheme === 'light'}
            onClick={() => setShellTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {shellTheme === 'dark' ? 'Dark shell' : 'Light shell'}
          </button>
        </div>

        {flow === 'paytm' && (
          <div className="stage__jump" role="tablist" aria-label="Screens">
            {PAYTM_ORDER.map((s, i) => (
              <button
                key={s}
                role="tab"
                type="button"
                aria-selected={s === paytmStep}
                aria-label={`Screen ${i + 1}: ${PAYTM_TITLE[s]}`}
                className="stage__jump-dot"
                onClick={() => setPaytmStep(s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
