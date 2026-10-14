import { useState } from 'react';
import {
  AppHeader,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  IconTile,
  Money,
  ScreenShell,
  Tag,
} from '../../ui/primitives';
import { IconBolt, IconClock, IconCoin, IconGift, IconSearch, IconWallet } from '../../ui/icons';
import type { ScreenContext } from '../types';
import { SkeletonStack, StateGate } from './StateGate';

const FILTERS = ['All', 'Earned', 'Redeemed', 'Expired'] as const;

const ROWS = [
  {
    id: '1',
    title: 'Sharma Kirana Store',
    meta: 'Today · 9:41 AM · UPI ₹450',
    points: '+75',
    tone: 'green' as const,
    icon: <IconCoin size={20} />,
    note: 'Cashback credited',
    tag: 'Earned',
  },
  {
    id: '2',
    title: '₹100 electricity coupon',
    meta: 'Yesterday · 7:12 PM',
    points: '−500',
    tone: 'gold' as const,
    icon: <IconBolt size={20} />,
    note: 'Redeemed for bill discount',
    tag: 'Redeemed',
  },
  {
    id: '3',
    title: 'Adani Electricity',
    meta: '12 Oct · UPI ₹1,250',
    points: '+50',
    tone: 'green' as const,
    icon: <IconWallet size={20} />,
    note: 'Bill payment reward',
    tag: 'Earned',
  },
  {
    id: '4',
    title: 'Points expired',
    meta: '12 Oct · 90-day validity ended',
    points: '−120',
    tone: 'soft' as const,
    icon: <IconClock size={20} />,
    note: 'Lapsed before redemption',
    tag: 'Expired',
  },
  {
    id: '5',
    title: 'Scratch card prize',
    meta: '09 Oct · Recharge ₹199',
    points: '+25',
    tone: 'gold' as const,
    icon: <IconGift size={20} />,
    note: 'Assured prize',
    tag: 'Earned',
  },
];

/** PLACEHOLDER — rewards ledger. */
export default function HistoryScreen(ctx: ScreenContext) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const rows = ROWS.filter((r) => filter === 'All' || r.tag === filter);

  return (
    <ScreenShell>
      <AppHeader
        title="Rewards history"
        subtitle="1,325 points · ₹1,325 value"
        onBack={ctx.canGoBack ? () => ctx.back() : undefined}
        right={
          <button aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full text-text-secondary active:bg-surface-sunken">
            <IconSearch size={19} />
          </button>
        }
      />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {FILTERS.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="px-4 pb-6">
        <StateGate
          state={ctx.state}
          loading={<SkeletonStack rows={5} />}
          error={<ErrorState title="History unavailable" body="We could not fetch your rewards ledger." onRetry={() => ctx.goToStep('history')} />}
          empty={
            <EmptyState
              icon={<IconClock size={26} />}
              title={`No ${filter.toLowerCase()} activity`}
              body="Rewards you earn or redeem will show up here."
            />
          }
        >
          {rows.length === 0 ? (
            <EmptyState
              icon={<IconClock size={26} />}
              title={`No ${filter.toLowerCase()} activity`}
              body="Rewards you earn or redeem will show up here."
            />
          ) : (
            <Card pad={false}>
              {rows.map((r, i) => (
                <div
                  key={r.id}
                  className={`flex items-start gap-3 px-3.5 py-3 ${
                    i < rows.length - 1 ? 'border-b border-border-hairline' : ''
                  }`}
                >
                  <IconTile tone={r.tone} size={40}>
                    {r.icon}
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-md font-semibold">{r.title}</span>
                      <Tag tone={r.tag === 'Earned' ? 'success' : r.tag === 'Redeemed' ? 'gold' : 'danger'}>
                        {r.tag}
                      </Tag>
                    </div>
                    <div className="mt-0.5 truncate text-sm text-text-secondary">{r.meta}</div>
                    <div className="mt-0.5 truncate text-xs text-text-tertiary">{r.note}</div>
                  </div>
                  <span
                    className={`tabular shrink-0 text-md font-bold ${
                      r.points.startsWith('+') ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {r.points}
                  </span>
                </div>
              ))}
            </Card>
          )}

          <div className="mt-4 flex items-center justify-between rounded-md bg-surface-sunken px-3 py-2.5 text-sm">
            <span className="text-text-secondary">Lifetime earned</span>
            <Money value={2480} size="xs" tone="text-text-primary" />
          </div>
        </StateGate>
      </div>
    </ScreenShell>
  );
}
