/**
 * Presentation-only data: how each job looks as a physical clipping.
 * Job facts live in data/jobs.ts; nothing here changes what a job says.
 */

export type ClipVariant = 'notice' | 'torn' | 'stamp' | 'photocopy' | 'index';
export type ClipTone = 'light' | 'aged' | 'wash';

export type ClipStyle = {
  variant: ClipVariant;
  tone: ClipTone;
  /** Subtle rotation used in the grid's loose "before alignment" state (degrees). */
  looseRotate: number;
  /** Loose offset in px before the grid card settles into its cell. */
  looseX: number;
  looseY: number;
};

export const clipStyles: Record<string, ClipStyle> = {
  'product-designer-northstar': { variant: 'notice', tone: 'light', looseRotate: -4, looseX: -36, looseY: -70 },
  'frontend-engineer-fieldnote': { variant: 'torn', tone: 'aged', looseRotate: 3, looseX: 48, looseY: -110 },
  'brand-designer-common-practice': { variant: 'stamp', tone: 'light', looseRotate: -2.5, looseX: -60, looseY: -40 },
  'product-manager-morrow-labs': { variant: 'index', tone: 'wash', looseRotate: 4, looseX: 30, looseY: -90 },
  'creative-developer-paperplane-works': { variant: 'notice', tone: 'aged', looseRotate: 2.5, looseX: -20, looseY: -120 },
  'ux-researcher-good-measure': { variant: 'photocopy', tone: 'light', looseRotate: -3, looseX: 60, looseY: -60 },
  'content-designer-small-hours': { variant: 'torn', tone: 'light', looseRotate: 5, looseX: -48, looseY: -100 },
  'design-engineer-studio-relay': { variant: 'index', tone: 'aged', looseRotate: -2, looseX: 24, looseY: -80 },
};

/** Hero collage placement, in design units of the stage (px at scale 1). */
export type HeroPiece = { id: string; x: number; y: number; w: number; rot: number; z: number };

/** Decorative marks drawn around the collage. Purely visual; aria-hidden. */
export type HeroMark =
  | { kind: 'stamp'; x: number; y: number; size: number; rot: number; text: string; tone: 'blue' | 'red' }
  | { kind: 'note'; x: number; y: number; w: number; rot: number; text: string }
  | { kind: 'arrow'; d: string; delay: number }
  | { kind: 'circle'; x: number; y: number; w: number; h: number; rot: number }
  | { kind: 'underline'; x: number; y: number; w: number; rot: number }
  | { kind: 'tape'; x: number; y: number; w: number; rot: number };

export type HeroLayout = {
  name: 'desktop' | 'tablet' | 'mobile';
  width: number;
  height: number;
  pieces: HeroPiece[];
  marks: HeroMark[];
};

