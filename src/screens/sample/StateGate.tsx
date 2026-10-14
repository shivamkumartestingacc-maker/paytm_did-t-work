import type { ReactNode } from 'react';
import type { ScreenState } from '../types';

/**
 * Renders the branch matching the shell's selected state.
 * Falls through to `children` when a branch is not provided.
 */
export function StateGate({
  state,
  loading,
  error,
  empty,
  success,
  children,
}: {
  state: ScreenState;
  loading?: ReactNode;
  error?: ReactNode;
  empty?: ReactNode;
  success?: ReactNode;
  children: ReactNode;
}) {
  if (state === 'loading' && loading) return <>{loading}</>;
  if (state === 'error' && error) return <>{error}</>;
  if (state === 'empty' && empty) return <>{empty}</>;
  if (state === 'success' && success) return <>{success}</>;
  return <>{children}</>;
}

/** Generic skeleton block used by placeholder screens. */
export function SkeletonStack({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      <div className="h-24 w-full animate-pulse rounded-lg bg-surface-sunken" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-md bg-surface-sunken" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 animate-pulse rounded-xs bg-surface-sunken" />
            <div className="h-2.5 w-1/3 animate-pulse rounded-xs bg-surface-sunken" />
          </div>
        </div>
      ))}
    </div>
  );
}
