import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Job } from '../types';
import { jobs } from '../data/jobs';
import { heroLayouts, type HeroLayout } from '../data/presentation';
import { Hero } from './Hero';
import { JobBoard, type Arrangement, type Region } from './JobBoard';
import { BoardPiece } from './ClippingCard';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery';

type Props = {
  onOpen: (job: Job, origin: HTMLElement) => void;
};

type Box = { left: number; top: number; width: number; height: number; rotation: number };
type Pair = { from: Box; to: Box };

const BOX_KEYS: (keyof Box)[] = ['left', 'top', 'width', 'height', 'rotation'];

/**
 * The page-level composition. Hero collage, roles header, and job clippings
 * share one container, so each clipping can travel from its collage slot to
 * its grid cell. Scroll drives the travel (scrubbed, no pinning, no hijacking).
 */
export function Board({ onOpen }: Props) {
  const isTablet = useMediaQuery('(min-width: 720px) and (max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 719px)');
  const layout: HeroLayout = isMobile
    ? heroLayouts.mobile
    : isTablet
      ? heroLayouts.tablet
      : heroLayouts.desktop;
  const reduced = useReducedMotion();

  const boardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [arrangement, setArrangement] = useState<Arrangement>('All');
  const [region, setRegion] = useState<Region>('All');

  const visibleJobs = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (arrangement === 'All' || j.workMode === arrangement) &&
          (region === 'All' || j.region === region),
      ),
    [arrangement, region],
  );
  const visibleIds = useMemo(() => new Set(visibleJobs.map((j) => j.id)), [visibleJobs]);
  const idsKey = visibleJobs.map((j) => j.id).join('|');

  // Fit the fixed-composition hero stage to its container width (never enlarge).
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => setScale(Math.min(1, wrap.clientWidth / layout.width));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [layout.width]);

  // Layout changes (scale, breakpoint) move the measured targets; refresh so the scrub recalculates.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [scale, layout.name]);

  // Entrance: clippings rise into their collage slots, staggered. Runs once per mount.
  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const ctx = gsap.context(() => {
      const inners = gsap.utils.toArray<HTMLElement>('.board-piece__inner', board);
      const marks = gsap.utils.toArray<HTMLElement>('.hero-marks-items > *', board);
      if (reduced) return;
      gsap.fromTo(
        inners,
        { y: (i: number) => 120 + (i % 3) * 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          delay: 0.15,
          clearProps: 'transform,opacity',
        },
      );
      gsap.fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.05, delay: 0.9 });
    }, board);
    return () => ctx.revert();
  }, [reduced]);

  // Collage -> grid choreography.
  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    // Measure every clipping's collage slot and grid cell, relative to the board.
    const measure = (): Pair[] => {
      const base = board.getBoundingClientRect();
      const box = (el: Element, rotation: number): Box => {
        const r = el.getBoundingClientRect();
        return { left: r.left - base.left, top: r.top - base.top, width: r.width, height: r.height, rotation };
      };
      return jobs.map((job) => {
        const layoutPiece = layout.pieces.find((p) => p.id === job.id);
        const slot = board.querySelector(`.hero-slot[data-job-id="${job.id}"]`);
        const cell = board.querySelector(`.grid-slot[data-job-id="${job.id}"]`);
        const from = slot ? box(slot, layoutPiece?.rot ?? 0) : null;
        const to = cell ? box(cell, 0) : null;
        const fallback = from ?? to ?? { left: 0, top: 0, width: 0, height: 0, rotation: 0 };
        return { from: fallback, to: to ?? fallback };
      });
    };

    const pieces = jobs
      .map((job) => board.querySelector<HTMLElement>(`.board-piece[data-job-id="${job.id}"]`))
      .filter((el): el is HTMLElement => el !== null);
    const grid = board.querySelector<HTMLElement>('.job-grid');

    let targets = measure();
    const ctx = gsap.context(() => {
      const fromVars: Record<string, (i: number) => number> = {};
      const toVars: Record<string, (i: number) => number> = {};
      BOX_KEYS.forEach((k) => {
        fromVars[k] = (i: number) => targets[i].from[k];
        toVars[k] = (i: number) => targets[i].to[k];
      });

      // Reduced motion: no scrubbed travel. The clippings change position in one short move when the grid arrives.
      if (reduced) {
        gsap.set(pieces, fromVars as gsap.TweenVars);
        if (!grid) return;
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 70%',
          onToggle: (self) => {
            targets = measure();
            board.style.setProperty('--gather', self.isActive ? '1' : '0');
            gsap.to(pieces, {
              ...(self.isActive ? toVars : fromVars),
              duration: 0.3,
              ease: 'power1.out',
              overwrite: 'auto',
            } as gsap.TweenVars);
          },
        });
        return;
      }

      // Scroll travel: from the collage slot (progress 0) to the grid cell (progress 1).
      const endDistance = () => {
        if (!grid) return 1;
        const gridTop = grid.getBoundingClientRect().top - board.getBoundingClientRect().top;
        const header = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
        return Math.max(1, Math.round(gridTop - header - 24));
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: board,
          start: 'top top',
          end: () => `+=${endDistance()}`,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            targets = measure();
          },
          onUpdate: (self) => {
            board.style.setProperty('--gather', self.progress.toFixed(3));
          },
        },
      });
      tl.fromTo(pieces, fromVars as gsap.TweenVars, toVars as gsap.TweenVars, 0);
    }, board);

    return () => ctx.revert();
    // Rebuild only when the visible set or the breakpoint changes; scale changes are handled by refresh.
  }, [idsKey, reduced, layout.name]);

  return (
    <div ref={boardRef} className="board">
      <Hero layout={layout} scale={scale} wrapRef={wrapRef} />
      <JobBoard
        visibleJobs={visibleJobs}
        arrangement={arrangement}
        region={region}
        onArrangement={setArrangement}
        onRegion={setRegion}
      />
      {jobs.map((job) => (
        <BoardPiece key={job.id} job={job} visible={visibleIds.has(job.id)} onOpen={onOpen} />
      ))}
    </div>
  );
}
