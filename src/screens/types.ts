import type { ComponentType } from 'react';

/** Visual/data state a screen can be rendered in. */
export type ScreenState = 'default' | 'loading' | 'empty' | 'error' | 'success';

export type Transition = 'push' | 'sheet' | 'fade' | 'none';

/**
 * Everything a screen receives from the shell.
 * Screens must never own navigation state — they call `go`.
 */
export interface ScreenContext {
  /** Currently selected state (driven by the shell's state toggles). */
  state: ScreenState;
  /** Jump to another step of the current flow by step id. */
  goToStep: (stepId: string, transition?: Transition) => void;
  /** Push a screen that is not modelled as a step (detail views, sheets). */
  navigate: (screenId: string, transition?: Transition, params?: Params) => void;
  /** Pop one entry from the navigation stack. */
  back: () => void;
  /** Advance to the next step in the flow, if any. */
  next: () => void;
  /** Params carried by the current stack entry. */
  params: Params;
  flowId: string;
  stepId: string | null;
  /** True when this entry can be popped. */
  canGoBack: boolean;
}

export type Params = Record<string, string | number | boolean | undefined>;

/**
 * A screen is a real React component that receives the shell context as props.
 * It must be rendered as JSX (`<Screen {...ctx} />`) — never called as a
 * function — so its hooks belong to its own fiber.
 */
export type ScreenComponent = ComponentType<ScreenContext>;
