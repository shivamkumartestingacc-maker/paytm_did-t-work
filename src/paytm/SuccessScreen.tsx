import { useEffect, useState } from 'react';
import { Necklace } from './art';
import { NavyRule, PayerBlock, PaytmHeader, PaytmTabBar, VerifiedTick } from './PaytmChrome';

/**
 * Payment done. Plays the green-tick confirmation once, then the reward card
 * (the one that was won) slides up already wiggling, waiting to be tapped.
 */
export function SuccessScreen({
  onScratch,
  onBack,
  amount = 500,
}: {
  onScratch: () => void;
  onBack: () => void;
  amount?: number;
}) {
  const [celebrating, setCelebrating] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setCelebrating(false), 1750);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="p-scr p-scr--success">
      <PaytmHeader onBack={onBack} />

      <PayerBlock amount={amount} verified />

      <p className="txn-meta">
        21 Aug, 08:00 PM <span aria-hidden="true">•</span> Ref. No: 63788203851
        <button className="txn-meta__copy" type="button" aria-label="Copy reference number">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2.4" />
            <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </p>

      <div className="txn-actions">
        <button className="txn-pill" type="button">
          Check Balance
        </button>
        <button className="txn-pill" type="button">
          Pay Again
        </button>
        <button className="txn-pill txn-pill--share" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"
              fill="#fff"
              fillOpacity="0.16"
            />
            <path
              d="M9.2 7.6c.3-.6.9-.5 1.2-.1l.8 1.2c.2.4.1.8-.2 1l-.7.6c.5 1.1 1.5 2 2.6 2.5l.6-.7c.2-.2.6-.3.9-.1l1.3.8c.4.2.5.8.2 1.2-.6.9-1.8 1.3-2.8 1-2-.6-3.6-2.2-4.2-4.2-.3-1 0-2.1.3-3Z"
              fill="#fff"
            />
          </svg>
          Share
        </button>
      </div>

      <NavyRule className="navy-rule--mid" />

      <div className="reward-teaser">
        <p className="reward-teaser__eyebrow">You have 1 reward waiting</p>

        <button className="teaser-card" type="button" onClick={onScratch} aria-label="Open your scratch card">
          <span className="teaser-card__cap">Congratulations</span>
          <span className="teaser-card__rings" aria-hidden="true" />
          <span className="teaser-card__title">
            SCRATCH &amp;
            <strong>WIN</strong>
          </span>
          <span className="teaser-card__shine" aria-hidden="true" />
          <span className="teaser-card__cta">Tap to scratch</span>
        </button>

        <p className="reward-teaser__hint">
          You won a <strong>GIVA gold coin</strong> reward with this payment
        </p>
      </div>

      {celebrating && (
        <div className="pay-success" role="status" aria-live="polite">
          <div className="pay-success__card">
            <span className="pay-success__mark">
              <span className="pay-success__ring" aria-hidden="true" />
              <svg className="pay-success__tick" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" fill="#12B76A" />
                <path d="M15 27.2 22.4 34.4 37.4 18.6" />
              </svg>
            </span>
            <p className="pay-success__title">Payment successful</p>
            <p className="pay-success__sub">
              ₹{amount.toLocaleString('en-IN')} sent to Sumit Kumar Yadav
            </p>
            <span className="pay-success__verified">
              <VerifiedTick /> UPI ref 63788203851
            </span>
          </div>
        </div>
      )}

      <PaytmTabBar />

      <div className="success__hidden-prize" aria-hidden="true">
        <Necklace className="success__necklace" links={18} />
      </div>
    </div>
  );
}
