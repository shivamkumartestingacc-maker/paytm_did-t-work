import type { CSSProperties, ReactNode } from 'react';
import { StatusBar } from './StatusBar';

export type ScreenTheme = 'light' | 'dark';

export type DeviceShellProps = {
  /** The app screen. Rendered inside a 393 × 852 area, clipped to the display corners. */
  children?: ReactNode;
  /** Screen chrome theme — status bar glyphs, home indicator, default backdrop. */
  screenTheme?: ScreenTheme;
  /** Show the iOS status bar. `false` hides it for full-bleed screens. */
  statusBar?: boolean;
  /** Clock label shown in the status bar. */
  time?: string;
  /** Hide the home indicator (e.g. for a full-screen video or splash). */
  homeIndicator?: boolean;
  /** Override the home-indicator colour (some apps draw it light on light). */
  homeIndicatorColor?: string;
  className?: string;
  /** Accessible label for the device. */
  label?: string;
};

/**
 * A CSS-only iPhone shell (iPhone 15 Pro geometry: 393 × 852 pt screen).
 *
 * Every layer is a gradient — no images — and every measurement is a multiple of
 * `--u`, one point of the 393 pt virtual screen, so the device scales fluidly:
 *
 *   76 pt  outer titanium radius        2 pt  specular silver edge
 *   68 pt  black-frame radius           6 pt  brushed metal band
 *   56 pt  display radius              12 pt  black glass bezel
 *
 *   <DeviceShell><MyScreen /></DeviceShell>
 */
export function DeviceShell({
  children,
  screenTheme = 'light',
  statusBar = true,
  time = '9:41',
  homeIndicator = true,
  homeIndicatorColor,
  className,
  label = 'iPhone prototype',
}: DeviceShellProps) {
  return (
    <div className={`device${className ? ` ${className}` : ''}`} role="group" aria-label={label}>
      {/* physical side buttons */}
      <span className="device__btn device__btn--mute" aria-hidden="true" />
      <span className="device__btn device__btn--vol-up" aria-hidden="true" />
      <span className="device__btn device__btn--vol-down" aria-hidden="true" />
      <span className="device__btn device__btn--power" aria-hidden="true" />

      <div className="device__rim">
        <div className="device__bezel">
          <div
            className="device__screen"
            data-screen-theme={screenTheme}
            style={homeIndicatorColor ? ({ '--home-indicator': homeIndicatorColor } as CSSProperties) : undefined}
          >
            <div className="device__content">{children}</div>

            {statusBar && <StatusBar time={time} tone={screenTheme === 'light' ? 'dark' : 'light'} />}

            <div className="device__island" aria-hidden="true">
              <span className="device__island-lens" />
              <span className="device__island-sensor" />
            </div>

            {homeIndicator && <div className="device__home" aria-hidden="true" />}
            <div className="device__gloss" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
