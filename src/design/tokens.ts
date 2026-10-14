/**
 * Design tokens as JS values.
 *
 * The CSS source of truth lives in `src/index.css` under `@theme`.
 * This mirror exists for things that need raw values at runtime
 * (framer-motion variants, canvas, SVG fills).
 *
 * STATUS: PROVISIONAL — retune after the screenshot audit.
 */
export const color = {
  brandNavy: '#002970',
  brandNavyDeep: '#001f54',
  brandSky: '#00baf2',
  brandSkySoft: '#e0f6fe',
  ink: '#0b1220',

  rewardGold: '#f5a623',
  rewardInk: '#5a3a00',
  rewardGoldSoft: '#fff4e0',
  rewardCashback: '#1c9c62',

  success: '#0d6e33',
  successSoft: '#e6f6ec',
  warning: '#9a5c00',
  warningSoft: '#fff4e0',
  danger: '#b42318',
  dangerSoft: '#fdecea',
  info: '#0066cc',
  infoSoft: '#e8f2ff',

  surfaceApp: '#f2f4f8',
  surfaceCard: '#ffffff',
  surfaceSunken: '#eef1f6',
  textPrimary: '#0b1220',
  textSecondary: '#4e5c73',
  textTertiary: '#5f6a7c',
  textInverse: '#ffffff',
  borderHairline: '#e4e8ef',
  borderStrong: '#cfd6e0',
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/** 4px base grid */
export const space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48] as const;

export const type = {
  display: { size: 34, line: 40, weight: 700 },
  h1: { size: 24, line: 30, weight: 700 },
  h2: { size: 20, line: 26, weight: 700 },
  h3: { size: 18, line: 24, weight: 600 },
  title: { size: 16, line: 22, weight: 600 },
  body: { size: 14, line: 20, weight: 400 },
  bodyStrong: { size: 14, line: 20, weight: 600 },
  label: { size: 13, line: 18, weight: 500 },
  caption: { size: 12, line: 16, weight: 400 },
  micro: { size: 11, line: 15, weight: 500 },
} as const;

/** Motion: spring-based, short, never blocking a tap. */
export const motion = {
  duration: { instant: 0.12, fast: 0.2, base: 0.28, slow: 0.42 },
  spring: { stiffness: 380, damping: 34, mass: 0.9 },
  springSoft: { stiffness: 260, damping: 28, mass: 1 },
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
} as const;

/** Device canvas — iPhone 14/15 logical size. */
export const device = { width: 390, height: 844 } as const;
