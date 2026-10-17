import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Job, WorkMode } from '../types';
import { jobs } from '../data/jobs';
import { clipStyles } from '../data/presentation';
import { GridClipping } from './ClippingCard';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useMediaQuery';

type Props = {
  onOpen: (job: Job, origin: HTMLElement) => void;
};

type Arrangement = 'All' | WorkMode;
type Region = 'All' | Job['region'];

const ARRANGEMENTS: Arrangement[] = ['All', 'Remote', 'Hybrid', 'On-site'];
const REGIONS: Region[] = ['All', 'Bengaluru', 'Mumbai', 'Remote'];

export function JobBoard({ onOpen }: Props) {
  const [arrangement, setArrangement] = useState<Arrangement>('All');
  const [region, setRegion] = useState<Region>('All');
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (arrangement === 'All' || j.workMode === arrangement) &&
          (region === 'All' || j.region === region),
      ),
    [arrangement, region],
  );

  const idsKey = visible.map((j) => j.id).join('|');

  // Gather: each grid slot starts displaced and rotated like loose paper, then settles as it scrolls into view.
  // Scrubbed to scroll position (no pinning, no scroll hijacking). Re-created when the visible set changes.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      const slots = gsap.utils.toArray<HTMLElement>('.job-slot', root);
      slots.forEach((el) => {
        const id = el.dataset.jobId ?? '';
        const style = clipStyles[id];
        if (!style) return;
        gsap.fromTo(
          el,
          { x: style.looseX, y: style.looseY, rotation: style.looseRotate, scale: 0.96, transformOrigin: '50% 50%' },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 98%',
              end: 'top 52%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [idsKey, reduced]);

  const reset = () => {
    setArrangement('All');
    setRegion('All');
  };

  return (
    <section id="roles" className="roles" aria-labelledby="roles-title" ref={rootRef}>
      <div className="roles__inner">
        <header className="roles__head">
          <p className="roles__eyebrow">Open roles · {jobs.length} sample listings</p>
          <h2 id="roles-title" tabIndex={-1} className="roles__title">
            Gathered on the board
          </h2>
          <p className="roles__intro">
            Every card is a button. Open one to read the brief, then apply from the same sheet.
          </p>
          <span className="roles__hand" aria-hidden="true">
            ↑ the clippings, settling
          </span>
        </header>

        <div className="filters">
          <fieldset className="filter-group">
            <legend>Work style</legend>
            <div className="filter-group__options">
              {ARRANGEMENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="chip"
                  aria-pressed={arrangement === a}
                  onClick={() => setArrangement(a)}
                >
                  {a === 'All' ? 'Any' : a}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="filter-group">
            <legend>Location</legend>
            <div className="filter-group__options">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="chip"
                  aria-pressed={region === r}
                  onClick={() => setRegion(r)}
                >
                  {r === 'All' ? 'Any' : r}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="filters__count" role="status" aria-live="polite">
            Showing {visible.length} of {jobs.length} roles
          </p>
        </div>

        {visible.length > 0 ? (
          <div className="job-grid" role="list">
            {visible.map((job) => (
              <div key={job.id} className="job-slot" data-job-id={job.id} role="listitem">
                <GridClipping job={job} onOpen={onOpen} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state__title">No roles match these filters.</p>
            <p>
              Try a wider location or work style. Nothing is lost: all {jobs.length} sample roles are still on the
              board.
            </p>
            <button type="button" className="btn btn--ghost" onClick={reset}>
              Show all roles
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
