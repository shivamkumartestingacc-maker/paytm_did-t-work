import { motion } from 'framer-motion';
import {
  AppHeader,
  Card,
  Chip,
  IconTile,
  Money,
  ScreenShell,
  SectionHeader,
  TabBar,
  HeaderIconButton,
} from '../../ui/primitives';
import {
  IconBank,
  IconBell,
  IconBolt,
  IconCart,
  IconCoin,
  IconGift,
  IconHome,
  IconMobile,
  IconQr,
  IconScan,
  IconUser,
  IconWallet,
} from '../../ui/icons';
import type { ScreenContext } from '../types';
import { SkeletonStack, StateGate } from './StateGate';

/**
 * PLACEHOLDER — Paytm-style home.
 * Purpose in the prototype: gives the reward entry points a realistic
 * starting surface. Replace with the real screen from the PRD.
 */
export default function HomeScreen(ctx: ScreenContext) {
  const quickActions = [
    { id: 'scan', label: 'Scan & Pay', icon: <IconScan size={22} />, tone: 'sky' as const, go: 'scan-pay' },
    { id: 'mobile', label: 'To Mobile', icon: <IconMobile size={22} />, tone: 'soft' as const },
    { id: 'bank', label: 'To Bank', icon: <IconBank size={22} />, tone: 'soft' as const },
    { id: 'bills', label: 'Pay Bills', icon: <IconBolt size={22} />, tone: 'soft' as const },
    { id: 'recharge', label: 'Recharge', icon: <IconCart size={22} />, tone: 'soft' as const },
    { id: 'more', label: 'More', icon: <IconWallet size={22} />, tone: 'soft' as const },
  ];

  return (
    <ScreenShell scroll={false}>
      <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
      <StateGate
        state={ctx.state}
        loading={<SkeletonStack rows={5} />}
        empty={
          <div className="px-4 py-16 text-center text-sm text-text-secondary">
            No services available for this account.
          </div>
        }
      >
        {/* Brand header */}
        <div className="bg-gradient-to-b from-brand-navy to-brand-navy-700 px-4 pb-5 pt-1 text-white">
          <AppHeader
            tone="transparent"
            className="px-0 text-white"
            title="Paytm"
            right={
              <>
                <HeaderIconButton label="Notifications">
                  <IconBell size={20} />
                </HeaderIconButton>
                <HeaderIconButton label="Profile">
                  <IconUser size={20} />
                </HeaderIconButton>
              </>
            }
          />
          <div className="mt-1 flex h-11 items-center gap-2 rounded-md bg-white/12 px-3 backdrop-blur">
            <IconQr size={18} />
            <span className="text-md text-white/70">Search payments, offers, rewards</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Chip tone="brand" active>
              UPI · paytm@okbank
            </Chip>
            <Chip tone="brand">Balance ₹12,480</Chip>
          </div>
        </div>

        {/* Quick actions */}
        <div className="-mt-3 rounded-t-xl bg-surface-app px-2 pt-4">
          <div className="grid grid-cols-3 gap-1">
            {quickActions.map((a) => (
              <motion.button
                key={a.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => (a.go ? ctx.goToStep(a.go) : undefined)}
                className="flex flex-col items-center gap-1.5 rounded-md px-2 py-3 active:bg-white"
              >
                <IconTile tone={a.tone} size={46}>
                  {a.icon}
                </IconTile>
                <span className="text-center text-sm font-medium leading-4 text-text-primary">
                  {a.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rewards entry — the feature's front door */}
        <div className="px-4 pt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => ctx.goToStep('rewards-hub')}
            className="w-full overflow-hidden rounded-lg bg-gradient-to-r from-reward-gold to-[#ffc85c] p-4 text-left shadow-raised"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-white/85 text-warning">
                <IconGift size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-md font-bold text-[#5a3a00]">You have 1,250 reward points</div>
                <div className="text-sm font-medium text-[#5a3a00]">₹1,250 cashback value · 1 offer expiring</div>
              </div>
              <span className="rounded-pill bg-[#5a3a00] px-3 py-1.5 text-sm font-semibold text-white">
                Open
              </span>
            </div>
          </motion.button>
        </div>

        {/* Offers */}
        <SectionHeader title="Offers for you" action="See all" className="pb-2 pt-5" />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
          {[
            { t: 'Flat ₹75 cashback', s: 'On first UPI payment above ₹300', tag: 'UPI' },
            { t: '10% back on bills', s: 'Electricity & gas, up to ₹150', tag: 'Bills' },
            { t: 'Scratch card', s: 'Assured prize on every ₹199 spend', tag: 'Assured' },
          ].map((o) => (
            <Card
              key={o.t}
              className="w-56 shrink-0 border border-border-hairline"
              onClick={() => ctx.goToStep('offer-detail')}
            >
              <span className="inline-block rounded-xs bg-brand-sky-100 px-1.5 py-0.5 text-2xs font-bold uppercase text-brand-navy">
                {o.tag}
              </span>
              <div className="mt-2 text-md font-semibold leading-5">{o.t}</div>
              <div className="mt-1 text-sm leading-5 text-text-secondary">{o.s}</div>
            </Card>
          ))}
        </div>

        {/* Recent activity */}
        <SectionHeader title="Recent activity" action="History" className="pb-2 pt-4" />
        <div className="mx-4 mb-6 overflow-hidden rounded-lg bg-surface-card shadow-card">
          {[
            { n: 'Sharma Kirana Store', a: -340, r: '+₹20 cashback', i: <IconCoin size={20} /> },
            { n: 'Adani Electricity', a: -1250, r: '+50 points', i: <IconBolt size={20} /> },
            { n: 'Rohit (UPI)', a: 500, r: 'No reward', i: <IconWallet size={20} /> },
          ].map((r, i, arr) => (
            <div
              key={r.n}
              className={`flex items-center gap-3 px-3.5 py-3 ${
                i < arr.length - 1 ? 'border-b border-border-hairline' : ''
              }`}
            >
              <IconTile tone="soft" size={38}>
                {r.i}
              </IconTile>
              <div className="min-w-0 flex-1">
                <div className="truncate text-md font-medium">{r.n}</div>
                <div className="text-sm text-text-secondary">{r.r}</div>
              </div>
              <Money value={Math.abs(r.a)} size="sm" tone={r.a > 0 ? 'text-success' : 'text-text-primary'} plus={r.a > 0} />
            </div>
          ))}
        </div>
      </StateGate>
      </div>

      <TabBar
        active="home"
        onChange={() => undefined}
        tabs={[
          { id: 'home', label: 'Home', icon: <IconHome size={20} /> },
          { id: 'scan', label: 'Scan', icon: <IconScan size={20} /> },
          { id: 'rewards', label: 'Rewards', icon: <IconGift size={20} /> },
          { id: 'me', label: 'Me', icon: <IconUser size={20} /> },
        ]}
      />
    </ScreenShell>
  );
}
