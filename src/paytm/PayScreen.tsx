import { useEffect, useRef, useState } from 'react';
import { BackArrow, PaytmLogo } from './art';
import { VerifiedTick } from './PaytmChrome';

const PIN_LENGTH = 4;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

/**
 * UPI PIN entry → processing → paid.
 *
 * The PIN is simulated: four taps light the dots, `Pay ₹500` becomes live, and
 * the button press runs the processing sheet before handing over to the
 * success screen. No PIN is stored or validated.
 */
export function PayScreen({ onPaid, onCancel, amount = 500 }: { onPaid: () => void; onCancel: () => void; amount?: number }) {
  const [pin, setPin] = useState('');
  const [phase, setPhase] = useState<'entry' | 'processing' | 'paid'>('entry');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const ready = pin.length === PIN_LENGTH;

  const press = (key: string) => {
    if (phase !== 'entry') return;
    if (key === 'del') setPin((p) => p.slice(0, -1));
    else if (key && pin.length < PIN_LENGTH) setPin((p) => (p.length < PIN_LENGTH ? p + key : p));
  };

  const pay = () => {
    if (!ready || phase !== 'entry') return;
    setPhase('processing');
    timers.current.push(
      window.setTimeout(() => {
        setPhase('paid');
        timers.current.push(window.setTimeout(onPaid, 520));
      }, 1250),
    );
  };

  return (
    <div className="p-scr p-scr--pay">
      <header className="pay__top">
        <button className="p-head__back" type="button" onClick={onCancel} aria-label="Cancel payment">
          <BackArrow className="p-head__icon" />
        </button>
        <PaytmLogo className="p-head__logo" />
        <span className="p-head__ghost" />
      </header>

      <div className="pay__who">
        <span className="pay__avatar" aria-hidden="true">
          SK
        </span>
        <p className="pay__name">Sumit Kumar Yadav</p>
        <p className="pay__upi">
          q45289534@ybl <VerifiedTick className="pay__tick" />
        </p>
      </div>

      <p className="pay__amount">
        <span>₹</span>
        {amount.toLocaleString('en-IN')}
      </p>
      <p className="pay__amount-note">Paying from Paytm UPI Lite</p>

      <div className="pin">
        <p className="pin__label">Enter your UPI PIN</p>
        <div className={`pin__dots${ready ? ' pin__dots--ready' : ''}`} role="group" aria-label="UPI PIN">
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <span key={i} className={`pin__dot${i < pin.length ? ' pin__dot--filled' : ''}`} data-i={i} />
          ))}
        </div>
      </div>

      <div className="keypad" role="group" aria-label="Keypad">
        {KEYS.map((k, i) =>
          k === '' ? (
            <span key={`gap-${i}`} className="keypad__gap" />
          ) : (
            <button key={k} type="button" className={`keypad__key${k === 'del' ? ' keypad__key--del' : ''}`} onClick={() => press(k)} aria-label={k === 'del' ? 'Delete' : k}>
              {k === 'del' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9L3 12z" />
                  <path d="M13 9.5 17 14.5M17 9.5 13 14.5" />
                </svg>
              ) : (
                k
              )}
            </button>
          ),
        )}
      </div>

      <button className="pay__cta" type="button" disabled={!ready} onClick={pay}>
        Pay ₹{amount.toLocaleString('en-IN')}
      </button>
      <p className="pay__secure">Your UPI PIN is never stored or shared</p>

      {phase !== 'entry' && (
        <div className="pay__processing" role="status" aria-live="polite">
          <div className={`pay__proc-card${phase === 'paid' ? ' pay__proc-card--done' : ''}`}>
            <span className={`pay__spinner${phase === 'paid' ? ' pay__spinner--done' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path className="pay__check" d="M6 12.6 10.2 17 18 8.4" stroke="#12B76A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="pay__processing-text">{phase === 'paid' ? 'Payment successful' : 'Processing payment'}</p>
            <p className="pay__processing-sub">{phase === 'paid' ? '₹' + amount.toLocaleString('en-IN') + ' paid' : 'Do not close this screen'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
