import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Job } from '../types';
import { clipStyles } from '../data/presentation';
import { formatDate, postingAge } from '../lib/format';
import { gsap } from '../lib/gsap';
import { ApplicationForm } from './ApplicationForm';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';

type Props = {
  job: Job;
  origin: HTMLElement;
  /** Called when the close animation has finished; parent unmounts and restores focus. */
  onExit: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Rotation (deg) of the element a clipping lives in, read from its computed transform. */
function angleOf(el: HTMLElement): number {
  const t = getComputedStyle(el).transform;
  if (!t || t === 'none') return 0;
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const [a, b] = m[1].split(',').map(Number);
  return (Math.atan2(b, a) * 180) / Math.PI;
}

function originTransformTarget(origin: HTMLElement): HTMLElement {
  return (origin.closest('.board-piece') as HTMLElement | null) ?? origin;
}

export function JobDialog({ job, origin, onExit }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);
  const creaseRef = useRef<HTMLSpanElement>(null);
  const closingRef = useRef(false);
  const pointerDownOnBackdrop = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const [closing, setClosing] = useState(false);
  const style = clipStyles[job.id];

  // Animate the sheet out from the originating clipping (or simply fade on mobile / reduced motion).
  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    timelineRef.current?.kill();

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return onExit();

    const tl = gsap.timeline({ onComplete: onExit });
    timelineRef.current = tl;

    if (reduced || mobile) {
      tl.to(contentRef.current, { opacity: 0, duration: 0.12 }, 0)
        .to(panel, { opacity: 0, y: mobile ? 24 : 0, duration: 0.24, ease: 'power2.in' }, 0.04)
        .to(backdrop, { opacity: 0, duration: 0.24 }, 0.04);
      return;
    }

    const o = origin.isConnected ? origin.getBoundingClientRect() : null;
    const inView = o && o.bottom > 0 && o.top < window.innerHeight && o.width > 0;
    const fin = panel.getBoundingClientRect();
    tl.to(contentRef.current, { opacity: 0, duration: 0.14, ease: 'power1.out' }, 0);
    tl.to(backdrop, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.06);
    if (inView && o) {
      const angle = angleOf(originTransformTarget(origin));
      tl.to(
        panel,
        {
          x: o.left + o.width / 2 - (fin.left + fin.width / 2),
          y: o.top + o.height / 2 - (fin.top + fin.height / 2),
          scaleX: o.width / fin.width,
          scaleY: o.height / fin.height,
          rotation: angle,
          boxShadow: '0 4px 12px rgba(16,44,70,0.12)',
          duration: 0.55,
          ease: 'power3.inOut',
        },
        0.04,
      );
    } else {
      tl.to(panel, { scale: 0.96, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.04);
    }
  };

  // Open: morph from the origin rect, then reveal content once the sheet settles.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const content = contentRef.current;
    if (!panel || !backdrop || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      timelineRef.current = tl;
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.01 : 0.35, ease: 'power1.out' }, 0);

      if (reduced) {
        gsap.set(content, { opacity: 1 });
        return;
      }

      if (mobile) {
        tl.fromTo(panel, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.36, ease: 'power3.out' }, 0);
        tl.fromTo(content, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, 0.14);
        return;
      }

      const o = origin.isConnected ? origin.getBoundingClientRect() : null;
      const inView = o && o.bottom > 0 && o.top < window.innerHeight && o.width > 0;
      const fin = panel.getBoundingClientRect();
      gsap.set(content, { opacity: 0 });
      gsap.set(panel, { transformPerspective: 1400, transformOrigin: '50% 50%' });

      if (inView && o) {
        const angle = angleOf(originTransformTarget(origin));
        tl.fromTo(
          panel,
          {
            x: o.left + o.width / 2 - (fin.left + fin.width / 2),
            y: o.top + o.height / 2 - (fin.top + fin.height / 2),
            scaleX: o.width / fin.width,
            scaleY: o.height / fin.height,
            rotation: angle,
            rotationX: 0,
            boxShadow: '0 2px 6px rgba(16,44,70,0.08)',
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            // A restrained lift: a small tilt that settles flat, like a sheet being turned over.
            rotationX: 0,
            boxShadow: '0 28px 60px -24px rgba(16,44,70,0.45)',
            duration: 0.72,
            ease: 'power3.inOut',
          },
          0,
        );
        // Fold cue: a faint crease and a light sheen crossing the sheet during the morph.
        tl.fromTo(
          creaseRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 0.3, ease: 'power2.out' },
          0.18,
        ).to(creaseRef.current, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.5);
        tl.fromTo(
          sheenRef.current,
          { xPercent: -120, opacity: 0 },
          { xPercent: 120, opacity: 1, duration: 0.6, ease: 'power2.inOut' },
          0.12,
        ).to(sheenRef.current, { opacity: 0, duration: 0.15 }, 0.62);
        tl.fromTo(
          panel,
          { rotationX: 5 },
          { rotationX: 0, duration: 0.55, ease: 'power2.out' },
          0.1,
        );
      } else {
        tl.fromTo(panel, { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);
      }

      tl.fromTo(
        content,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        0.56,
      );
    }, panel);
    return () => ctx.revert();
    // Opening only runs once per mounted dialog; the origin is fixed for this session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll lock + focus into the dialog + Escape + focus trap.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevOverflow = html.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    headingRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
    // requestClose reads refs only; registering once per mount is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kill any in-flight timeline on unmount.
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      className={`dialog-backdrop${closing ? ' is-closing' : ''}`}
      onPointerDown={(e) => {
        pointerDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // Close only when the press and release both happen on the backdrop, never from inside the sheet.
        if (pointerDownOnBackdrop.current && e.target === e.currentTarget) requestClose();
        pointerDownOnBackdrop.current = false;
      }}
    >
      <div
        ref={panelRef}
        className={`dialog-panel${mobile ? ' dialog-panel--sheet' : ''} clip-paper clip-paper--${style.variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-summary"
      >
        <span ref={creaseRef} className="fold-crease" aria-hidden="true" />
        <span ref={sheenRef} className="fold-sheen" aria-hidden="true" />

        <div className="dialog-bar">
          <span className="dialog-bar__mark">{job.companyMark}</span>
          <button type="button" className="dialog-close" onClick={requestClose} aria-label="Close role details">
            <span aria-hidden="true">×</span> Close
          </button>
        </div>

        <div ref={contentRef} className="dialog-scroll">
          <header className="dialog-head">
            <p className="dialog-company">
              {job.company} <span aria-hidden="true">·</span> {job.location}
            </p>
            <h2 id="dialog-title" ref={headingRef} tabIndex={-1} className="dialog-title">
              {job.title}
            </h2>
            <dl className="facts">
              <div>
                <dt>Work style</dt>
                <dd>{job.workMode}</dd>
              </div>
              <div>
                <dt>Employment</dt>
                <dd>{job.employmentType}</dd>
              </div>
              <div>
                <dt>Posted</dt>
                <dd>
                  {formatDate(job.postedAt)} <span className="facts__age">({postingAge(job.postedAt).replace('Posted ', '')})</span>
                </dd>
              </div>
              {job.compensation && (
                <div>
                  <dt>Compensation</dt>
                  <dd>{job.compensation}</dd>
                </div>
              )}
            </dl>
            <p id="dialog-summary" className="dialog-summary">
              {job.summary}
            </p>
          </header>

          <div className="dialog-sections">
            <section aria-labelledby="dialog-resp">
              <h3 id="dialog-resp">Responsibilities</h3>
              <ul>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="dialog-req">
              <h3 id="dialog-req">Requirements</h3>
              <ul>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
            {job.niceToHave && job.niceToHave.length > 0 && (
              <section aria-labelledby="dialog-nice">
                <h3 id="dialog-nice">Nice to have</h3>
                <ul>
                  {job.niceToHave.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="dialog-apply">
            <ApplicationForm job={job} />
          </div>
        </div>
      </div>
    </div>
  );
}
