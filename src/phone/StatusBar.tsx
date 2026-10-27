type Tone = 'dark' | 'light';

export type StatusBarProps = {
  /** Clock label, iOS style. */
  time?: string;
  /** `dark` = dark glyphs on a light screen, `light` = light glyphs on a dark screen. */
  tone?: Tone;
  className?: string;
};

/**
 * iOS status bar: clock on the left, cellular / Wi‑Fi / battery on the right.
 * Sits above screen content and is drawn from the same CSS unit scale as the
 * shell, so it stays proportional at any device size.
 */
export function StatusBar({ time = '9:41', tone = 'dark', className }: StatusBarProps) {
  return (
    <div className={`status-bar status-bar--${tone}${className ? ` ${className}` : ''}`}>
      <span className="status-bar__time">{time}</span>
      <span className="status-bar__icons">
        <svg className="status-bar__icon status-bar__icon--cell" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg className="status-bar__icon status-bar__icon--wifi" viewBox="0 0 16 12" aria-hidden="true">
          <path
            d="M8 11.2 5.55 8.42a3.72 3.72 0 0 1 4.9 0L8 11.2Z"
            fill="currentColor"
          />
          <path
            d="M8 6.05c-1.42 0-2.72.52-3.72 1.38L2.86 5.9A7.44 7.44 0 0 1 8 3.95c1.94 0 3.73.74 5.14 1.95l-1.42 1.53A5.5 5.5 0 0 0 8 6.05Z"
            fill="currentColor"
          />
          <path
            d="M8 1.85a9.3 9.3 0 0 1 6.5 2.6L13.1 5.9A7.1 7.1 0 0 0 8 3.95a7.1 7.1 0 0 0-5.1 1.95L1.5 4.45a9.3 9.3 0 0 1 6.5-2.6Z"
            fill="currentColor"
          />
        </svg>
        <svg className="status-bar__icon status-bar__icon--battery" viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2.2" y="2.2" width="18.6" height="8.6" rx="2.2" fill="currentColor" />
          <path d="M24 4.4c1.1.35 1.1 3.85 0 4.2V4.4Z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}
