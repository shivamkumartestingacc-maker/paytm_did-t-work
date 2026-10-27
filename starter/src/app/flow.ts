import type { ComponentType } from 'react';

/** Every screen receives these. Wire taps with `go`, headers with `back`. */
export type ScreenProps = {
  /** Navigate to a screen id from the registry. */
  go: (id: string) => void;
  /** Pop the history stack. */
  back: () => void;
};

/** One entry in the flow. Add a screen = add one object here. */
export type ScreenDef = {
  id: string;
  /** Shown in the stage caption. */
  title: string;
  /** One line describing the state this screen shows. */
  note: string;
  View: ComponentType<ScreenProps>;
};
