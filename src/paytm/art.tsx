import type { ReactNode } from 'react';

/* Paytm wordmark — the real logo is a custom typeface; this is a close
   approximation built from text + the falling-dot accent. */
export function PaytmLogo({ className }: { className?: string }) {
  return (
    <span className={`paytm-logo${className ? ` ${className}` : ''}`} aria-label="Paytm">
      <span className="paytm-logo__word">
        Pay<span className="paytm-logo__tm">tm</span>
      </span>
    </span>
  );
}

/** Back chevron used in the Paytm headers. */
export function BackArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12H4m0 0 7-7m-7 7 7 7" />
    </svg>
  );
}

/** The GIVA monogram chip (white circle, thin wordmark). */
export function GivaMark({ className }: { className?: string }) {
  return (
    <span className={`giva-mark${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span className="giva-mark__word">GIVA</span>
      <svg className="giva-mark__spark" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 0c.6 3.3 2.4 5.1 6 6-3.6.9-5.4 2.7-6 6-.6-3.3-2.4-5.1-6-6 3.6-.9 5.4-2.7 6-6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * The GIVA pendant necklace — drawn as SVG so it stays crisp at any scale.
 * Chain links are generated along an ellipse; the pendant is a faceted
 * cushion-cut stone in a halo setting.
 */
export function Necklace({ className, links = 26 }: { className?: string; links?: number }) {
  const ring = (cx: number, cy: number, rot: number, i: number) => (
    <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <rect x={-4.6} y={-2.6} width={9.2} height={5.2} rx={2.4} fill="none" stroke="url(#chainGrad)" strokeWidth="1.5" />
      <rect x={-3.2} y={-1.6} width={6.4} height={3.2} rx={1.6} fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.7" />
    </g>
  );

  const items = [];
  for (let i = 0; i < links; i++) {
    const t = (i / links) * Math.PI * 2;
    const cx = 100 + Math.cos(t) * 74;
    const cy = 74 + Math.sin(t) * 44;
    const rot = (t * 180) / Math.PI + 90;
    items.push(ring(cx, cy, rot, i));
  }

  return (
    <svg className={className} viewBox="0 0 200 200" role="img" aria-label="GIVA diamond pendant necklace">
      <defs>
        <linearGradient id="chainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9cbd4" />
          <stop offset="0.7" stopColor="#f2f3f7" />
          <stop offset="1" stopColor="#a8aab5" />
        </linearGradient>
        <radialGradient id="stoneGrad" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#e8eaf2" />
          <stop offset="1" stopColor="#b9bdcb" />
        </radialGradient>
        <linearGradient id="bailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f7fa" />
          <stop offset="1" stopColor="#b6b9c5" />
        </linearGradient>
      </defs>

      {items}

      {/* bail */}
      <ellipse cx="100" cy="118" rx="7" ry="9" fill="none" stroke="url(#bailGrad)" strokeWidth="3" />

      {/* halo setting */}
      <g transform="translate(100 148)">
        <rect x={-30} y={-28} width={60} height={56} rx={14} fill="url(#bailGrad)" />
        <rect x={-27} y={-25} width={54} height={50} rx={12} fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.1" />
        {/* pavé dots around the halo */}
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 22) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 24} cy={Math.sin(a) * 22.5} r="1.5" fill="#ffffff" fillOpacity="0.9" />;
        })}
        {/* cushion-cut stone */}
        <path d="M-17-15 17-15 21 0 17 15-17 15-21 0Z" fill="url(#stoneGrad)" />
        <path d="M-17-15-6 0-17 15-21 0Z" fill="#ffffff" fillOpacity="0.75" />
        <path d="M17-15 6 0 17 15 21 0Z" fill="#9ea2b2" fillOpacity="0.55" />
        <path d="M-6 0 0-13 6 0 0 13Z" fill="#ffffff" />
        <path d="M-13-9 13-9 0 0Z" fill="#ffffff" fillOpacity="0.6" />
      </g>
    </svg>
  );
}

/** Feature glyphs on the coupon page. */
export function FeatureIcon({ name, tone }: { name: 'devices' | 'coin' | 'discount' | 'check'; tone: 'blue' | 'yellow' | 'green' }) {
  const paths: Record<string, ReactNode> = {
    devices: (
      <>
        <rect x="2" y="4" width="13" height="10" rx="1.6" />
        <rect x="12" y="9" width="7" height="9" rx="1.6" />
        <path d="M2 17h10" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M9.6 10.2h4.8M9.6 13.8h4.8" />
      </>
    ),
    discount: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M8.5 8.5h.01M15.5 15.5h.01M9 15l6-6" />
      </>
    ),
    check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
  };
  return (
    <svg className={`feature-icon feature-icon--${tone}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/** Small coin / gift / box counters in the rewards strip. */
export function RewardChip({ kind, count }: { kind: 'coin' | 'gift' | 'box'; count: number }) {
  const glyphs: Record<string, ReactNode> = {
    coin: <circle cx="12" cy="12" r="7" fill="#F5B32D" stroke="#fff" strokeWidth="2" />,
    gift: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" fill="#F0764B" />
        <path d="M12 10v10M5 14h14" stroke="#fff" strokeWidth="1.6" />
        <path d="M8.6 10a2.1 2.1 0 1 1 3.4-2.4A2.1 2.1 0 1 1 15.4 10" fill="#F0764B" />
      </>
    ),
    box: (
      <>
        <rect x="5" y="7" width="14" height="11" rx="2" fill="#F2C94C" />
        <path d="M9 7V5h6v2M9 12h6" stroke="#fff" strokeWidth="1.5" />
      </>
    ),
  };
  return (
    <span className="reward-chip">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {glyphs[kind]}
      </svg>
      <span>{count}</span>
    </span>
  );
}
