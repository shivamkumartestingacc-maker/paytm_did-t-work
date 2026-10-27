import { PayScreen } from './PayScreen';
import { SuccessScreen } from './SuccessScreen';
import { RewardsScreen } from './RewardsScreen';
import { ProductScreen } from './ProductScreen';

export type PaytmStep = 'pay' | 'success' | 'rewards' | 'product';

/**
 * Pay ₹500 → success (green tick) → scratch card → coupon page.
 *
 * Kept as a local state machine so the stage stays dumb: it only renders the
 * device and reads which screen is on top (via `onStep`).
 */
export function PaytmFlow({ step, setStep, resetKey }: { step: PaytmStep; setStep: (s: PaytmStep) => void; resetKey: number }) {
  const amount = 500;

  switch (step) {
    case 'pay':
      return <PayScreen key={`pay-${resetKey}`} amount={amount} onPaid={() => setStep('success')} onCancel={() => setStep('pay')} />;
    case 'success':
      return <SuccessScreen amount={amount} onScratch={() => setStep('rewards')} onBack={() => setStep('pay')} />;
    case 'rewards':
      return <RewardsScreen amount={amount} onOpenProduct={() => setStep('product')} onBack={() => setStep('success')} />;
    case 'product':
      return <ProductScreen onBack={() => setStep('rewards')} />;
  }
}
