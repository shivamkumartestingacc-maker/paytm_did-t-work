import { useId, useRef, useState, type FormEvent } from 'react';
import type { Job } from '../types';
import {
  emptyValues,
  NOTE_MAX,
  validateApplication,
  type ApplicationErrors,
  type ApplicationValues,
} from '../lib/validation';
import { submitApplication } from '../lib/submitApplication';
import { isDemoSubmission } from '../lib/submitStatus';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; message: string; demo: boolean }
  | { kind: 'error'; message: string };

const FIELD_ORDER: (keyof ApplicationValues)[] = ['name', 'email', 'portfolio', 'resumeLink', 'note'];

export function ApplicationForm({ job }: { job: Job }) {
  const uid = useId();
  const [values, setValues] = useState<ApplicationValues>(emptyValues);
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);

  const id = (name: string) => `${uid}-${name}`;

  const update = (key: keyof ApplicationValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onBlur = (key: keyof ApplicationValues) => {
    const next = validateApplication({ ...values });
    if (next[key]) setErrors((e) => ({ ...e, [key]: next[key] }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === 'submitting') return;

    const found = validateApplication(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus({ kind: 'submitting' });
    try {
      const result = await submitApplication(job, values);
      setStatus({ kind: 'success', message: result.message, demo: result.mode === 'demo' });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong. Your details are still in the form.',
      });
    }
  };

  const reset = () => {
    setValues(emptyValues);
    setErrors({});
    setStatus({ kind: 'idle' });
  };

  if (status.kind === 'success') {
    return (
      <div className="form-result form-result--success" role="status" tabIndex={-1}>
        <p className="form-result__title">
          {status.demo ? 'Demo submission received' : 'Application sent'}
        </p>
        <p>{status.message}</p>
        {status.demo && (
          <p className="form-result__note">
            The details stayed in this browser tab. No email was sent and no employer received them.
          </p>
        )}
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Start another application
        </button>
      </div>
    );
  }

  const submitting = status.kind === 'submitting';

  return (
    <form ref={formRef} className="app-form" onSubmit={onSubmit} noValidate aria-labelledby={id('legend')}>
      <p id={id('legend')} className="app-form__legend">
        Apply for {job.title}
      </p>
      <p className="app-form__mode" role="note">
        {isDemoSubmission ? (
          <>
            <strong>Demo mode.</strong> This form does not send anything to {job.company}. Connect a real endpoint
            (see README) to deliver applications.
          </>
        ) : (
          <>Your application is sent to a configured endpoint for {job.company}.</>
        )}
      </p>

      <div className="field">
        <label htmlFor={id('name')}>
          Full name <span className="req">(required)</span>
        </label>
        <input
          id={id('name')}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          onBlur={() => onBlur('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? id('name-err') : undefined}
          disabled={submitting}
        />
        {errors.name && (
          <p id={id('name-err')} className="field__error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={id('email')}>
          Email <span className="req">(required)</span>
        </label>
        <input
          id={id('email')}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          onBlur={() => onBlur('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? id('email-err') : undefined}
          disabled={submitting}
        />
        {errors.email && (
          <p id={id('email-err')} className="field__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={id('portfolio')}>
          Portfolio or LinkedIn URL <span className="opt">(optional)</span>
        </label>
        <input
          id={id('portfolio')}
          name="portfolio"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.portfolio}
          onChange={(e) => update('portfolio', e.target.value)}
          onBlur={() => onBlur('portfolio')}
          aria-invalid={Boolean(errors.portfolio)}
          aria-describedby={errors.portfolio ? id('portfolio-err') : undefined}
          disabled={submitting}
        />
        {errors.portfolio && (
          <p id={id('portfolio-err')} className="field__error">
            {errors.portfolio}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={id('resumeLink')}>
          Resume link <span className="req">(required)</span>
        </label>
        <p id={id('resume-hint')} className="field__hint">
          Paste a shareable link (Google Drive, Dropbox, or your site). File upload isn’t available in this demo.
        </p>
        <input
          id={id('resumeLink')}
          name="resumeLink"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.resumeLink}
          onChange={(e) => update('resumeLink', e.target.value)}
          onBlur={() => onBlur('resumeLink')}
          aria-invalid={Boolean(errors.resumeLink)}
          aria-describedby={errors.resumeLink ? `${id('resume-hint')} ${id('resume-err')}` : id('resume-hint')}
          disabled={submitting}
        />
        {errors.resumeLink && (
          <p id={id('resume-err')} className="field__error">
            {errors.resumeLink}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={id('note')}>
          Short note <span className="opt">(optional)</span>
        </label>
        <textarea
          id={id('note')}
          name="note"
          rows={4}
          value={values.note}
          onChange={(e) => update('note', e.target.value)}
          onBlur={() => onBlur('note')}
          aria-invalid={Boolean(errors.note)}
          aria-describedby={errors.note ? id('note-err') : id('note-count')}
          disabled={submitting}
        />
        <p id={id('note-count')} className="field__hint">
          {values.note.length} / {NOTE_MAX}
        </p>
        {errors.note && (
          <p id={id('note-err')} className="field__error">
            {errors.note}
          </p>
        )}
      </div>

      {status.kind === 'error' && (
        <p className="field__error form-alert" role="alert">
          {status.message}
        </p>
      )}

      <div className="app-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting} aria-busy={submitting}>
          {submitting ? 'Sending…' : isDemoSubmission ? 'Submit demo application' : 'Send application'}
        </button>
      </div>
    </form>
  );
}
