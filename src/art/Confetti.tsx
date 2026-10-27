import type { CSSProperties } from 'react';

/**
 * Celebration confetti. Deterministic (index-derived) so it looks the same on
 * every play, and animated purely with CSS transforms on the compositor.
 */
const PIECES = Array.from({ length: 26 }, (_, i) => {
  const angle = (i / 26) * Math.PI * 2 + (i % 3) * 0.22;
  const distance = 92 + ((i * 37) % 86);
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance * 0.72,
    rot: (i * 53) % 360,
    delay: (i % 7) * 26,
    size: 2.2 + ((i * 13) % 4) * 0.55,
    hue: i % 4,
  };
});

export function Confetti({ burstKey }: { burstKey: number }) {
  return (
    <div className="confetti" key={burstKey} aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={`confetti__piece confetti__piece--${p.hue}`}
          style={
            {
              width: `${p.size * 3.4}pt`,
              height: `${p.size}pt`,
              '--x': `${p.x}pt`,
              '--y': `${p.y}pt`,
              '--rot': `${p.rot}deg`,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
