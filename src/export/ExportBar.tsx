import { useCallback, useEffect, useRef, useState } from 'react';
import { copyCode, copyImage, type CopyResult } from './exporters';

export type ExportBarProps = {
  /** Returns the device element to capture. */
  getTarget: () => HTMLElement | null;
  /** Used for the exported file name / document title. */
  title: string;
};

type Status = { kind: 'idle' } | { kind: 'busy'; what: 'image' | 'code' } | { kind: 'done'; what: 'image' | 'code'; result: CopyResult } | { kind: 'error'; message: string };

/**
 * Two actions:
 *   Copy image → PNG of the device (3×), straight to the clipboard.
 *   Copy code  → one self-contained HTML file with the markup and every CSS rule.
 */
export function ExportBar({ getTarget, title }: ExportBarProps) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const announce = useCallback((next: Status) => {
    setStatus(next);
    if (timer.current) window.clearTimeout(timer.current);
    if (next.kind === 'done' || next.kind === 'error') {
      timer.current = window.setTimeout(() => setStatus({ kind: 'idle' }), 4200);
    }
  }, []);

  const run = useCallback(
    async (what: 'image' | 'code') => {
      const target = getTarget();
      if (!target) return;
      announce({ kind: 'busy', what });
      try {
        const result = what === 'image' ? await copyImage(target, `${title.replace(/\s+/g, '-').toLowerCase()}.png`) : await copyCode(target, title);
        announce({ kind: 'done', what, result });
      } catch (err) {
        announce({ kind: 'error', message: err instanceof Error ? err.message : 'Export failed' });
      }
    },
    [announce, getTarget, title],
  );

  const message =
    status.kind === 'busy'
      ? status.what === 'image'
        ? 'Rendering PNG…'
        : 'Packing HTML…'
      : status.kind === 'done'
        ? status.result === 'copied'
          ? status.what === 'image'
            ? 'Screenshot copied to clipboard'
            : 'Code copied to clipboard'
          : 'Clipboard blocked — file downloaded'
        : status.kind === 'error'
          ? status.message
          : '';

  return (
    <div className="export">
      <div className="export__group">
        <button className="export__btn export__btn--primary" type="button" onClick={() => run('image')} disabled={status.kind === 'busy'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M6.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5" />
          </svg>
          Copy image
        </button>

        <button className="export__btn" type="button" onClick={() => run('code')} disabled={status.kind === 'busy'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 17-5-5 5-5m6 10 5-5-5-5" />
          </svg>
          Copy code
        </button>
      </div>

      <span className={`export__status${status.kind === 'error' ? ' export__status--error' : ''}`} role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
