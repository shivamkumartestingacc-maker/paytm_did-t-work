import type { ScreenProps } from '../app/flow';

/** TEMPLATE — replace with screen 2. */
export function ScreenB({ go, back }: ScreenProps) {
  return (
    <div className="scr scr--b">
      <header className="b__header">
        <button className="icon-btn" type="button" onClick={back} aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
        <span className="b__crumb">Screen two</span>
        <span className="b__spacer" />
      </header>

      <section className="b__card">
        <p className="b__label">Summary</p>
        <p className="b__value">
          ₹42,500 <span>left of ₹50,000</span>
        </p>
        <div className="b__bar" role="img" aria-label="85 percent remaining">
          <span style={{ width: '85%' }} />
        </div>
      </section>

      <ul className="b__list">
        {['First row of content', 'Second row of content', 'Third row of content'].map((row) => (
          <li className="b__row" key={row}>
            <span className="b__dot" aria-hidden="true" />
            <span className="b__row-text">{row}</span>
            <span className="b__row-meta">12:40</span>
          </li>
        ))}
      </ul>

      <div className="b__actions">
        <button className="pill" type="button" onClick={() => go('screen-a')}>
          Start over
        </button>
      </div>
    </div>
  );
}
