import type { Job, WorkMode } from '../types';
import { jobs } from '../data/jobs';

export type Arrangement = 'All' | WorkMode;
export type Region = 'All' | Job['region'];

const ARRANGEMENTS: Arrangement[] = ['All', 'Remote', 'Hybrid', 'On-site'];
const REGIONS: Region[] = ['All', 'Bengaluru', 'Mumbai', 'Remote'];

type Props = {
  visibleJobs: Job[];
  arrangement: Arrangement;
  region: Region;
  onArrangement: (a: Arrangement) => void;
  onRegion: (r: Region) => void;
};

/**
 * Roles heading, filters, and the grid skeleton. The grid cells are empty
 * placeholders; the clippings are placed onto them by Board.
 */
export function JobBoard({ visibleJobs, arrangement, region, onArrangement, onRegion }: Props) {
  const reset = () => {
    onArrangement('All');
    onRegion('All');
  };

  return (
    <section id="roles" className="roles" aria-labelledby="roles-title">
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
                  onClick={() => onArrangement(a)}
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
                  onClick={() => onRegion(r)}
                >
                  {r === 'All' ? 'Any' : r}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="filters__count" role="status" aria-live="polite">
            Showing {visibleJobs.length} of {jobs.length} roles
          </p>
        </div>

        {visibleJobs.length > 0 ? (
          <div className="job-grid">
            {visibleJobs.map((job) => (
              <div key={job.id} className="grid-slot" data-job-id={job.id} aria-hidden="true" />
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
