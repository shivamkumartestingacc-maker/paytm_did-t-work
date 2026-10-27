import { BackArrow, PaytmLogo } from './art';

/** Blue on-phone header: back, centred wordmark, overflow menu. */
export function PaytmHeader({ onBack, onMenu }: { onBack: () => void; onMenu?: () => void }) {
  return (
    <header className="p-head">
      <button className="p-head__back" type="button" onClick={onBack} aria-label="Back">
        <BackArrow className="p-head__icon" />
      </button>
      <PaytmLogo className="p-head__logo" />
      <button className="p-head__menu" type="button" onClick={onMenu} aria-label="More options">
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

/** The thick navy rule that separates the header from the content. */
export function NavyRule({ className }: { className?: string }) {
  return <div className={`navy-rule${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}

/** Green verified badge next to an amount. */
export function VerifiedTick({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="verified" role="img">
      <path
        d="M12 2.2 14.6 4l3.1-.3 1 3 2.7 1.6-1 3 1 3-2.7 1.6-1 3-3.1-.3L12 21.8 9.4 20l-3.1.3-1-3L2.6 15.7l1-3-1-3L5.3 8.1l1-3L9.4 5.4Z"
        fill="#12B76A"
      />
      <path d="M8 12.2 10.9 15 16 9.4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Payer block: name, UPI id, amount. */
export function PayerBlock({
  name = 'Sumit Kumar Yadav',
  upi = 'q45289534@ybl',
  amount = 500,
  verified = false,
  centered = true,
}: {
  name?: string;
  upi?: string;
  amount?: number | null;
  verified?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={`payer${centered ? ' payer--center' : ''}`}>
      <p className="payer__name">{name}</p>
      <p className="payer__upi">UPI ID: {upi}</p>
      {amount !== null && (
        <p className="payer__amount">
          ₹{amount.toLocaleString('en-IN')}
          {verified && <VerifiedTick className="payer__tick" />}
        </p>
      )}
    </div>
  );
}

const TABS = [
  { id: 'home', label: 'Home', icon: 'M3 10.4 12 3l9 7.4V21H3z' },
  { id: 'scan', label: 'Scan', icon: 'M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3M3 12h18' },
  { id: 'cashback', label: 'Cash Back', icon: 'M12 3v14m0 0-4-4m4 4 4-4M4 21h16' },
];

/** The floating navy capsule nav that sits over the bottom of a screen. */
export function PaytmTabBar({ active = 'home' }: { active?: string }) {
  return (
    <nav className="p-tabbar" aria-label="Paytm navigation">
      {TABS.map((t) => (
        <button key={t.id} className={`p-tabbar__tab${t.id === active ? ' p-tabbar__tab--on' : ''}`} type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={t.icon} />
          </svg>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
