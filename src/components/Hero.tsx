import type { RefObject } from 'react';
import type { HeroLayout } from '../data/presentation';
import { jobs } from '../data/jobs';
import { HeroMarkItems, HeroMarks } from './Marks';

type Props = {
  layout: HeroLayout;
  scale: number;
  wrapRef: RefObject<HTMLDivElement | null>;
};

/**
 * Hero copy, navy frame, and the collage stage. The stage contains only
 * placeholders (where each clipping rests in the collage) and decorative marks.
 * The clippings themselves live in Board so they can travel into the grid.
 */
export function Hero({ layout, scale, wrapRef }: Props) {
  const slotIds = new Set(jobs.map((j) => j.id));
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
              Eight sample roles from fictional companies, pinned to the board like notices. Scroll and they
              gather into a grid. Open any clipping to read the brief and apply.
            </p>
            <p className="hero-hand" aria-hidden="true">
              (scroll, and they’ll line up)
            </p>
          </div>

          <div ref={wrapRef} className="hero-stage-wrap" style={{ height: layout.height * scale }}>
            <div
              className={`hero-stage hero-stage--${layout.name}`}
              aria-hidden="true"
              style={{ width: layout.width, height: layout.height, transform: `translateX(-50%) scale(${scale})` }}
            >
              <HeroMarks marks={layout.marks} width={layout.width} height={layout.height} />
              {layout.pieces
                .filter((p) => slotIds.has(p.id))
                .map((p) => (
                  <div
                    key={p.id}
                    className="hero-slot"
                    data-job-id={p.id}
                    style={{ left: p.x, top: p.y, width: p.w, height: layout.pieceHeight, zIndex: p.z }}
                  />
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
