import type { ReactNode } from 'react';
import { device } from '../design/tokens';
import { useFitScale } from './useFitScale';
import { PhoneStatusBar } from '../ui/primitives';
import { screenChrome } from '../screens/registry';

/**
 * Device bezel + viewport. Children are rendered at a fixed 390×844 logical
 * size and scaled to fit the available space.
 *
 * The status bar is owned by the frame (not by each screen) so it stays put
 * across transitions, exactly like on a device.
 */
export function DeviceFrame({
  children,
  screenId,
}: {
  children: ReactNode;
  screenId: string;
}) {
  const { ref, scale } = useFitScale(device.width, device.height, 24);
  const chrome = screenChrome(screenId);

  return (
    <div ref={ref} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div
        className="relative shrink-0"
        style={{ width: device.width * scale, height: device.height * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: device.width, height: device.height, transform: `scale(${scale})` }}
        >
          {/* Bezel */}
          <div className="relative h-full w-full rounded-[46px] bg-[#16191f] p-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[37px] bg-white">
              {/* Status bar (with dynamic island) */}
              <div className={`relative shrink-0 ${chrome.statusBg}`}>
                <PhoneStatusBar dark={chrome.statusText === 'light'} />
                <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-[26px] w-[104px] -translate-x-1/2 rounded-pill bg-[#0b0d11]" />
              </div>

              {/* Screen viewport */}
              <div className="relative flex-1 overflow-hidden">{children}</div>

              {/* Home indicator */}
              <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-50 h-[5px] w-[120px] -translate-x-1/2 rounded-pill bg-black/25 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
