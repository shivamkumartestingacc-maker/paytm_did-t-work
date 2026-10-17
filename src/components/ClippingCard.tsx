import type { Job } from '../types';
import { clipStyles } from '../data/presentation';
import { postingAge } from '../lib/format';

type Props = {
  job: Job;
  /** 'hero' = decorative collage piece (mouse/touch only, hidden from AT).
   *  'grid' = the accessible job card (button inside an h3). */
  mode: 'hero' | 'grid';
  onOpen?: (job: Job, origin: HTMLElement) => void;
};

const WORK_MARK: Record<Job['workMode'], string> = {
  Remote: 'Remote',
  Hybrid: 'Hybrid',
  'On-site': 'On-site',
};

/** Shared visual + data presentation for a job clipping. Same Job record as the dialog. */
export const ClippingBody = ({ job, mode }: { job: Job; mode: Props['mode'] }) => {
  const style = clipStyles[job.id];
  const isHero = mode === 'hero';
  return (
    <span
      className={[
        'clip',
        `clip--${style.variant}`,
        `clip--tone-${style.tone}`,
        isHero ? 'clip--hero' : 'clip--grid',
      ].join(' ')}
    >
      <span className="clip__top">
        <span className={`mark mark--${style.variant === 'stamp' ? 'ring' : 'text'}`}>{job.companyMark}</span>
        <span className="clip__age">{postingAge(job.postedAt).replace('Posted ', '')}</span>
      </span>
      <span className="clip__title">{job.title}</span>
      <span className="clip__company">{job.company}</span>
      <span className="clip__meta">
        <span>{job.region === 'Remote' ? 'Remote' : job.region}</span>
        <span aria-hidden="true">·</span>
        <span>{WORK_MARK[job.workMode]}</span>
      </span>
      {!isHero && (
        <span className="clip__foot">
          <span>{job.employmentType}</span>
          <span className="clip__open" aria-hidden="true">
            Open brief →
          </span>
        </span>
      )}
    </span>
  );
};

/** Hero collage piece. Not focusable: the grid below is the keyboard path. */
export function HeroClipping({ job, onOpen }: Omit<Props, 'mode'>) {
  return (
    <div
      className="hero-piece__inner"
      data-job-id={job.id}
      onClick={(e) => onOpen?.(job, e.currentTarget)}
      role="presentation"
    >
      <ClippingBody job={job} mode="hero" />
    </div>
  );
}

/** Grid card: a real button, labelled by its heading. */
export function GridClipping({ job, onOpen }: Omit<Props, 'mode'>) {
  return (
    <h3 className="job-slot__heading">
      <button
        type="button"
        className="job-card"
        aria-haspopup="dialog"
        aria-describedby={`${job.id}-meta`}
        data-job-id={job.id}
        onClick={(e) => onOpen?.(job, e.currentTarget)}
      >
        <ClippingBody job={job} mode="grid" />
        <span id={`${job.id}-meta`} className="visually-hidden">
          {`${job.company}, ${job.location}, ${job.workMode}, ${job.employmentType}. ${postingAge(job.postedAt)}.`}
        </span>
      </button>
    </h3>
  );
}
