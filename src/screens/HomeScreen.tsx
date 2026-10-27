import { BadgeGem } from '../art/BadgeGem';
import { Sparkle } from '../art/Sparkles';

export type HomeScreenProps = {
  badgeEarned: boolean;
  boostApplied: boolean;
  onOpenUnlock: () => void;
  onOpenDetail: () => void;
};

const TRANSACTIONS = [
  {
    name: 'Green Basket',
    meta: 'Groceries · Today',
    amount: '−₹1,240',
    icon: 'M3 4h2l2.2 10.2A2 2 0 0 0 9.2 16h8.3a2 2 0 0 0 2-1.6L21 7H6M9.5 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },
  {
    name: 'Metro Card',
    meta: 'Transport · Yesterday',
    amount: '−₹300',
    icon: 'M6 4h12a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Zm0 5h12M8.5 14h1m5 0h1M7 21l2-3m8 3-2-3',
  },
  {
    name: 'Salary',
    meta: 'Income · 1 Oct',
    amount: '+₹62,000',
    icon: 'M3 7h18v10H3zM3 11h18M7 15h3',
  },
];

/**
 * The screen before the unlock: this month's budget, the badge shelf, and — when
 * a badge has just been earned — a floating "New badge unlocked" prompt that
 * leads into the celebration.
 */
export function HomeScreen({ badgeEarned, boostApplied, onOpenUnlock, onOpenDetail }: HomeScreenProps) {
  return (
    <div className="scr scr--home">
      <header className="home__header">
        <div>
          <p className="home__eyebrow">October</p>
          <h1 className="home__title">Your budget</h1>
        </div>
        <button className="avatar" type="button" aria-label="Profile">
          SK
        </button>
      </header>

      <section className="budget-card">
        <div className="budget-card__row">
          <span className="budget-card__label">Left to spend</span>
          <span className="budget-card__chip">
            <Sparkle className="budget-card__chip-star" /> On track
          </span>
        </div>
        <p className="budget-card__amount">
          ₹42,500 <span>/ ₹50,000</span>
        </p>
        <div className="budget-card__bar" role="img" aria-label="85 percent of budget remaining">
          <span style={{ width: '85%' }} />
        </div>
        <p className="budget-card__foot">
          {badgeEarned
            ? boostApplied
              ? '×3 boost is queued for your next reward.'
              : 'Perfect Month earned — you stayed under budget 3 months running.'
            : '2 days left in this month. Keep it up.'}
        </p>
      </section>

      <section className="shelf">
        <div className="shelf__head">
          <h2 className="shelf__title">Badges</h2>
          <span className="shelf__count">{badgeEarned ? '1 of 12' : '0 of 12'}</span>
        </div>

        <div className="shelf__row">
          <button
            className={`badge-tile${badgeEarned ? ' badge-tile--earned' : ' badge-tile--locked'}`}
            type="button"
            onClick={badgeEarned ? onOpenDetail : onOpenUnlock}
          >
            <span className="badge-tile__art">
              <BadgeGem className="badge-tile__gem" />
            </span>
            <span className="badge-tile__name">Perfect Month</span>
            <span className="badge-tile__meta">{badgeEarned ? '×3 multiplier' : 'New'}</span>
          </button>

          <div className="badge-tile badge-tile--locked" aria-hidden="true">
            <span className="badge-tile__art badge-tile__art--ghost">
              <BadgeGem className="badge-tile__gem" />
            </span>
            <span className="badge-tile__name">No-Spend Week</span>
            <span className="badge-tile__meta">0 / 7 days</span>
          </div>

          <div className="badge-tile badge-tile--locked" aria-hidden="true">
            <span className="badge-tile__art badge-tile__art--ghost">
              <BadgeGem className="badge-tile__gem" />
            </span>
            <span className="badge-tile__name">Savings Star</span>
            <span className="badge-tile__meta">Locked</span>
          </div>
        </div>
      </section>

      <section className="feed">
        <h2 className="shelf__title">Activity</h2>
        <ul className="feed__list">
          {TRANSACTIONS.map((t) => (
            <li className="feed__item" key={t.name}>
              <span className="feed__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t.icon} />
                </svg>
              </span>
              <span className="feed__text">
                <span className="feed__name">{t.name}</span>
                <span className="feed__meta">{t.meta}</span>
              </span>
              <span className={`feed__amount${t.amount.startsWith('+') ? ' feed__amount--in' : ''}`}>
                {t.amount}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {!badgeEarned && (
        <button className="toast" type="button" onClick={onOpenUnlock}>
          <span className="toast__art">
            <BadgeGem className="toast__gem" />
          </span>
          <span className="toast__text">
            <span className="toast__kicker">New badge unlocked</span>
            <span className="toast__name">Perfect Month · ×3</span>
          </span>
          <span className="toast__cta">View</span>
        </button>
      )}

      <nav className="tabbar" aria-label="Main">
        {[
          { id: 'home', label: 'Home', icon: 'M3 10.5 12 3l9 7.5V21H3z' },
          { id: 'budget', label: 'Budget', icon: 'M4 19V9m8 10V5m8 14v-7' },
          { id: 'badges', label: 'Badges', icon: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z' },
          { id: 'profile', label: 'You', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 8a8 8 0 0 0-16 0' },
        ].map((t) => (
          <button
            key={t.id}
            className={`tabbar__tab${t.id === 'home' ? ' tabbar__tab--on' : ''}`}
            type="button"
            onClick={t.id === 'badges' ? (badgeEarned ? onOpenDetail : onOpenUnlock) : undefined}
            aria-current={t.id === 'home' ? 'page' : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={t.icon} />
            </svg>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
