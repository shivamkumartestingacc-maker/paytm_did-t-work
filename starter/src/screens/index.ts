import type { ScreenDef } from '../app/flow';
import { ScreenA } from './ScreenA';
import { ScreenB } from './ScreenB';

/**
 * THE FLOW — order matters: it drives the stage's prev/next and the caption.
 *
 * When an agent adds a screen it appends one entry here and wires the
 * outgoing button with `go('<id>')`.
 */
export const SCREENS: ScreenDef[] = [
  { id: 'screen-a', title: 'Screen one', note: 'Entry state of the flow', View: ScreenA },
  { id: 'screen-b', title: 'Screen two', note: 'Detail / summary state', View: ScreenB },
];
