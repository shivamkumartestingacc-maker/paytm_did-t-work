import { motion } from 'framer-motion';
import { Button, Money } from '../../ui/primitives';
import { IconBolt, IconScan } from '../../ui/icons';
import type { ScreenContext } from '../types';
import { StateGate } from './StateGate';

/** PLACEHOLDER — Scan & Pay with a reward nudge. */
export default function ScanPayScreen(ctx: ScreenContext) {
  return (
    <div className="relative flex h-full w-full flex-col bg-[#0a0f1a]">
      <StateGate
        state={ctx.state}
        error={
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center text-white">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10">
              <IconScan size={28} />
            </div>
            <div className="text-lg font-semibold">QR not detected</div>
            <p className="text-sm text-white/60">
              The code is damaged or out of frame. Move closer or enter the UPI ID manually.
            </p>
            <Button variant="secondary" size="sm" block={false} onClick={() => ctx.back()}>
              Back
            </Button>
          </div>
        }
        empty={
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center text-white">
            <div className="text-lg font-semibold">Camera permission needed</div>
            <p className="text-sm text-white/60">Allow camera access to scan a merchant QR.</p>
          </div>
        }
      >
        {/* Viewfinder */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#1b2740_0%,#0a0f1a_65%)]" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2">
            {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
              <span
                key={c}
                className={`absolute h-9 w-9 border-brand-sky ${
                  c === 'tl'
                    ? 'left-0 top-0 border-l-4 border-t-4 rounded-tl-lg'
                    : c === 'tr'
                      ? 'right-0 top-0 border-r-4 border-t-4 rounded-tr-lg'
                      : c === 'bl'
                        ? 'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg'
                        : 'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg'
                }`}
              />
            ))}
            <motion.span
              className="absolute inset-x-2 h-0.5 rounded-pill bg-brand-sky shadow-[0_0_14px_2px_rgba(0,186,242,0.7)]"
              animate={{ top: ['8%', '88%', '8%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <button
            onClick={() => ctx.back()}
            aria-label="Back"
            className="absolute left-4 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {ctx.state === 'loading' && (
            <div className="absolute inset-x-0 top-1/2 mt-16 flex justify-center">
              <span className="rounded-pill bg-black/60 px-3 py-1.5 text-sm text-white">Reading QR…</span>
            </div>
          )}
        </div>

        {/* Amount sheet */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.1 }}
          className="rounded-t-xl bg-white px-4 pb-7 pt-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-sky-100 text-brand-navy">
              <IconBolt size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-md font-semibold">Sharma Kirana Store</div>
              <div className="text-sm text-text-secondary">UPI · sharma.kirana@okaxis</div>
            </div>
          </div>

          <div className="mt-4 flex items-end gap-1 rounded-md border border-border-hairline bg-surface-app px-3 py-2.5">
            <span className="pb-0.5 text-xl font-semibold text-text-secondary">₹</span>
            <span className="tabular text-3xl font-bold">450</span>
            <span className="ml-auto self-center text-sm font-medium text-text-secondary">Edit</span>
          </div>

          {/* Reward nudge — the feature's earn moment */}
          <div className="mt-3 flex items-center gap-2 rounded-md bg-reward-gold-100 px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-warning">
              <IconScan size={16} />
            </span>
            <div className="text-sm font-medium leading-5 text-warning">
              Pay ₹450 and get an assured scratch card · up to <Money value={200} size="xs" tone="text-warning" /> cashback
            </div>
          </div>

          <div className="mt-4">
            <Button size="lg" onClick={() => ctx.next()}>
              Pay ₹450 & earn reward
            </Button>
          </div>
        </motion.div>
      </StateGate>
    </div>
  );
}
