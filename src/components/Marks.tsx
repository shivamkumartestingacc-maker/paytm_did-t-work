import type { HeroMark } from '../data/presentation';

/** Hand-drawn SVG marks. Decorative only: hidden from assistive tech, no pointer events. */
export function HeroMarks({ marks, width, height }: { marks: HeroMark[]; width: number; height: number }) {
  return (
    <svg
      className="hero-marks"
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      width={width}
      height={height}
    >
      {marks.map((m, i) => {
        if (m.kind === 'arrow') {
          return (
            <path
              key={i}
              className="hero-marks__draw"
              d={m.d}
              style={{ animationDelay: `${m.delay}s` }}
              pathLength={1}
            />
          );
        }
        return null;
      })}
    </svg>
  );
}

/** Non-SVG decorative pieces (stamps, notes, circles) rendered as absolutely positioned HTML. */
export function HeroMarkItems({ marks }: { marks: HeroMark[] }) {
  return (
    <>
      {marks.map((m, i) => {
        switch (m.kind) {
          case 'stamp':
            return (
              <span
                key={i}
                className={`stamp stamp--${m.tone}`}
                style={{ left: m.x, top: m.y, width: m.size, height: m.size, transform: `rotate(${m.rot}deg)` }}
              >
                <span>{m.text}</span>
              </span>
            );
          case 'note':
            return (
              <span
                key={i}
                className="note"
                style={{ left: m.x, top: m.y, width: m.w, transform: `rotate(${m.rot}deg)` }}
              >
                {m.text}
              </span>
            );
          case 'circle':
            return (
              <svg
                key={i}
                className="hand-circle"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ left: m.x, top: m.y, width: m.w, height: m.h, transform: `rotate(${m.rot}deg)` }}
              >
                <path
                  pathLength={1}
                  d="M 52 4 C 84 2, 98 22, 96 50 C 94 80, 70 97, 46 96 C 18 95, 2 74, 4 46 C 6 20, 26 4, 60 6"
                />
              </svg>
            );
          case 'underline':
            return (
              <svg
                key={i}
                className="hand-underline"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                style={{ left: m.x, top: m.y, width: m.w, transform: `rotate(${m.rot}deg)` }}
              >
                <path pathLength={1} d="M 2 6 C 30 2, 60 9, 98 3" />
              </svg>
            );
          case 'tape':
            return (
              <span
                key={i}
                className="tape"
                style={{ left: m.x, top: m.y, width: m.w, transform: `rotate(${m.rot}deg)` }}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
