import { useEffect, useState } from 'react';

export type RatingSheetProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (stars: number) => void;
};

/** Bottom sheet that the "Give us a rating" prompt opens. */
export function RatingSheet({ open, onClose, onSubmit }: RatingSheetProps) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (open) {
      setStars(0);
      setHover(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const active = hover || stars;

  return (
    <div className={`sheet${open ? ' sheet--open' : ''}`} aria-hidden={!open}>
      <button className="sheet__scrim" type="button" onClick={onClose} tabIndex={open ? 0 : -1} aria-label="Close" />
      <div className="sheet__panel" role="dialog" aria-modal="true" aria-label="Rate your experience">
        <span className="sheet__grabber" aria-hidden="true" />
        <h2 className="sheet__title">How are we doing?</h2>
        <p className="sheet__sub">Your rating helps us tune the badges you get.</p>

        <div className="sheet__stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`star${n <= active ? ' star--on' : ''}`}
              onMouseEnter={() => setHover(n)}
              onFocus={() => setHover(n)}
              onClick={() => setStars(n)}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              aria-pressed={n === stars}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2.6l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.8l1.2-6.6L2.5 9.6l6.6-.9z"
                  fill="currentColor"
                />
              </svg>
            </button>
          ))}
        </div>

        <button className="pill pill--sheet" type="button" disabled={stars === 0} onClick={() => onSubmit(stars)}>
          {stars === 0 ? 'Pick a rating' : 'Submit rating'}
        </button>
        <button className="text-btn text-btn--sheet" type="button" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  );
}