export const heroLayouts: Record<HeroLayout['name'], HeroLayout> = {
  desktop: {
    name: 'desktop',
    width: 1120,
    height: 690,
    pieces: [
      { id: 'product-designer-northstar', x: 70, y: 40, w: 250, rot: -4, z: 2 },
      { id: 'frontend-engineer-fieldnote', x: 350, y: 14, w: 230, rot: 2.5, z: 3 },
      { id: 'brand-designer-common-practice', x: 622, y: 52, w: 236, rot: -2.5, z: 2 },
      { id: 'product-manager-morrow-labs', x: 890, y: 130, w: 206, rot: 4, z: 1 },
      { id: 'creative-developer-paperplane-works', x: 170, y: 290, w: 242, rot: 3, z: 3 },
      { id: 'ux-researcher-good-measure', x: 446, y: 262, w: 262, rot: -3, z: 4 },
      { id: 'content-designer-small-hours', x: 736, y: 300, w: 232, rot: -6, z: 2 },
      { id: 'design-engineer-studio-relay', x: 360, y: 506, w: 226, rot: -1.5, z: 1 },
    ],
    marks: [
      { kind: 'stamp', x: 40, y: 330, size: 116, rot: -12, text: 'OPEN ROLES', tone: 'blue' },
      { kind: 'stamp', x: 905, y: 440, size: 104, rot: 9, text: 'DEMO LIST', tone: 'red' },
      { kind: 'circle', x: 436, y: 248, w: 286, h: 230, rot: -2 },
      { kind: 'note', x: 40, y: 168, w: 170, rot: -6, text: 'start with the blue ones' },
      { kind: 'note', x: 800, y: 470, w: 180, rot: 3, text: 'remote, all of them' },
      { kind: 'tape', x: 300, y: 252, w: 90, rot: -28 },
      { kind: 'tape', x: 790, y: 286, w: 70, rot: 22 },
      { kind: 'underline', x: 110, y: 648, w: 210, rot: -1 },
      {
        kind: 'arrow',
        d: 'M 610 96 C 640 60, 650 40, 660 30 M 648 28 L 660 30 L 662 42',
        delay: 0.6,
      },
    ],
  },
  tablet: {
    name: 'tablet',
    width: 720,
    height: 720,
    pieces: [
      { id: 'product-designer-northstar', x: 22, y: 12, w: 214, rot: -3, z: 2 },
      { id: 'frontend-engineer-fieldnote', x: 258, y: 40, w: 204, rot: 2.5, z: 3 },
      { id: 'brand-designer-common-practice', x: 480, y: 6, w: 218, rot: -2, z: 2 },
      { id: 'product-manager-morrow-labs', x: 34, y: 262, w: 200, rot: 3, z: 1 },
      { id: 'creative-developer-paperplane-works', x: 262, y: 236, w: 214, rot: -2, z: 3 },
      { id: 'ux-researcher-good-measure', x: 494, y: 272, w: 210, rot: 2, z: 4 },
      { id: 'content-designer-small-hours', x: 120, y: 500, w: 200, rot: -4, z: 2 },
      { id: 'design-engineer-studio-relay', x: 380, y: 512, w: 210, rot: 3, z: 1 },
    ],
    marks: [
      { kind: 'stamp', x: 560, y: 470, size: 100, rot: 10, text: 'OPEN ROLES', tone: 'blue' },
      { kind: 'circle', x: 490, y: 268, w: 226, h: 190, rot: -2 },
      { kind: 'tape', x: 240, y: 224, w: 72, rot: -24 },
      { kind: 'underline', x: 90, y: 694, w: 180, rot: -1 },
    ],
  },
  mobile: {
    name: 'mobile',
    width: 360,
    height: 1000,
    pieces: [
      { id: 'product-designer-northstar', x: 14, y: 6, w: 176, rot: -3, z: 2 },
      { id: 'frontend-engineer-fieldnote', x: 186, y: 34, w: 164, rot: 3, z: 3 },
      { id: 'brand-designer-common-practice', x: 12, y: 232, w: 174, rot: 2, z: 2 },
      { id: 'product-manager-morrow-labs', x: 190, y: 262, w: 158, rot: -4, z: 1 },
      { id: 'creative-developer-paperplane-works', x: 26, y: 480, w: 180, rot: -2, z: 3 },
      { id: 'ux-researcher-good-measure', x: 176, y: 512, w: 172, rot: 3, z: 4 },
      { id: 'content-designer-small-hours', x: 16, y: 740, w: 170, rot: 4, z: 2 },
      { id: 'design-engineer-studio-relay', x: 186, y: 770, w: 160, rot: -2, z: 1 },
    ],
    marks: [
      { kind: 'stamp', x: 230, y: 436, size: 86, rot: 10, text: 'OPEN', tone: 'blue' },
      { kind: 'circle', x: 170, y: 504, w: 186, h: 176, rot: -2 },
      { kind: 'tape', x: 150, y: 200, w: 64, rot: -20 },
      { kind: 'underline', x: 40, y: 958, w: 200, rot: -1 },
    ],
  },
};
