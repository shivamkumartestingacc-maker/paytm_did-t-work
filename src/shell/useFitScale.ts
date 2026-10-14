import { useEffect, useRef, useState } from 'react';

/**
 * Scales a fixed-size element (the 390×844 device) to fit its container
 * without distorting it. Used by DeviceFrame.
 */
export function useFitScale(width: number, height: number, pad = 32) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const s = Math.min((rect.width - pad) / width, (rect.height - pad) / height);
      setScale(Math.max(0.3, Math.min(s, 1.15)));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [width, height, pad]);

  return { ref, scale };
}
