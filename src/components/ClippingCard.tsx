import type { Job } from '../types';
import { clipStyles } from '../data/presentation';
import { postingAge } from '../lib/format';

/** Visual body of a job clipping. The same markup is used in the collage and in the grid. */
export function ClippingBody({ job }: { job: Job }) {
  const style = clipStyles[job.id];
  return (
    <span className={['clip', `clip--${style.variant}`, `clip--tone-${style.tone}`].join(' ')}>
      <span className="clip__top">
        <span className={`mark mark--${style.variant === 'stamp' ? 'ring' : 'text'}`}>{job.companyMark}</span>
        <span className="clip__age">{postingAge(job.postedAt).replace('Posted ', '')}</span>
      </span>
      <span className="clip__title">{job.title}</span>
      <span className="clip__company">{job.company}</span>
      <span className="clip__meta">
        <span>{job.region}</span>
        <span aria-hidden="true">·</span>
        <span>{job.workMode}</span>
      </span>
      <span className="clip__foot">
        <span>{job.employmentType}</span>
        <span className="clip__open" aria-hidden="true">
          Open brief →
        </span>
      </span>
    </span>
  );
}

type PieceProps = {
  job: Job;
  /** False when filtered out: the clipping fades and leaves the tab order. */
  visible: boolean;
  onOpen: (job: Job, origin: HTMLElement) => void;
};

/**
 * One job, one element. It sits in the collage at the start of the page and
 * travels to its grid cell as the visitor scrolls (see Board.tsx).
 * Structure: heading > button, so the job is a real, labelled button.
 */
export function BoardPiece({ job, visible, onOpen }: PieceProps) {
  return (
    <h3
      className={`board-piece${visible ? '' : ' is-filtered'}`}
      data-job-id={job.id}
      inert={!visible}
    >
      <span className="board-piece__inner">
        <button
          type="button"
          className="job-card"
          aria-haspopup="dialog"
          aria-describedby={`${job.id}-meta`}
          data-job-id={job.id}
          onClick={(e) => onOpen(job, e.currentTarget)}
        >
          <ClippingBody job={job} />
          <span id={`${job.id}-meta`} className="visually-hidden">
            {`${job.company}, ${job.location}, ${job.workMode}, ${job.employmentType}. ${postingAge(job.postedAt)}.`}
          </span>
        </button>
      </span>
    </h3>
  );
}
