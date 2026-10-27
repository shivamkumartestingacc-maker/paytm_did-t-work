import { useCallback, useEffect, useRef, useState } from 'react';
import { Necklace } from './art';

export type ScratchCardProps = {
  revealed: boolean;
  onRevealed: () => void;
  /** Called by the "View Details" pill once the card is open. */
  onViewDetails?: () => void;
  /** Bumped to re-arm the card (restart flow). */
  resetKey?: number;
};

const FOIL_TEXT = ['SCRATCH &', 'WIN'];

/**
 * Scratch card with a real canvas foil.
 *
 * The foil is painted on a canvas (gradient + rings + type) and erased with
 * `destination-out` as the finger/mouse moves. One in ~14 sampled pixels is
 * checked to know when enough is gone, then the card flips to the revealed
 * state (and the confetti fires from the parent).
 */
export function ScratchCard({ revealed, onRevealed, onViewDetails, resetKey = 0 }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const done = useRef(false);
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState(true);

  /** Paint the foil. Sized in CSS px × DPR so the art is crisp on retina. */
  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    // base: deep red → ember
    const base = ctx.createLinearGradient(0, 0, w * 0.6, h);
    base.addColorStop(0, '#52090a');
    base.addColorStop(0.35, '#7d1a10');
    base.addColorStop(0.62, '#a83a19');
    base.addColorStop(1, '#8d2a12');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // concentric rings
    ctx.save();
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.52, w * (0.18 + i * 0.1), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 210, 170, ${0.09 - i * 0.008})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
    // warm glow behind the type
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.52, 4, w * 0.5, h * 0.52, w * 0.55);
    glow.addColorStop(0, 'rgba(255, 140, 80, 0.34)');
    glow.addColorStop(1, 'rgba(255, 140, 80, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // type
    ctx.save();
    ctx.textAlign = 'center';
    const grad = ctx.createLinearGradient(0, h * 0.42, 0, h * 0.6);
    grad.addColorStop(0, '#f6b3f0');
    grad.addColorStop(0.4, '#f7d6a8');
    grad.addColorStop(0.7, '#b8c8f7');
    grad.addColorStop(1, '#e9a6ff');
    ctx.fillStyle = grad;
    ctx.font = `700 ${Math.round(w * 0.128)}px Inter, system-ui, sans-serif`;
    ctx.fillText(FOIL_TEXT[0], w * 0.5, h * 0.5);
    ctx.font = `800 ${Math.round(w * 0.2)}px Inter, system-ui, sans-serif`;
    ctx.fillText(FOIL_TEXT[1], w * 0.5, h * 0.62);
    ctx.restore();

    // gold cap
    const cap = ctx.createLinearGradient(0, 0, 0, h * 0.11);
    cap.addColorStop(0, '#f6e3a9');
    cap.addColorStop(0.5, '#e9c96a');
    cap.addColorStop(1, '#c9a63f');
    ctx.fillStyle = cap;
    ctx.fillRect(0, 0, w, h * 0.098);
    ctx.fillStyle = 'rgba(90, 40, 10, 0.28)';
    ctx.fillRect(0, h * 0.098, w, 1);

    // sparkle grain
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }
  }, []);

  useEffect(() => {
    if (revealed) return;
    done.current = false;
    setProgress(0);
    setHint(true);
    paint();
  }, [paint, revealed, resetKey]);

  useEffect(() => {
    const onResize = () => {
      if (!done.current) paint();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [paint]);

  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || done.current) return;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 14) {
      total++;
      if (data[i] < 24) clear++;
    }
    const pct = total ? clear / total : 0;
    setProgress(pct);
    if (pct > 0.42) {
      done.current = true;
      onRevealed();
    }
  }, [onRevealed]);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || done.current || revealed) return;
    const rect = wrap.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const radius = rect.width * 0.075;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    if (last.current) {
      // brush stroke between the two samples so fast drags don't leave gaps
      ctx.lineWidth = radius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    last.current = { x, y };
    setHint(false);
  }, [revealed]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (revealed) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    last.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current || revealed) return;
    scratchAt(e.clientX, e.clientY);
  };

  const onPointerUp = () => {
    drawing.current = false;
    last.current = null;
    checkProgress();
  };

  return (
    <div className={`scratch${revealed ? ' scratch--revealed' : ''}`} ref={wrapRef}>
      {/* the prize underneath */}
      <div className="scratch__prize">
        <div className="scratch__cap">
          <span className="scratch__coin" aria-hidden="true" />
          You won 1 Gold Coin
        </div>
        <div className="scratch__product">
          <span className="scratch__brandchip">GIVA</span>
          <div className="scratch__shot" aria-hidden="true">
            <div className="scratch__silk" />
            <Necklace className="scratch__necklace" links={22} />
          </div>
          <p className="scratch__brand">GIVA</p>
          <p className="scratch__offer">Flat 32% off on MOV of Rs 3999</p>
          {revealed ? (
            <button className="scratch__view" type="button" onClick={onViewDetails}>
              View Details
            </button>
          ) : (
            <p className="scratch__disclaimer">Your coupon is under the foil</p>
          )}
        </div>
      </div>

      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            className="scratch__canvas"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerCancel={onPointerUp}
            role="img"
            aria-label="Scratch card. Drag across it to reveal your reward."
          />
          <span className="scratch__congrats">Congratulations</span>
          {hint && <span className="scratch__hint">Swipe to scratch</span>}
          <span className="scratch__progress" style={{ width: `${Math.round(progress * 100)}%` }} />
        </>
      )}
    </div>
  );
}
