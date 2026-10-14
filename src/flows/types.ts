import type { Params, ScreenState, Transition } from '../screens/types';

/**
 * Annotation = the written layer of the prototype.
 * Text here is authored from the PRD / case study and rendered verbatim
 * in the shell's annotation panel next to the device.
 */
export interface Annotation {
  /** What the user sees and does on this screen. */
  what?: string;
  /** Why this screen exists in the flow (job it does). */
  why?: string;
  /** Bulleted detail: rules, edge cases, business logic. */
  details?: string[];
  /** Design notes: tokens, patterns, hierarchy decisions. */
  design?: string[];
  /** Motion notes: what animates, why, and how long. */
  motion?: string;
  /** Copy notes: voice, wording rationale, localisation. */
  copy?: string;
  /** Verbatim PRD / case-study excerpt (fill in as the PRD arrives). */
  prd?: string;
  /** Open questions to resolve with product/design. */
  openQuestions?: string[];
}

export interface FlowStep {
  id: string;
  /** Label in the left rail. */
  label: string;
  /** Screen id from src/screens/registry.tsx. */
  screen: string;
  /** Entry transition when arriving at this step. */
  transition?: Transition;
  params?: Params;
  /** States worth previewing for this step (shown as toggles). */
  states?: ScreenState[];
  annotation?: Annotation;
}

export interface Flow {
  id: string;
  name: string;
  /** One-line summary shown under the flow name. */
  summary: string;
  /** Who runs this flow. */
  actor?: string;
  /** What success looks like. */
  outcome?: string;
  /** Tags for filtering in the rail. */
  tags?: string[];
  steps: FlowStep[];
}
