import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppHeader,
  BottomSheet,
  Button,
  Card,
  IconTile,
  ListRow,
  Money,
  ScreenShell,
} from '../../ui/primitives';
import { IconBolt, IconCheckCircle, IconMobile, IconTicket } from '../../ui/icons';
import type { ScreenContext } from '../types';
import { SkeletonStack, StateGate } from './StateGate';

/** PLACEHOLDER — redemption confirmation sheet + success. */
export default function RedeemScreen(ctx: ScreenContext) {
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);

  if (ctx.state === 'success' || done) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-surface-app px-6 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success"
        >
          <IconCheckCircle size={42} />
        </motion.div>
        <div>
          <div className="text-xl font-bold">Coupon added</div>
          <p className="mt-1 text-sm text-text-secondary">
            <Money value={100} size="sm" tone="text-success" plus /> will apply automatically on your
            next electricity bill.
          </p>
        </div>
        <Card className="w-full text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Points used</span>
            <span className="tabular font-semibold text-danger">−300</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-sm">
            <span className="text-text-secondary">New balance</span>
            <span className="tabular font-semibold">1,025 pts</span>
          </div>
        </Card>
        <div className="w-full space-y-2">
          <Button size="lg" onClick={() => ctx.goToStep('rewards-hub')}>Back to rewards</Button>
          <Button variant="ghost" onClick={() => ctx.goToStep('history')}>View history</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-surface-app">
      <StateGate
        state={ctx.state}
        loading={<SkeletonStack rows={3} />}
        error={
          <div>
            <AppHeader title="Redeem" onBack={() => ctx.back()} />
            <div className="px-4 py-14 text-center text-sm text-text-secondary">
              Redemption failed. Your points were not deducted.
            </div>
          </div>
        }
      >
        <ScreenShell scroll={false}>
          <AppHeader title="Redeem points" onBack={ctx.canGoBack ? () => ctx.back() : undefined} />
          <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4 pt-4">
            <Card className="mb-4 border border-brand-sky/30 bg-brand-sky-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-brand-navy/70">Redeeming</div>
                  <div className="tabular text-2xl font-bold text-brand-navy">300 points</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-brand-navy/70">You get</div>
                  <Money value={100} size="lg" tone="text-brand-navy" plus />
                </div>
              </div>
            </Card>

            <div className="mb-2 text-md font-semibold">Where would you like to use it?</div>
            <Card pad={false} className="mb-4">
              <ListRow
                icon={<IconTile tone="gold"><IconBolt size={20} /></IconTile>}
                title="Electricity bill"
                subtitle="Applied at checkout"
                trailing={<span className="grid h-5 w-5 place-items-center rounded-full bg-brand-sky text-white"><IconCheckCircle size={14} /></span>}
                divider
              />
              <ListRow
                icon={<IconTile tone="soft"><IconMobile size={20} /></IconTile>}
                title="Mobile recharge"
                subtitle="Applied at checkout"
                divider
              />
              <ListRow
                icon={<IconTile tone="soft"><IconTicket size={20} /></IconTile>}
                title="Movie tickets"
                subtitle="Partner offer · BookMyShow"
                divider={false}
              />
            </Card>

            <div className="text-sm leading-5 text-text-tertiary">
              Redemption is instant and cannot be reversed. The coupon is valid for 30 days.
            </div>
          </div>

          <div className="shrink-0 border-t border-border-hairline bg-white px-4 pb-6 pt-3">
            <Button size="lg" onClick={() => setSheet(true)}>Confirm redemption</Button>
          </div>
        </ScreenShell>
      </StateGate>

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Confirm redemption">
        <div className="space-y-3 pb-2">
          <div className="rounded-md bg-surface-app p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Points deducted</span>
              <span className="tabular font-semibold">300</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Balance after</span>
              <span className="tabular font-semibold">1,025 pts</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Coupon validity</span>
              <span className="font-semibold">30 days</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setSheet(false);
              setDone(true);
            }}
          >
            Redeem now
          </Button>
          <Button variant="ghost" onClick={() => setSheet(false)}>Cancel</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
