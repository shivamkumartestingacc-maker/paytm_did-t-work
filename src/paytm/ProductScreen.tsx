import { useState } from 'react';
import { BackArrow, FeatureIcon, GivaMark, Necklace } from './art';

const FEATURES = [
  { icon: 'devices', tone: 'blue', label: 'Electronics' },
  { icon: 'coin', tone: 'yellow', label: 'No min. order value' },
  { icon: 'discount', tone: 'yellow', label: 'Rs 4,400 Off' },
  { icon: 'check', tone: 'green', label: 'Valid on all products' },
] as const;

const HOW_TO = [
  'Click on the Redeem Now button & add the product you want to your cart.',
  'Apply the coupon code at checkout to get 32% off.',
  'Your GIVA gold coin reward is credited within 24 hours of delivery.',
];

/** The coupon detail page the reward opens. */
export function ProductScreen({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const code = 'CKSSUEOGH679w0c673';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard can be blocked — the state still confirms the tap */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="p-scr p-scr--product">
      <div className="product__scroll">
        <div className="hero">
          <div className="hero__silk" aria-hidden="true" />
          <Necklace className="hero__necklace" links={26} />
          <button className="hero__back" type="button" onClick={onBack} aria-label="Back to rewards">
            <BackArrow className="hero__back-icon" />
          </button>
        </div>

        <GivaMark className="product__mark" />
        <p className="product__brand">GIVA</p>
        <h1 className="product__title">Flat 32% off on MOV of Rs 5,000</h1>
        <p className="product__valid">Valid till: Sept, 2026</p>

        <div className="features">
          {FEATURES.map((f) => (
            <div className="feature" key={f.label}>
              <span className={`feature__disc feature__disc--${f.tone}`}>
                <FeatureIcon name={f.icon} tone={f.tone} />
              </span>
              <span className="feature__label">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="rule-dotted" />

        <p className="code__label">CODE</p>
        <div className="code">
          <span className="code__value">{code}</span>
          <button className={`code__copy${copied ? ' code__copy--done' : ''}`} type="button" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="rule-dotted" />

        <h2 className="how__title">How to Avail</h2>
        <ul className="how__list">
          {HOW_TO.map((t) => (
            <li className="how__item" key={t}>
              <span className="how__dot" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="product__footer">
        <button className={`product__redeem${redeemed ? ' product__redeem--done' : ''}`} type="button" onClick={() => setRedeemed(true)}>
          {redeemed ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5 10 17.5 19 7" />
              </svg>
              Redeemed
            </>
          ) : (
            'Redeem Now'
          )}
        </button>
        <p className="product__terms">
          By proceeding, you agree to <span>Terms &amp; Conditions</span>
        </p>
      </div>

      {redeemed && (
        <div className="redeemed-sheet" role="status" aria-live="polite">
          <div className="redeemed-sheet__card">
            <span className="redeemed-sheet__tick" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#12B76A" />
                <path d="M7 12.4 10.6 16 17 8.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="redeemed-sheet__title">Coupon redeemed</p>
            <p className="redeemed-sheet__sub">
              Code <strong>{code}</strong> is saved to your GIVA account. Your gold coin arrives within 24 hours.
            </p>
            <button className="redeemed-sheet__btn" type="button" onClick={onBack}>
              Back to rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
