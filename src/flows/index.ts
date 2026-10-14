import type { Flow } from './types';

/**
 * Flow definitions.
 *
 * PLACEHOLDER CONTENT — these two flows exist so the shell is demonstrable
 * before the PRD arrives. Replace `steps` and `annotation` text verbatim from
 * the PRD / case study; the shell needs no code changes to pick up edits here.
 */
export const flows: Flow[] = [
  {
    id: 'earn-cashback',
    name: 'Earn: Scan & Pay → cashback',
    summary: 'The core earn loop: pay with UPI, get an assured scratch card, reveal cashback.',
    actor: 'Consumer paying a merchant',
    outcome: 'Reward revealed and credited to the rewards balance',
    tags: ['earn', 'upi', 'core loop'],
    steps: [
      {
        id: 'home',
        label: 'Home',
        screen: 'home',
        transition: 'none',
        states: ['default', 'loading', 'empty', 'error'],
        annotation: {
          what: 'Paytm home with the rewards entry point as a gold promo card under the quick-action grid.',
          why: 'Rewards must be visible without a tap, but must not outrank payments. The gold card sits below the action grid so earning reads as a benefit of paying, not a separate product.',
          details: [
            'Entry point shows live points balance + one expiring offer (highest-intent signal).',
            'Tapping "Scan & Pay" starts the earn flow.',
            'Tapping the rewards card jumps to the hub.',
          ],
          design: [
            'Navy → deep-navy gradient header, cyan search field on white/12.',
            'Gold gradient reserved for reward surfaces only — it is the "value" colour.',
            'Quick actions: 46px icon tiles, 12px radius, 3-column grid on a 4px base.',
          ],
          motion: 'Card press scales to 0.98; quick-action tiles scale to 0.94. No page-level animation on first load.',
          prd: 'PENDING — paste the PRD section for the home entry point here.',
          openQuestions: [
            'Does the home entry point show points, cash value, or both?',
            'Should the expiring-offer nudge be personalised or generic?',
          ],
        },
      },
      {
        id: 'scan-pay',
        label: 'Scan & Pay',
        screen: 'scan-pay',
        transition: 'push',
        states: ['default', 'loading', 'error', 'empty'],
        annotation: {
          what: 'Camera viewfinder with a detected merchant, editable amount, and a reward nudge above the pay CTA.',
          why: 'The nudge is the single moment where the user learns that paying earns something. It must precede the commitment, not follow it.',
          details: [
            'Nudge copy states the assured prize and the ceiling: "assured scratch card · up to ₹200 cashback".',
            'CTA is reworded to bind the two actions: "Pay ₹450 & earn reward".',
            'Error state covers unreadable QR; empty state covers missing camera permission.',
          ],
          design: [
            'Dark viewfinder (#0a0f1a) with cyan corner brackets — the only dark surface in the flow.',
            'Amount field uses the display numeral size for confidence before paying.',
            'Nudge uses the gold token pair (bg #fff4e0 / text #b26a00) so it reads as value, not warning.',
          ],
          motion: 'Scan line sweeps the viewfinder on a 2.6s loop; the sheet springs up 100ms after detection so the amount never pops in mid-scan.',
          prd: 'PENDING — paste eligibility rules (min amount, merchant categories, daily caps) here.',
          openQuestions: ['Is the reward assured or probabilistic?', 'Where does the eligibility check run — client or server?'],
        },
      },
      {
        id: 'payment-success',
        label: 'Payment success',
        screen: 'payment-success',
        transition: 'push',
        states: ['default', 'error'],
        annotation: {
          what: 'Standard payment confirmation with a reward teaser card below the transaction details.',
          why: 'Payment confirmation is a trust screen. The reward is announced but not revealed, so the confirmation never competes with the receipt.',
          details: [
            'Teaser says the reward is ready; the amount stays hidden to carry the user into the reveal.',
            'Primary CTA becomes "Reveal my reward"; secondary returns home.',
            'Error variant handles the ambiguous "status unknown" case — money may have left the bank.',
          ],
          design: [
            'Green success disc, 80px, on soft green; amount at display size, tabular numerals.',
            'Receipt card uses hairline borders only — no shadow stacking.',
          ],
          motion: 'Staggered entrance: check (spring) → amount (150ms) → receipt (280ms) → reward teaser (400ms).',
          prd: 'PENDING — paste reward-credit timing and failure handling here.',
        },
      },
      {
        id: 'reward-reveal',
        label: 'Reward reveal',
        screen: 'reward-reveal',
        transition: 'push',
        states: ['default', 'error'],
        annotation: {
          what: 'Full-screen scratch card. Tap to wipe the silver layer and reveal cashback, then see the updated balance.',
          why: 'This is the emotional peak of the earn loop and the screen that drives repeat behaviour. It earns the largest motion budget in the product.',
          details: [
            'Reveal is user-initiated (tap), never automatic — anticipation is the point.',
            'Primary CTA stays disabled until revealed, which prevents skipping the moment.',
            'Balance bar animates from 58% → 72% to make the credit legible.',
            'Error variant reassures: the prize is safe and will credit within 24h.',
          ],
          design: [
            'Navy gradient background so the gold card is the only bright object.',
            'Amount is the largest type on screen (34px display) — nothing else competes.',
            'Confetti uses the five brand-family colours at low count (18) to stay cheap on low-end devices.',
          ],
          motion: 'Anticipation: shine sweep loops at 1.8s. Reveal: silver layer fades + scales 1.06 over 450ms with the product ease curve; amount springs in (stiffness 300, damping 14); confetti 1.1–1.5s; balance bar 800ms.',
          prd: 'PENDING — paste prize distribution, caps and anti-fraud rules here.',
          openQuestions: ['Do we keep the scratch metaphor or go straight to a reveal?', 'Is a sound/haptic cue in scope?'],
        },
      },
      {
        id: 'rewards-hub',
        label: 'Rewards hub',
        screen: 'rewards-hub',
        transition: 'push',
        states: ['default', 'loading', 'empty', 'error'],
        annotation: {
          what: 'Points balance, expiry warning, and three tabs: Offers, My points, History.',
          why: 'Converts a momentary win into a balance worth returning to. Expiry pressure is the primary re-engagement lever.',
          details: [
            'Progress bar shows distance to the next redemption tier.',
            'Top banner is the highest-value redeemable action, not an ad slot.',
            'Empty state pushes the user back into the earn loop.',
          ],
          design: [
            'Navy header carries the balance; content below is light so offers can use white cards.',
            'Tabs are pills on the navy surface: active = white fill / navy text.',
          ],
          motion: 'Balance bar grows from 0 on entry (900ms ease-out) so the number feels earned.',
          prd: 'PENDING — paste tier logic, expiry policy and offer ranking rules here.',
        },
      },
    ],
  },
  {
    id: 'browse-redeem',
    name: 'Redeem: browse offer → coupon',
    summary: 'Spending points: pick an offer, read the terms, confirm redemption, see the ledger entry.',
    actor: 'Consumer with a points balance',
    outcome: 'Coupon issued and the ledger updated',
    tags: ['redeem', 'offers'],
    steps: [
      {
        id: 'rewards-hub',
        label: 'Rewards hub',
        screen: 'rewards-hub',
        transition: 'none',
        states: ['default', 'loading', 'empty', 'error'],
        annotation: {
          what: 'Same hub as the earn flow, entered directly. The banner is the redemption entry point.',
          why: 'Redemption starts from a balance, not from a payment — so the hub is the flow root here.',
          details: ['Banner offers the best value-per-point deal first.', 'Offer cards show cost in points next to the value.'],
          design: ['Gold banner = redemption nudge; white cards = catalogue.'],
          prd: 'PENDING — paste offer ranking / eligibility logic here.',
        },
      },
      {
        id: 'offer-detail',
        label: 'Offer detail',
        screen: 'offer-detail',
        transition: 'push',
        states: ['default', 'loading', 'error'],
        annotation: {
          what: 'Offer hero with cost vs. value, a three-step "how it works", terms accordion, and a sticky redemption CTA.',
          why: 'Redemption is irreversible, so the screen has to make the exchange rate obvious before the tap.',
          details: [
            'Shows balance after redemption above the CTA — the number users actually worry about.',
            'Terms are collapsed by default but present; expanded state is animated height.',
            'Error variant handles an ended or ineligible offer.',
          ],
          design: [
            'Navy hero with the cost/value pair in a white/10 panel.',
            'Sticky CTA bar on white with a hairline top border — no shadow over scrolling content.',
          ],
          motion: 'Accordion uses height auto + opacity over 240ms on the product ease curve; chevron rotates 180°.',
          prd: 'PENDING — paste offer terms, validity windows and stacking rules here.',
        },
      },
      {
        id: 'redeem',
        label: 'Confirm & redeem',
        screen: 'redeem',
        transition: 'push',
        states: ['default', 'loading', 'error', 'success'],
        annotation: {
          what: 'Redemption summary, use-case picker, confirmation bottom sheet, then a success screen.',
          why: 'Two-step confirmation for an irreversible action, with the sheet carrying the numbers so the decision is made at the point of commitment.',
          details: [
            'Success is an in-screen state, not a new route — the user can go to rewards or history from there.',
            'Error variant states explicitly that points were NOT deducted.',
          ],
          design: [
            'Cyan tinted summary card marks the transaction; green disc confirms it.',
            'Sheet is 20px top radius, grab handle, spring entrance, 45% scrim.',
          ],
          motion: 'Sheet springs in (stiffness 260, damping 28); success disc springs at 300/16 with a 0.5 → 1 scale.',
          prd: 'PENDING — paste redemption API contract, idempotency and refund behaviour here.',
        },
      },
      {
        id: 'history',
        label: 'Rewards history',
        screen: 'history',
        transition: 'push',
        states: ['default', 'loading', 'empty', 'error'],
        annotation: {
          what: 'Filterable ledger of earned, redeemed and expired points.',
          why: 'Trust surface: every point movement is explainable, including lapses.',
          details: [
            'Filters are chips, horizontally scrollable, single-select.',
            'Expired rows are shown, not hidden — silent expiry destroys trust.',
            'Empty state adapts to the active filter.',
          ],
          design: [
            'Rows on one white card with hairline dividers; 40px icon tiles.',
            'Signed point values: green for earned, red for spent/expired, tabular numerals.',
          ],
          prd: 'PENDING — paste ledger event taxonomy and retention window here.',
        },
      },
    ],
  },
];

export const getFlow = (id: string) => flows.find((f) => f.id === id) ?? flows[0];
