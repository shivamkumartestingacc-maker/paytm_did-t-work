import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button, Money } from '../../ui/primitives';
import { IconGift } from '../../ui/icons';
import type { ScreenContext } from '../types';

const CONFETTI = ['#00baf2', '#f5a623', '#10893e', '#ffffff', '#7c5cff'];

/**
 * PLACEHOLDER — the reward reveal moment.
 * This is the highest-emotion screen in the loop, so it gets the most motion
 * budget: anticipation → reveal → confirmation.
 */
export default function RewardRevealScreen(ctx: ScreenContext) {
  const [revealed, setRevealed] = useState(false);
  /** §10.5a — reduced motion: instant reveal, no confetti, no shine loop. */
  const reduced = useReducedMotion() === true;

  if (ctx.state === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-brand-navy px-8 text-center text-white">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10">
          <IconGift size={28} />
        </div>
        <div className="text-lg font-semibold">Reward could not be revealed</div>
        <p className="text-sm text-white/65">
          Your prize is safe. We will credit it to your rewards balance within 24 hours.
        </p>
        <Button variant="secondary" size="sm" block={false} onClick={() => ctx.goToStep('rewards-hub')}>
          Go to rewards
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-brand-navy via-brand-navy-700 to-[#00123a] text-white">
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-sky/25 blur-3xl"
        animate={{ opacity: revealed ? [0.4, 0.9, 0.6] : 0.35, scale: revealed ? [1, 1.15, 1.05] : 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative flex items-center justify-between px-4 pt-3">
        <span className="text-sm font-medium text-white/60">Reward earned</span>
        <button
          onClick={() => ctx.goToStep('rewards-hub')}
          className="text-sm font-semibold text-brand-sky"
        >
          Skip
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6">
        {!revealed && (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="text-xl font-semibold">You unlocked a scratch card</div>
            <div className="mt-1 text-sm text-white/65">Tap the card to reveal your cashback</div>
          </motion.div>
        )}

        {/* Scratch card */}
        <motion.button
          onClick={() => !revealed && setRevealed(true)}
          whileTap={{ scale: 0.97 }}
          className="relative h-56 w-72 overflow-hidden rounded-xl shadow-float"
        >
          {/* Prize face */}
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#ffd479] via-reward-gold to-[#e08900] text-[#5a3a00]">
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 300, damping: 14 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-sm font-bold uppercase tracking-wider">Cashback won</span>
                  <Money value={75} size="display" tone="text-[#4a2f00]" />
                  <span className="text-sm font-medium">Credited to rewards balance</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Silver scratch layer wipes away */}
          <motion.div
            className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#dfe4ec_0%,#f6f8fb_35%,#c9d0dc_70%,#eef1f6_100%)] text-[#5b6b7f]"
            animate={revealed ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.32, 0.72, 0, 1] }}
            style={{ pointerEvents: 'none' }}
          >
            <div className="flex flex-col items-center gap-2">
              <IconGift size={34} />
              <span className="text-md font-bold">Scratch to reveal</span>
            </div>
            {!reduced && (
              <motion.span
                className="absolute inset-y-0 w-16 bg-white/45 blur-md"
                animate={{ x: ['-80px', '320px'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.div>

          {/* Confetti */}
          <AnimatePresence>
            {revealed &&
              !reduced &&
              Array.from({ length: 18 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-2 w-2 rounded-xs"
                  style={{
                    backgroundColor: CONFETTI[i % CONFETTI.length],
                    left: `${8 + (i * 5) % 84}%`,
                    top: '45%',
                  }}
                  initial={{ opacity: 1, y: 0, scale: 0.6 }}
                  animate={{
                    opacity: [1, 1, 0],
                    y: [0, 90 + (i % 5) * 26],
                    x: [0, ((i % 7) - 3) * 16],
                    rotate: [0, 180 + i * 12],
                    scale: [0.6, 1.1, 0.9],
                  }}
                  transition={{ duration: 1.1 + (i % 4) * 0.18, ease: 'easeOut' }}
                />
              ))}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full rounded-lg bg-white/10 p-3.5 backdrop-blur"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Rewards balance</span>
                <span className="font-semibold">1,325 pts</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-white/15">
                <motion.div
                  className="h-full rounded-pill bg-brand-sky"
                  initial={{ width: '58%' }}
                  animate={{ width: '72%' }}
                  transition={{ duration: reduced ? 0.15 : 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-1.5 text-sm text-white/60">
                275 points to the next redemption tier
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 px-4 pb-9">
        <Button size="lg" variant="secondary" onClick={() => ctx.next()} disabled={!revealed}>
          {revealed ? 'See my rewards' : 'Reveal to continue'}
        </Button>
        <Button variant="ghost" className="text-white/80" onClick={() => ctx.goToStep('home')}>
          Done
        </Button>
      </div>
    </div>
  );
}
