import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppHeader,
  Button,
  Card,
  ErrorState,
  IconTile,
  Money,
  ScreenShell,
  Tag,
} from '../../ui/primitives';
import { IconBolt, IconChevronDown, IconClock, IconLock } from '../../ui/icons';
import type { ScreenContext } from '../types';
import { SkeletonStack, StateGate } from './StateGate';

/** PLACEHOLDER — offer detail with terms and a sticky redemption CTA. */
export default function OfferDetailScreen(ctx: ScreenContext) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full w-full flex-col bg-surface-app">
      <StateGate
        state={ctx.state}
        loading={
          <div>
            <AppHeader title="Offer" onBack={() => ctx.back()} />
            <SkeletonStack rows={3} />
          </div>
        }
        error={
          <div>
            <AppHeader title="Offer" onBack={() => ctx.back()} />
            <ErrorState title="Offer unavailable" body="This offer has ended or is not valid for your account." onRetry={() => ctx.back()} />
          </div>
        }
      >
        <ScreenShell scroll={false}>
          <AppHeader
            title="Offer details"
            onBack={ctx.canGoBack ? () => ctx.back() : undefined}
          />
          <div className="no-scrollbar flex-1 overflow-y-auto pb-2">
            {/* Hero */}
            <div className="bg-gradient-to-br from-brand-navy to-[#0b4a8f] px-4 py-5 text-white">
              <div className="flex items-center gap-2">
                <Tag tone="gold">Bills</Tag>
                <span className="flex items-center gap-1 text-sm text-white/70">
                  <IconClock size={14} /> Ends in 6 days
                </span>
              </div>
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-2 text-2xl font-bold leading-7"
              >
                10% back on electricity bills
              </motion.div>
              <div className="mt-1 text-sm text-white/75">Up to ₹150 cashback per bill · twice a month</div>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-white/10 p-3">
                <IconTile tone="gold" size={40}>
                  <IconBolt size={20} />
                </IconTile>
                <div className="flex-1">
                  <div className="text-sm text-white/70">Redemption cost</div>
                  <div className="tabular text-lg font-bold">300 points</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/70">You get</div>
                  <Money value={150} size="lg" tone="text-white" plus />
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="px-4 pt-4">
              <Card>
                <div className="text-md font-semibold">How it works</div>
                <ol className="mt-2 space-y-2.5">
                  {[
                    'Redeem 300 points to activate the offer',
                    'Pay an electricity bill on Paytm within 30 days',
                    'Cashback credits to your rewards balance in 24 hours',
                  ].map((s, i) => (
                    <li key={s} className="flex gap-2.5">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-sky-100 text-2xs font-bold text-brand-navy">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-5 text-text-secondary">{s}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>

            {/* Terms accordion */}
            <div className="px-4 pt-3">
              <Card pad={false}>
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-3.5 py-3 text-left"
                >
                  <span className="flex items-center gap-2 text-md font-semibold">
                    <IconLock size={16} className="text-text-tertiary" /> Terms &amp; conditions
                  </span>
                  <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <IconChevronDown size={18} className="text-text-tertiary" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 px-3.5 pb-3.5">
                    {[
                      'Valid for prepaid and postpaid electricity bills only.',
                      'Maximum cashback ₹150 per bill, twice per calendar month.',
                      'Points are non-transferable and expire 90 days after earning.',
                      'Offer void if the payment is refunded or reversed.',
                    ].map((t) => (
                      <li key={t} className="flex gap-2 text-sm leading-5 text-text-secondary">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-border-strong" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Card>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="shrink-0 border-t border-border-hairline bg-white px-4 pb-6 pt-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Balance after redemption</span>
              <span className="tabular font-semibold">1,025 pts</span>
            </div>
            <Button size="lg" onClick={() => ctx.goToStep('redeem')}>
              Redeem 300 points
            </Button>
          </div>
        </ScreenShell>
      </StateGate>
    </div>
  );
}
