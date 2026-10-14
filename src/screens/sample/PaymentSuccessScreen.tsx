import { motion } from 'framer-motion';
import { Button, Money } from '../../ui/primitives';
import { IconCheckCircle } from '../../ui/icons';
import type { ScreenContext } from '../types';
import { StateGate } from './StateGate';

/** PLACEHOLDER — payment success, hands off to the reward reveal. */
export default function PaymentSuccessScreen(ctx: ScreenContext) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-app">
      <StateGate
        state={ctx.state}
        error={
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-warning-soft text-warning">
              <IconCheckCircle size={28} />
            </div>
            <div className="text-lg font-semibold">Payment status unknown</div>
            <p className="text-sm text-text-secondary">
              Money may have left your bank. We will confirm within 5 minutes and credit any reward.
            </p>
            <Button variant="secondary" size="sm" block={false} onClick={() => ctx.back()}>
              Check status
            </Button>
          </div>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success"
          >
            <IconCheckCircle size={44} />
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center"
          >
            <div className="text-sm font-medium text-text-secondary">Paid to Sharma Kirana Store</div>
            <Money value={450} size="display" className="mt-1 block" />
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="w-full rounded-lg bg-surface-card p-3.5 shadow-card"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">From UPI · paytm@okbank</span>
              <span className="font-medium text-success">Success</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-text-secondary">Txn ID</span>
              <span className="tabular font-medium">4021 8837 2210</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full rounded-lg border border-reward-gold/40 bg-reward-gold-100 p-3.5"
          >
            <div className="text-md font-bold text-warning">Your reward is ready 🎉</div>
            <div className="mt-0.5 text-sm text-warning/90">
              Scratch the card to see how much cashback you earned.
            </div>
          </motion.div>
        </div>

        <div className="space-y-2 px-4 pb-8">
          <Button size="lg" onClick={() => ctx.next()}>
            Reveal my reward
          </Button>
          <Button variant="ghost" size="md" onClick={() => ctx.goToStep('home')}>
            Back to home
          </Button>
        </div>
      </StateGate>
    </div>
  );
}
