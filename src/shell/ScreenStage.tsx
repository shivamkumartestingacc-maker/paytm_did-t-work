import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Direction, NavEntry } from './useFlowNav';
import type { Params, ScreenContext, ScreenState, Transition } from '../screens/types';
import { getScreen } from '../screens/registry';

const EASE = [0.32, 0.72, 0, 1] as const;

/** §10.5a — reduced motion collapses navigation to a 150 ms opacity crossfade. */
const REDUCED = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

function variantsFor(entry: NavEntry, direction: Direction, reduced: boolean) {
  if (reduced) return REDUCED;
  const t = entry.transition;
  if (t === 'none') {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.18 },
    };
  }
  if (t === 'fade') {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.24, ease: EASE },
    };
  }
  if (t === 'sheet' && direction === 1) {
    return {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { type: 'spring' as const, stiffness: 320, damping: 32 },
    };
  }
  // push forward / pop backward
  if (direction === 1) {
    return {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '-22%', opacity: 0.55 },
      transition: { type: 'spring' as const, stiffness: 380, damping: 36 },
    };
  }
  return {
    initial: { x: '-22%', opacity: 0.55 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%' },
    transition: { type: 'spring' as const, stiffness: 380, damping: 36 },
  };
}

export interface NavApi {
  flowId: string;
  canGoBack: boolean;
  goToStep: (stepId: string, transition?: Transition) => void;
  navigate: (screenId: string, transition?: Transition, params?: Params) => void;
  back: () => void;
  next: () => void;
}

/**
 * Renders the top of the navigation stack inside the device viewport,
 * animating entry/exit according to the step's declared transition.
 */
export function ScreenStage({
  entry,
  direction,
  state,
  nav,
}: {
  entry: NavEntry;
  direction: Direction;
  state: ScreenState;
  nav: NavApi;
}) {
  const Screen = getScreen(entry.screenId);
  const reduced = useReducedMotion() === true;
  const v = variantsFor(entry, direction, reduced);

  const ctx: ScreenContext = {
    state,
    params: entry.params,
    flowId: nav.flowId,
    stepId: entry.stepId,
    canGoBack: nav.canGoBack,
    goToStep: nav.goToStep,
    navigate: nav.navigate,
    back: nav.back,
    next: nav.next,
  };

  return (
    <AnimatePresence initial={false} custom={direction}>
      <motion.div
        key={entry.key}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={v.transition}
        className="absolute inset-0 overflow-hidden bg-surface-app"
      >
        {Screen(ctx)}
      </motion.div>
    </AnimatePresence>
  );
}
