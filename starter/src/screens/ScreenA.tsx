import type { ScreenProps } from '../app/flow';

/**
 * TEMPLATE — replace with screen 1.
 *
 * Rules that keep this shell coherent:
 *  · all sizes are points: calc(<pt> * var(--u))
 *  · stay out of the top 54 pt (status bar + island) and bottom 34 pt (home indicator)
 *  · artwork is inline SVG, never an <img>
 */
export function ScreenA({ go }: ScreenProps) {
  return (
    <div className="scr scr--a">
      <div className="a__hero">
        <span className="a__badge" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="40" height="40" rx="13" fill="url(#aGrad)" />
            <path d="M16 25.5 22 31l10-12" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="aGrad" x1="4" y1="4" x2="44" y2="44">
                <stop stopColor="#7f8cff" />
                <stop offset="1" stopColor="#4b56d8" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <h1 className="a__title">Screen one</h1>
        <p className="a__body">
          Drop the first screen of your flow here. Everything is measured in points, so it renders identically on any
          device size.
        </p>
      </div>

      <div className="a__actions">
        <button className="pill" type="button" onClick={() => go('screen-b')}>
          Continue
        </button>
        <button className="text-btn" type="button" onClick={() => go('screen-b')}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
