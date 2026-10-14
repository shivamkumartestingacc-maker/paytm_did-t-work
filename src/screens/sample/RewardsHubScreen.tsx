import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppHeader,
  Banner,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  IconTile,
  ListRow,
  ScreenShell,
  SectionHeader,
  Tag,
} from '../../ui/primitives';
import {
  IconBell,
  IconBolt,
  IconChevronRight,
  IconClock,
  IconCoin,
  IconGift,
  IconStar,
  IconTicket,
} from '../../ui/icons';
import type { ScreenContext } from '../types';
import { SkeletonStack, StateGate } from './StateGate';

const TABS = ['Offers', 'My points', 'History'] as const;

/** PLACEHOLDER — rewards hub: balance, offers, expiry pressure. */
export default function RewardsHubScreen(ctx: ScreenContext) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Offers');

  return (
    <ScreenShell>
      <div className="bg-gradient-to-b from-brand-navy to-brand-navy-700 px-4 pb-5 text-white">
        <AppHeader
          tone="transparent"
          className="px-0 text-white"
          onBack={ctx.canGoBack ? () => ctx.back() : undefined}
          title="Rewards"
          right={
            <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-full active:bg-white/10">
              <IconBell size={20} />
            </button>
          }
        />
        <div className="mt-1 flex items-end justify-between">
          <div>
            <div className="text-sm text-white/65">Points balance</div>
            <div className="tabular text-4xl font-bold">1,325</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/65">Cash value</div>
            <div className="tabular text-xl font-semibold">₹1,325</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-white/15">
          <motion.div
            className="h-full rounded-pill bg-brand-sky"
            initial={{ width: 0 }}
            animate={{ width: '72%' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-white/70">
          <IconClock size={14} /> 200 points expire in 12 days
        </div>

        <div className="mt-4 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-pill px-3.5 py-1.5 text-sm font-semibold transition ${
                tab === t ? 'bg-white text-brand-navy' : 'bg-white/12 text-white/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <StateGate
          state={ctx.state}
          loading={<SkeletonStack rows={4} />}
          error={
            <ErrorState
              title="Could not load offers"
              body="Your points are safe. Retry to fetch the latest offers."
              onRetry={() => ctx.goToStep('rewards-hub')}
            />
          }
          empty={
            <EmptyState
              icon={<IconGift size={28} />}
              title="No rewards yet"
              body="Make your first UPI payment to earn an assured scratch card."
            />
          }
        >
          {tab === 'Offers' && (
            <>
              <Banner
                tone="gold"
                icon={<IconStar size={18} />}
                title="Redeem 500 points for ₹100 off"
                body="On your next electricity or mobile recharge bill."
                action={
                  <button
                    onClick={() => ctx.goToStep('redeem')}
                    className="rounded-pill bg-warning px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Redeem
                  </button>
                }
              />

              <SectionHeader title="Available offers" className="pb-2 pt-5" />
              <div className="space-y-3 pb-6">
                {[
                  {
                    t: 'Flat ₹75 cashback',
                    s: 'On UPI payments above ₹300',
                    tag: 'UPI',
                    cost: 'Free · auto-applied',
                    icon: <IconCoin size={20} />,
                  },
                  {
                    t: '10% back on electricity bills',
                    s: 'Up to ₹150 · 2 redemptions left',
                    tag: 'Bills',
                    cost: '300 pts',
                    icon: <IconBolt size={20} />,
                  },
                  {
                    t: 'Assured scratch card',
                    s: 'Every spend above ₹199',
                    tag: 'Assured',
                    cost: 'Free',
                    icon: <IconGift size={20} />,
                  },
                  {
                    t: 'Movie tickets at ₹99',
                    s: 'Weekend shows, select cities',
                    tag: 'Partner',
                    cost: '800 pts',
                    icon: <IconTicket size={20} />,
                  },
                ].map((o) => (
                  <Card
                    key={o.t}
                    className="border border-border-hairline"
                    onClick={() => ctx.goToStep('offer-detail')}
                  >
                    <div className="flex items-start gap-3">
                      <IconTile tone="sky" size={44}>
                        {o.icon}
                      </IconTile>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Tag tone="brand">{o.tag}</Tag>
                          <span className="text-sm text-text-tertiary">{o.cost}</span>
                        </div>
                        <div className="mt-1 text-md font-semibold leading-5">{o.t}</div>
                        <div className="mt-0.5 text-sm leading-5 text-text-secondary">{o.s}</div>
                      </div>
                      <IconChevronRight size={18} className="mt-1 shrink-0 text-text-tertiary" />
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {tab === 'My points' && (
            <div className="space-y-3 pb-6">
              <Card>
                <div className="text-md font-semibold">How points work</div>
                <div className="mt-1.5 space-y-2">
                  {[
                    '1 point = ₹1 in cash value',
                    'Points credit within 24 hours of a successful payment',
                    'Points expire 90 days after they are earned',
                  ].map((l) => (
                    <div key={l} className="flex gap-2 text-sm text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-brand-sky" />
                      {l}
                    </div>
                  ))}
                </div>
              </Card>
              <ListRow
                icon={<IconTile tone="green"><IconCoin size={20} /></IconTile>}
                title="Earned today"
                subtitle="Sharma Kirana Store · ₹450"
                trailing={<span className="tabular text-md font-bold text-success">+75 pts</span>}
                onClick={() => ctx.goToStep('history')}
              />
            </div>
          )}

          {tab === 'History' && (
            <div className="pb-6">
              <div className="mb-3 flex gap-2">
                <Chip active>All</Chip>
                <Chip>Earned</Chip>
                <Chip>Redeemed</Chip>
                <Chip>Expired</Chip>
              </div>
              <Card pad={false}>
                <ListRow
                  icon={<IconTile tone="green"><IconCoin size={20} /></IconTile>}
                  title="Cashback · Sharma Kirana"
                  subtitle="Today, 9:41 AM"
                  trailing={<span className="tabular font-bold text-success">+75</span>}
                  onClick={() => ctx.goToStep('history')}
                />
                <ListRow
                  icon={<IconTile tone="gold"><IconTicket size={20} /></IconTile>}
                  title="Redeemed · ₹100 bill coupon"
                  subtitle="Yesterday, 7:12 PM"
                  trailing={<span className="tabular font-bold text-danger">−500</span>}
                  onClick={() => ctx.goToStep('history')}
                />
                <ListRow
                  icon={<IconTile tone="soft"><IconClock size={20} /></IconTile>}
                  title="Expired"
                  subtitle="12 Oct · 120 points lapsed"
                  trailing={<span className="tabular font-bold text-text-tertiary">−120</span>}
                  divider={false}
                  onClick={() => ctx.goToStep('history')}
                />
              </Card>
            </div>
          )}
        </StateGate>
      </div>
    </ScreenShell>
  );
}
