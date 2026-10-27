import { BadgeGem } from '../art/BadgeGem';
import { GhostTrail, Sparkle } from '../art/Sparkles';
import { Confetti } from '../art/Confetti';

export type UnlockScreenProps = {
  onViewBadge: () => void;
  onGoHome: () => void;
  onRate: () => void;
  /** Rating already given — swap the prompt for a thank-you line. */
  rating: number | null;
  /** Bumped to replay the celebration. */
  playKey: number;
};

/**
 * "New Badge unlocked!" — the screen in the reference shot, rebuilt in pt.
 *
 * Everything is positioned against the 393 × 852 screen so the layout lands on
 * the same pixels as the mockup, and each element enters on its own delay to
 * build the reveal.
 */
export function UnlockScreen({ onViewBadge, onGoHome, onRate, rating, playKey }: UnlockScreenProps) {
  return (
    <div className="scr scr--unlock">
      <div className="unlock__stage">
        <div className="unlock__rays" aria-hidden="true" />
        <GhostTrail className="unlock__trail" />
        <div className="unlock__burst">
          <Confetti burstKey={playKey} />
        </div>

        <div className="unlock__halo" aria-hidden="true" />

        <div className="unlock__badge">
          <BadgeGem className="unlock__gem" />
          <span className="unlock__shine" aria-hidden="true" />
          <span className="unlock__mult">×3</span>
        </div>

        <p className="unlock__name">Perfect Month</p>

        <h1 className="unlock__title">
          New
          <br />
          Badge unlocked!
        </h1>

        <p className="unlock__sub">You stayed within your budget. Keep up the great work!</p>
      </div>

      <div className="unlock__actions">
        <button className="rate-card" type="button" onClick={onRate}>
          <span className="rate-card__art" aria-hidden="true">
            <Sparkle className="rate-card__star rate-card__star--1" />
            <Sparkle className="rate-card__star rate-card__star--2" />
            <Sparkle className="rate-card__star rate-card__star--3" />
            <span className="rate-card__dot rate-card__dot--1" />
            <span className="rate-card__dot rate-card__dot--2" />
          </span>
          <span className="rate-card__body">
            {rating === null ? (
              <>
                <span className="rate-card__question">
                  Are you loving your experience with us so far?
                </span>
                <span className="rate-card__link">Give us a rating</span>
              </>
            ) : (
              <>
                <span className="rate-card__question">Thanks for the feedback!</span>
                <span className="rate-card__link rate-card__link--done">
                  You rated us {'★'.repeat(rating)}
                  {'☆'.repeat(5 - rating)}
                </span>
              </>
            )}
          </span>
        </button>

        <button className="pill" type="button" onClick={onViewBadge}>
          View Badge
        </button>

        <button className="text-btn" type="button" onClick={onGoHome}>
          Got to Home
        </button>
      </div>
    </div>
  );
}
