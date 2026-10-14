import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Flow } from '../flows/types';
import type { Params, ScreenState, Transition } from '../screens/types';

export interface NavEntry {
  key: string;
  screenId: string;
  transition: Transition;
  params: Params;
  stepId: string | null;
  label: string;
}

export type Direction = 1 | -1;

function entriesUpTo(flow: Flow, index: number): NavEntry[] {
  return flow.steps.slice(0, index + 1).map((s, i) => ({
    key: `${flow.id}:${s.id}:${i}`,
    screenId: s.screen,
    transition: s.transition ?? (i === 0 ? 'none' : 'push'),
    params: s.params ?? {},
    stepId: s.id,
    label: s.label,
  }));
}

/**
 * Navigation controller for the prototype.
 *
 * The stack always starts at the beginning of the flow, so "back" behaves the
 * way it does on a real device and any step can be jumped to from the rail.
 */
export function useFlowNav(flow: Flow, initialStepId?: string | null) {
  const startIndex = useMemo(() => {
    if (!initialStepId) return 0;
    const i = flow.steps.findIndex((s) => s.id === initialStepId);
    return i < 0 ? 0 : i;
  }, [flow, initialStepId]);

  const [stack, setStack] = useState<NavEntry[]>(() => entriesUpTo(flow, startIndex));
  const [direction, setDirection] = useState<Direction>(1);
  const [states, setStates] = useState<Record<string, ScreenState>>({});

  // Reset when the flow changes.
  useEffect(() => {
    setStack(entriesUpTo(flow, 0));
    setStates({});
    setDirection(1);
  }, [flow]);

  const top = stack[stack.length - 1];
  const topIndex = top.stepId ? flow.steps.findIndex((s) => s.id === top.stepId) : -1;

  const goToStep = useCallback(
    (stepId: string, transition?: Transition) => {
      const i = flow.steps.findIndex((s) => s.id === stepId);
      if (i < 0) return;
      const target = entriesUpTo(flow, i);
      if (transition) target[target.length - 1] = { ...target[target.length - 1], transition };
      setDirection(i >= topIndex && topIndex >= 0 ? 1 : -1);
      setStack(target);
    },
    [flow, topIndex],
  );

  const navigate = useCallback(
    (screenId: string, transition: Transition = 'push', params: Params = {}) => {
      setDirection(1);
      setStack((prev) => [
        ...prev,
        {
          key: `${screenId}:${prev.length}:${Math.random().toString(36).slice(2, 7)}`,
          screenId,
          transition,
          params,
          stepId: null,
          label: screenId,
        },
      ]);
    },
    [],
  );

  const back = useCallback(() => {
    if (stack.length <= 1) return;
    setDirection(-1);
    setStack((prev) => prev.slice(0, -1));
  }, [stack.length]);

  const next = useCallback(() => {
    if (topIndex < 0 || topIndex >= flow.steps.length - 1) return;
    goToStep(flow.steps[topIndex + 1].id);
  }, [flow, goToStep, topIndex]);

  const state: ScreenState = (top && states[top.key]) || 'default';
  const setState = useCallback(
    (s: ScreenState) => setStates((prev) => ({ ...prev, [top.key]: s })),
    [top],
  );

  const reset = useCallback(() => {
    setStack(entriesUpTo(flow, 0));
    setStates({});
    setDirection(1);
  }, [flow]);

  return {
    stack,
    top,
    topIndex,
    direction,
    state,
    setState,
    goToStep,
    navigate,
    back,
    next,
    reset,
    canGoBack: stack.length > 1,
    hasNext: topIndex >= 0 && topIndex < flow.steps.length - 1,
  };
}
