import { useState } from 'react';
import { Confetti } from '../art/Confetti';
import { NavyRule, PaytmHeader, PaytmTabBar, VerifiedTick } from './PaytmChrome';
import { RewardChip } from './art';
import { ScratchCard } from './ScratchCard';

/**
 * Rewards hub with the scratch card.
 *
 * Scratch the foil → the prize underneath (GIVA coupon) is already rendered
 * beneath the canvas, so the reveal is a straight unveiling. Crossing the
 * threshold fires the confetti and swaps in the "View Details" action.
 */
export function RewardsScreen({
  onOpenProduct,
  onBack,
  amount = 500,
}: {
  onOpenProduct: () => void;
  onBack: () => void;
  amount?: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    setBurst((b) => b + 1);
  };

  return (
    <div className="p-scr p-scr--rewards">
      <PaytmHeader onBack={onBack} />

      <div className="rewards__who">
        <div>
          <p className="rewards__name">Sumit Kumar Yadav</p>
          <p className="rewards__upi">UPI ID: q45289534@ybl</p>
        </div>
        <p className="rewards__amount">
          ₹{amount.toLocaleString('en-IN')}
          <VerifiedTick className="rewards__tick" />
        </p>
      </div>

      <NavyRule />

      <div className="rewards__strip">
        <p className="rewards__heading">Your Rewards</p>
        <div className="rewards__chips">
          <RewardChip kind="coin" count={12} />
          <RewardChip kind="gift" count={12} />
          <RewardChip kind="box" count={6} />
        </div>
      </div>

      <div className="rewards__stage">
        <ScratchCard revealed={revealed} onRevealed={reveal} onViewDetails={onOpenProduct} />

        {revealed && (
          <div className="rewards__burst" aria-hidden="true">
            <Confetti burstKey={burst} count={26} scale={2.1} spread={1.5} />
          </div>
        )}
      </div>

      <div className="postpaid">
        <span className="postpaid__badge" aria-hidden="true">
          P
        </span>
        <div className="postpaid__text">
          <p className="postpaid__brand">Paytm Postpaid</p>
          <p className="postpaid__line">
            Get <strong>₹2,000</strong> credit instantly
          </p>
        </div>
        <button className="postpaid__cta" type="button">
          Activate Now
        </button>
      </div>

      <PaytmTabBar />
    </div>
  );
}
