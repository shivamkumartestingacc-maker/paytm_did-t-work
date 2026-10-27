import type { ScreenTheme } from './DeviceShell';

export type PlaceholderScreenProps = {
  theme?: ScreenTheme;
  /** Show the status-bar / home-indicator safe-area guides. */
  guides?: boolean;
};

/**
 * The empty slot. Any screen dropped in as children of <DeviceShell> replaces this,
 * but it documents the two things every screen has to respect:
 * the 54 pt status bar and the 34 pt home-indicator zone.
 */
export function PlaceholderScreen({ theme = 'light', guides = true }: PlaceholderScreenProps) {
  return (
    <div className={`slot${theme === 'dark' ? ' slot--dark' : ''}`}>
      {guides && (
        <>
          <div className="slot__guide slot__guide--status">
            <span className="slot__guide-label">status 54</span>
          </div>
          <div className="slot__guide slot__guide--home">
            <span className="slot__guide-label">home 34</span>
          </div>
        </>
      )}

      <div className="slot__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="4.5" />
          <path d="M8 9.5h8M8 14.5h5" />
        </svg>
      </div>

      <h2 className="slot__title">Screen slot</h2>
      <p className="slot__sub">
        Drop any screen in here. It renders at 393 × 852 pt, clipped to the display corners, under the dynamic island.
      </p>

      <div className="slot__chips">
        <span className="slot__chip">393 × 852 pt</span>
        <span className="slot__chip">54 / 34 safe area</span>
        <span className="slot__chip">no images</span>
      </div>
    </div>
  );
}
