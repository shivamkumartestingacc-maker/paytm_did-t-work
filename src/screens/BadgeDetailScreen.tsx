import { BadgeGem } from '../art/BadgeGem';
import { Sparkle } from '../art/Sparkles';

export type BadgeDetailScreenProps = {
  onBack: () => void;
  onClaim: () => void;
  boostApplied: boolean;
};

const STATS = [
  { label: 'Streak', value: '3 mo' },
  { label: 'Multiplier', value: '×3' },
  { label: 'Kept under', value: '₹7,500' },
];

const RULES = [
  {
    title: 'Stay under budget',
    body: 'Finish the month with money left in every category.',
  },
  {
    title: 'Three months running',
    body: 'Each consecutive month raises the multiplier, up to ×5.',
  },
  {
    title: 'Stacks on rewards',
    body: 'The multiplier applies to the next cashback or voucher you claim.',
  },
];

/** The screen after the unlock: what the badge is, and what to do with it. */
export function BadgeDetailScreen({ onBack, onClaim, boostApplied }: BadgeDetailScreenProps) {
  return (
    <div className="scr scr--detail">
      <header className="detail__header">
        <button className="icon-btn" type="button" onClick={onBack} aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
        <span className="detail__crumb">Badges</span>
        <button className="icon-btn" type="button" aria-label="Share badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4m0 0L8 8m4-4 4 4" />
            <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
          </svg>
        </button>
      </header>

      <div className="detail__hero">
        <div className="detail__rays" aria-hidden="true" />
        <div className="detail__badge">
          <BadgeGem className="detail__gem" />
          <span className="detail__mult">×3</span>
        </div>
      </div>

      <h1 className="detail__title">Perfect Month</h1>
      <p className="detail__date">Earned 1 October · 3 months in a row</p>

      <div className="detail__stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="rules">
        <div className="rules__head">
          <Sparkle className="rules__star" />
          <h2 className="rules__title">How you keep it</h2>
        </div>
        <ul className="rules__list">
          {RULES.map((r) => (
            <li className="rules__item" key={r.title}>
              <span className="rules__dot" aria-hidden="true" />
              <span>
                <span className="rules__item-title">{r.title}</span>
                <span className="rules__item-body">{r.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="detail__actions">
        <button className="pill" type="button" onClick={onClaim} disabled={boostApplied}>
          {boostApplied ? '×3 boost queued' : 'Apply ×3 boost'}
        </button>
        <button className="text-btn" type="button" onClick={onBack}>
          Back to badges
        </button>
      </div>
    </div>
  );
}
