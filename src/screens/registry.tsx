import type { ScreenComponent } from './types';
import HomeScreen from './sample/HomeScreen';
import ScanPayScreen from './sample/ScanPayScreen';
import PaymentSuccessScreen from './sample/PaymentSuccessScreen';
import RewardRevealScreen from './sample/RewardRevealScreen';
import RewardsHubScreen from './sample/RewardsHubScreen';
import OfferDetailScreen from './sample/OfferDetailScreen';
import RedeemScreen from './sample/RedeemScreen';
import HistoryScreen from './sample/HistoryScreen';
import { Button, EmptyState } from '../ui/primitives';

/**
 * Screen id → component.
 * Add real screens here as the PRD lands; flows reference them by id only,
 * so a screen can be reused across flows and swapped without touching flow data.
 */
export const screens: Record<string, ScreenComponent> = {
  home: HomeScreen,
  'scan-pay': ScanPayScreen,
  'payment-success': PaymentSuccessScreen,
  'reward-reveal': RewardRevealScreen,
  'rewards-hub': RewardsHubScreen,
  'offer-detail': OfferDetailScreen,
  redeem: RedeemScreen,
  history: HistoryScreen,
};

/**
 * Per-screen device chrome: what the status bar sits on.
 * `statusText` is the glyph colour, `statusBg` the surface behind it.
 */
export function screenChrome(id: string): { statusText: 'light' | 'dark'; statusBg: string } {
  const map: Record<string, { statusText: 'light' | 'dark'; statusBg: string }> = {
    home: { statusText: 'light', statusBg: 'bg-brand-navy' },
    'scan-pay': { statusText: 'light', statusBg: 'bg-[#0a0f1a]' },
    'payment-success': { statusText: 'dark', statusBg: 'bg-surface-app' },
    'reward-reveal': { statusText: 'light', statusBg: 'bg-brand-navy' },
    'rewards-hub': { statusText: 'light', statusBg: 'bg-brand-navy' },
    'offer-detail': { statusText: 'dark', statusBg: 'bg-surface-card' },
    redeem: { statusText: 'dark', statusBg: 'bg-surface-card' },
    history: { statusText: 'dark', statusBg: 'bg-surface-card' },
  };
  return map[id] ?? { statusText: 'dark', statusBg: 'bg-surface-app' };
}

export function getScreen(id: string): ScreenComponent {
  return (
    screens[id] ??
    ((ctx) => (
      <div className="flex h-full flex-col bg-surface-app">
        <EmptyState
          title={`No screen registered for “${id}”`}
          body="Add it to src/screens/registry.ts — flows reference screens by id."
          action={<Button size="sm" block={false} variant="secondary" onClick={() => ctx.back()}>Go back</Button>}
        />
      </div>
    ))
  );
}
