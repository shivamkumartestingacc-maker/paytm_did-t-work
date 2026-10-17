import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { Job } from '../types';
import { jobs } from '../data/jobs';
import { heroLayouts, type HeroLayout } from '../data/presentation';
import { HeroClipping } from './ClippingCard';
import { HeroMarkItems, HeroMarks } from './Marks';
import { useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery';

type Props = {
  onOpen: (job: Job, origin: HTMLElement) => void;
};

const jobById = new Map(jobs.map((j) => [j.id, j]));

export function Hero({ onOpen }: Props) {
  const isTablet = useMediaQuery('(min-width: 720px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 719px)');
  const layout: HeroLayout = isMobile
    ? heroLayouts.mobile
    : isTablet
      ? heroLayouts.tablet
      : heroLayouts.desktop;

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [scale, setScale] = useState(1);

  // Fit the fixed-composition stage to its container width (never enlarge).
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => setScale(Math.min(1, wrap.clientWidth / layout.width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [layout.width]);

  // Entrance: clippings rise into place, staggered, with small rotation and depth differences.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ctx = gsap.context(() => {
      const pieces = gsap.utils.toArray<HTMLElement>('.hero-piece', stage);
      pieces.forEach((el) => gsap.set(el, { rotation: Number(el.dataset.rot) }));
      if (reduced) return;
      gsap.fromTo(
        pieces,
        (i: number) => ({
          y: 120 + (i % 3) * 22,
          rotation: Number(pieces[i].dataset.rot) + (i % 2 ? 3.5 : -3.5),
          opacity: 0,
        }),
        {
          y: 0,
          rotation: (i) => Number(pieces[i].dataset.rot),
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          delay: 0.15,
          clearProps: 'opacity',
        },
      );
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>('.hero-marks-items > *', stage),
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.05, delay: 0.9 },
      );
    }, stage);
    return () => ctx.revert();
  }, [layout.name, reduced]);

  const pieces = layout.pieces
    .map((p) => ({ piece: p, job: jobById.get(p.id) }))
    .filter((x): x is { piece: typeof x.piece; job: Job } => Boolean(x.job));

  return (
    <section className="hero" aria-labelledby="hero-title" id="top">
      <div className="hero-frame">
        <div className="hero-canvas">
          <div className="hero-copy">
            <p className="hero-eyebrow">Open roles, clipped and sorted</p>
            <h1 id="hero-title" className="hero-title">
              A good place to find your next thing.
            </h1>
            <p className="hero-lede">
              Eight sample roles from fictional companies, pinned to the board like notices. Open any
              clipping to read the brief and apply.
            </p>
            <p className="hero-hand" aria-hidden="true">
              (scroll, and they’ll line up)
            </p>
          </div>

          <div ref={wrapRef} className="hero-stage-wrap" style={{ height: layout.height * scale }}>
            <div
              ref={stageRef}
              className={`hero-stage hero-stage--${layout.name}`}
              aria-hidden="true"
              style={{
                width: layout.width,
                height: layout.height,
                transform: `translateX(-50%) scale(${scale})`,
              }}
            >
              <HeroMarks marks={layout.marks} width={layout.width} height={layout.height} />
              {pieces.map(({ piece, job }) => (
                <div
                  key={piece.id}
                  className="hero-piece"
                  data-rot={piece.rot}
                  style={{ left: piece.x, top: piece.y, width: piece.w, zIndex: piece.z }}
                >
                  <HeroClipping job={job} onOpen={onOpen} />
                </div>
              ))}
              <div className="hero-marks-items">
                <HeroMarkItems marks={layout.marks} />
              </div>
            </div>
          </div>

          <p className="hero-footnote">
            Demo content: fictional companies and roles. Nothing here is a real employer listing.
          </p>
        </div>
      </div>
    </section>
  );
}
