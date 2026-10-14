# Paytm Rewards — Design Direction

**Document status:** v0.2 · working draft
**Owner:** design + product (feature team)
**Companion artefact:** interactive prototype shell in this repo (`npm run dev`)

> ### Read this first
> Sections §1–§13 define the **design system** for the feature. Sections §14–§15 define the
> **feature direction and the prototype**. §16–§17 track what is still open.
>
> **Two things are provisional:**
> 1. **Exact token values.** The palette, type scale and radii below are derived from Paytm's
>    public visual language, not from your screenshots — the images did not arrive with the
>    request. §16 is the audit checklist I will run the moment the screens land, and §3/§4 carry
>    `PROVISIONAL` markers on every value that could move.
> 2. **§14 Feature direction.** The two flows in the prototype are placeholders that prove the
>    shell works. They get replaced verbatim by your PRD.
>
> Everything else — principles, component specs, motion rules, accessibility floor, and the
> prototype architecture — is stable and does not depend on the screenshots.

---

## 1. Product context

Paytm Rewards is not a destination product; it is a **layer on top of payments**. Almost nobody
opens Paytm to "use rewards" — they open it to pay someone, and rewards have to earn attention
inside a transaction that the user wants to finish in under ten seconds.

That produces three hard constraints on every design decision in this document:

| Constraint | Consequence for design |
| --- | --- |
| **Payments come first** | Rewards never interrupt a payment. They announce before, celebrate after. |
| **Mass-market India, low-end Android, patchy network** | Motion budgets are small, screens degrade to skeletons rather than spinners, every screen has an explicit offline/error variant. |
| **Money and trust** | Every number is exact, tabular, and explainable. No dark patterns around points, expiry, or redemption. |

**Primary surfaces:** the payment flows (Scan & Pay, bills, recharge), the rewards hub, and the
post-payment reward moment. The hub is the only surface users navigate to deliberately.

**Primary jobs:**
1. *Earn* — make the reward visible **before** the payment commitment, so it changes behaviour.
2. *Celebrate* — make the reward feel like a win at the moment it lands.
3. *Return* — make the balance worth coming back to (tiers, expiry, relevant offers).
4. *Redeem* — make the exchange rate and the irreversibility obvious before the tap.

---

## 2. Design principles

These are the tie-breakers. When two reasonable options conflict, the higher-numbered principle
loses to the lower-numbered one.

**P1 — Payment clarity beats reward delight.**
If a reward treatment adds friction, ambiguity, or a tap to a payment, cut the treatment. The
receipt must always be legible before the prize.

**P2 — Announce before, reveal after.**
The user learns they will earn something *before* they commit money (nudge above the CTA), and
discovers *how much* only after the payment succeeds. Anticipation before, surprise after — never
the reverse.

**P3 — One gold thing per screen.**
Gold means "value you can have". If two elements are gold, neither is. Everything else on a
reward screen is navy, white, or neutral.

**P4 — Every number is exact and explainable.**
No rounding of points, no hidden expiry, no "up to ₹X" without the ceiling being reachable in a
stated way. The ledger shows lapses as well as wins.

**P5 — Motion is feedback, not decoration.**
Animation must explain a state change (where this screen came from, what just credited). If it
does not explain something, it does not ship. Nothing animates longer than 450 ms except the
single reward-reveal moment.

**P6 — Design the failure first.**
Every screen ships with loading, empty, and error variants in the prototype. "Money may have left
your bank and we don't know yet" is a first-class design problem, not an edge case.

**P7 — Accessible by default, not by exception.**
AA contrast on all text, 44 px minimum touch targets, no colour-only signalling. See §12 — the
token values in §3 were chosen to make this automatic rather than a review comment.

---

## 3. Colour system  ·  `PROVISIONAL` values, stable rules

Source of truth: `src/index.css` (`@theme` block). Runtime mirror: `src/design/tokens.ts`.

### 3.1 Brand

| Token | Hex | Tailwind class | Use |
| --- | --- | --- | --- |
| `brand-navy` | `#002970` | `bg-brand-navy` / `text-brand-navy` | Primary brand surface, headers, **primary CTA on light**, ink on cyan |
| `brand-navy-700` | `#001F54` | `bg-brand-navy-700` | Gradient end, pressed states on navy |
| `brand-sky` | `#00BAF2` | `bg-brand-sky` | Accent **fill only**: buttons, progress, active indicators, scanner UI |
| `brand-sky-100` | `#E0F6FE` | `bg-brand-sky-100` | Tinted panels behind navy text (12.1:1) |
| `brand-ink` | `#0B1220` | `text-brand-ink` | Status bar glyphs, near-black |

> **Rule 3.1a — cyan is a fill, never a text colour on white.**
> White on `#00BAF2` is **2.26:1** — it fails WCAG at every level, and Paytm's live app ships it
> anyway. We invert the pairing: **cyan fill + navy ink text = 6.00:1 (AA ✓)**. That keeps the
> signature Paytm button and passes contrast. Where a cyan *text* is genuinely needed (links on
> white), use `brand-navy` at weight 600, or darken to `#0076A3` (5.10:1).
> This is a deliberate deviation from the live app — flagged for sign-off in §17.

### 3.2 Reward / value accent

| Token | Hex | Use |
| --- | --- | --- |
| `reward-gold` | `#F5A623` | Gold gradient start; the "you can have this" colour |
| `reward-gold-100` | `#FFF4E0` | Soft gold panel behind warning/reward copy |
| `reward-ink` | `#5A3A00` | Text on gold fills (5.08:1 AA ✓) |
| `reward-cashback` | `#1C9C62` | Cashback-specific green in illustrations/badges |

Gold gradient recipe: `from-reward-gold to-[#FFC85C]` at 100°–135°, with `reward-ink` text.
Never place white text on gold (2.0:1).

### 3.3 Semantic (feedback)

All four pairs are AA-compliant for body text — that was the selection criterion.

| Token | Hex | Soft bg | Contrast (text on soft) | Use |
| --- | --- | --- | --- | --- |
| `success` | `#0D6E33` | `#E6F6EC` | **5.69:1** | Payment success, points earned, credit |
| `warning` | `#9A5C00` | `#FFF4E0` | **4.93:1** | Expiry pressure, reward nudges, caution |
| `danger` | `#B42318` | `#FDECEA` | **5.75:1** | Failure, points spent/expired, destructive |
| `info` | `#0066CC` | `#E8F2FF` | **4.92:1** | Neutral system information |

> **Rule 3.3a — semantic colour never carries meaning alone.** Every success/error/expiry state
> pairs its colour with an icon *and* a word ("Credited", "Failed", "Expires in 12 days").

### 3.4 Neutrals

| Token | Hex | Contrast on white | Contrast on `surface-app` | Use |
| --- | --- | --- | --- | --- |
| `text-primary` | `#0B1220` | 18.7:1 | 17.0:1 | Headings, amounts, primary labels |
| `text-secondary` | `#4E5C73` | 6.77:1 | 6.15:1 | Body copy, metadata |
| `text-tertiary` | `#5F6A7C` | 5.47:1 | 4.97:1 | Tertiary labels, timestamps — still AA |
| `text-inverse` | `#FFFFFF` | — | — | Text on navy / gold-ink surfaces |
| `surface-app` | `#F2F4F8` | — | — | Screen background between cards |
| `surface-card` | `#FFFFFF` | — | — | Cards, sheets, sticky CTAs |
| `surface-sunken` | `#EEF1F6` | — | — | Skeletons, inset fields, icon tiles |
| `border-hairline` | `#E4E8EF` | — | — | Card dividers, row separators |
| `border-strong` | `#CFD6E0` | — | — | Input borders, sheet grab handle |

> **Rule 3.4a — elevation is mostly borders.** White card on `#F2F4F8` already separates. Add a
> hairline border or `shadow-card`; never stack two shadows.

### 3.5 Colour budget per screen

- **1** dominant surface (navy *or* light — not both, except the hub's navy header + light body).
- **1** gold element maximum (P3).
- **≤2** semantic colours, and only when the screen genuinely has two different outcomes.
- Cyan appears as fill/indicator only, ≤2 instances.

---

## 4. Typography  ·  `PROVISIONAL` scale, stable rules

**Family:** Inter (prototype) standing in for Paytm's app font. If the audit shows Paytm Sans or
another family, only the `--font-sans` token changes; the scale below is family-agnostic.

| Name | Size / line | Weight | Tailwind | Use |
| --- | --- | --- | --- | --- |
| display | 34 / 40 | 700 | `text-display` | Reward amount at the reveal moment, paid amount |
| h1 | 24 / 30 | 700 | `text-3xl` | Screen-level hero numbers |
| h2 | 20 / 26 | 700 | `text-2xl` | Card titles, section heroes |
| h3 | 18 / 24 | 600 | `text-xl` | Header titles, primary card title |
| title | 16 / 22 | 600 | `text-lg` | List row titles, CTA labels (lg) |
| body | 14 / 20 | 400 | `text-md` | Default reading text |
| body strong | 14 / 20 | 600 | `text-md font-semibold` | Emphasised body |
| label | 13 / 18 | 500 | `text-base` | Buttons (md), field labels |
| caption | 12 / 16 | 400 | `text-sm` | Metadata, secondary lines |
| micro | 11 / 15 | 500 | `text-xs` | Tags, legal footnotes, tab labels |

**Rules**

- **4.1 — Never below 11 px.** Terms & conditions are 12 px, not 9 px. If the legal text does not
  fit at 12 px, it is too long, not too big.
- **4.2 — All money and points use tabular numerals** (`.tabular` / `font-variant-numeric:
  tabular-nums`) so digits do not jitter during count-up animation or in ledgers.
- **4.3 — One display size per screen.** The largest number on a screen is the one the user came
  for: the paid amount on a receipt, the won amount on a reveal, the balance on the hub.
- **4.4 — Weight does hierarchy, not colour.** Primary/secondary/tertiary text differ in size and
  weight first; colour is the last resort (colour-only hierarchy fails §12).
- **4.5 — Currency symbol is smaller than the number.** `₹` at ~0.7× the numeral size, same
  weight, no space: `₹1,250`.
- **4.6 — Indian digit grouping** via `toLocaleString('en-IN')`: `₹1,25,000`, not `₹125,000`.
- **4.7 — Vernacular.** The scale must survive Devanagari and Tamil at 14 px: keep line-height ≥
  1.45 for body, and never clip ascenders/descenders in fixed-height rows (rows are min-height,
  not height).

---

## 5. Space, grid, layout

**Base unit: 4 px.** Spacing ramp: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48`.

| Element | Value | Tailwind |
| --- | --- | --- |
| Screen side margin | 16 px | `px-4` |
| Card inner padding | 14 px | `p-3.5` |
| Card gap (vertical stack) | 12 px | `space-y-3` |
| Row padding | 12 px vertical / 16 px horizontal | `px-4 py-3` |
| Section gap | 20 px | `pt-5` |
| Bottom safe area above CTA | 24 px | `pb-6` |
| Icon tile (grid) | 46 px | — |
| Icon tile (list row) | 38–40 px | — |

**Layout rules**

- **5.1 — 390 × 844 logical viewport** (iPhone 14 class) is the design canvas; the prototype
  renders exactly this. Layouts must also survive 360 × 640 (common low-end Android): no fixed
  widths above 320 px, horizontal scrollers instead of forced columns.
- **5.2 — Max 2 columns for actions, 3 for icon grids.** A 3-column quick-action grid is the
  ceiling; beyond that labels wrap and the grid reads as noise.
- **5.3 — Sticky CTA bars are white with a hairline top border** — never a shadow over scrolling
  content (shadows imply the content is behind a card).
- **5.4 — Scrollable regions get `overscroll-contain`** so a nested list never drags the parent.
- **5.5 — Full-bleed colour only at the top of a screen.** Navy headers bleed to the edges and
  meet the light body with a 12 px top radius on the body (`rounded-t-xl`), which is the Paytm
  "sheet over header" idiom.

---

## 6. Radius, elevation, borders

| Token | Value | Use |
| --- | --- | --- |
| `radius-xs` | 4 px | Tags, tiny badges |
| `radius-sm` | 8 px | Inputs, small buttons, skeleton blocks |
| `radius-md` | 12 px | Cards, icon tiles, md buttons |
| `radius-lg` | 16 px | Hero cards, lg buttons, promo cards |
| `radius-xl` | 20 px | Bottom sheets (top corners only) |
| `radius-pill` | 999 px | Chips, progress bars, toggles |

| Token | Value | Use |
| --- | --- | --- |
| `shadow-card` | `0 1px 2px rgba(11,18,32,.06), 0 1px 1px rgba(11,18,32,.04)` | Default card |
| `shadow-raised` | `0 4px 12px rgba(11,18,32,.08), 0 1px 3px rgba(11,18,32,.06)` | Promo/reward cards |
| `shadow-float` | `0 12px 32px rgba(11,18,32,.18)` | Floating objects (scratch card) |
| `shadow-sheet` | `0 -8px 32px rgba(11,18,32,.16)` | Bottom sheets |

**Rules:** radius increases with elevation (a floating object is rounder than a resting one);
never mix radius scales inside one component; scrims are `black/45` for sheets and `black/35` for
in-screen controls over imagery.

---

## 7. Iconography & imagery

- **Grid:** 24 × 24, **1.8 px stroke**, round caps and joins, 2 px optical padding.
  The prototype ships an inline SVG set in `src/ui/icons.tsx` (28 glyphs) so nothing depends on a
  network icon font.
- **Style:** outlined by default. Filled only for the active tab-bar item and for solid state
  badges (success disc, danger disc).
- **Sizes:** 16 (inline with micro text), 18–20 (rows, buttons), 22 (icon tiles), 26–28 (empty
  states), 42–44 (hero success/reward moments).
- **Colour:** icons inherit their text colour. A gold icon means "value"; a cyan icon means
  "action available"; a neutral icon means "category".
- **Illustration:** flat, two-tone (navy + cyan), no gradients inside illustrations except gold on
  reward objects. Photography is not used in the reward flows — it competes with amounts.
- **Emoji:** allowed **only** in celebration copy (`🎉`), never in navigation, errors, or numbers.

---

## 8. Components

Every component below exists in code (`src/ui/primitives.tsx`) with all listed states.

### 8.1 Button

| Variant | Fill | Text | Contrast | Use |
| --- | --- | --- | --- | --- |
| `primary` | `brand-sky` | `brand-navy` | 6.00:1 | The one main action per screen |
| `reward` | `brand-navy` | white | 13.5:1 | Reward/redemption primary action |
| `secondary` | white + `border-strong` | `brand-navy` | 12.1:1 | Alternative action |
| `ghost` | transparent (inherits) | inherits | — | Tertiary action, works on dark too |
| `danger` | `danger` | white | 6.57:1 | Destructive (rare in rewards) |

Sizes: `sm` 32 px / 13 px label · `md` 40 px / 14 px · `lg` 48 px / 16 px (radius 12 px).
States: default → pressed (scale 0.97, spring) → disabled (opacity 0.4, no press).

**Rules:** one `primary` per screen; `lg` only for the screen's main commitment; a disabled
primary must have visible copy explaining why ("Reveal to continue"); never place a button inside
a scrollable list row.

### 8.2 Chip / Tag

- **Chip** — selectable, 32 px tall, pill radius, single-select in a filter row. Inactive:
  white + hairline + secondary text. Active: navy fill + white text (or cyan fill + navy text
  inside a brand context).
- **Tag** — non-interactive label, 4 px radius, micro uppercase bold, soft semantic fill
  (`Earned` / `Redeemed` / `Expired` / `UPI` / `Bills`).

### 8.3 Card

White, 12 px radius, `shadow-card`, 14 px padding. Pressable cards scale to 0.985 on tap and gain
a hairline border (`border-hairline`) when they sit next to other cards. Card groups collapse into
a single card with hairline dividers when the rows share a category (ledger, transaction list).

### 8.4 List row

40 px icon tile + title (14/600) + subtitle (12/400 secondary) + trailing value (14/700, tabular).
56 px minimum height, hairline divider except on the last row. Trailing chevron only when the row
navigates.

### 8.5 Icon tile

Rounded square, tones: `sky` (brand-sky-100 + navy glyph), `navy`, `gold`, `green`, `soft`
(sunken bg + secondary glyph), `white`. Sizes 38 / 40 / 44 / 46.

### 8.6 Header

44 px + safe area. Tones: `light` (white, hairline bottom), `brand` (navy, no border),
`transparent` (inherits colour — used over gradients). Back button is a 36 px circular hit area
with a 22 px glyph. Title 18/600 with optional 12 px subtitle; the title truncates, never wraps.

### 8.7 Amount field

Sunken panel (`surface-app` + hairline border), `₹` at 20 px secondary, amount at 24 px bold
tabular, "Edit" affordance right-aligned. Tapping focuses the numeral pad — the amount is always
editable before commit.

### 8.8 Banner

Soft semantic fill, 12 px radius, 18 px leading icon, title 14/600, body 12/400 at 0.9 opacity,
optional trailing action pill. Gold banner = redemption nudge; info banner = system message.

### 8.9 Bottom sheet

Top radius 20 px, 40 × 4 grab handle, 45 % scrim, spring entrance (stiffness 260, damping 28),
max height 70 % with internal scroll, 24 px bottom padding for the home indicator. Sheets are for
**decisions**, not for navigation: they contain the numbers and the commit button.

### 8.10 Tab bar

4 items maximum, 44 px + safe area, 10 px labels, 20 px icons, active = navy glyph + 24 px cyan
underline. A centre scan FAB may replace one slot if the audit shows Paytm does this.

### 8.11 Progress

1.5–6 px pill track, `white/15` on navy or `surface-sunken` on light, cyan fill. Always paired
with a **numerical** statement of what is left ("275 points to the next tier") — a bar alone is
not information.

### 8.12 Scratch card (feature-specific)

288 × 224 px, 20 px radius, `shadow-float`. Three layers: prize face (gold gradient) → silver
scratch layer (135° metallic gradient + looping shine) → confetti. The card is the only bright
object on a navy field. Full motion spec in §10.4.

---

## 9. Patterns (reward-specific)

**9.1 The reward nudge.** A single gold-soft panel immediately above the pay CTA, stating the
*assured* part and the *ceiling*: "Pay ₹450 and get an assured scratch card · up to ₹200
cashback". The CTA then binds both actions ("Pay ₹450 & earn reward"). Never place the nudge above
the amount field — the amount is the decision, the nudge is the incentive.

**9.2 Tease, then reveal.** Post-payment, announce that a reward exists without the amount;
reveal it on a dedicated screen the user taps into. Skipping the reveal is allowed ("Skip" top
right) and must credit silently.

**9.3 Irreversible actions get two steps.** Redemption = summary screen → confirmation sheet with
the exact numbers → success. The success screen states the new balance, not just "Done".

**9.4 Expiry pressure, honestly.** Show points expiring with a countdown *and* the best thing
they can buy right now. Never use expiry without an action.

**9.5 Ledger trust.** Earned (+, green), redeemed (−, danger), expired (−, tertiary). Expired rows
are visible and explainable. Lifetime total at the foot of the list.

**9.6 Ambiguous payment state.** When a payment's status is unknown, the screen says so plainly
("Money may have left your bank"), states the resolution window ("confirm within 5 minutes"), and
promises the reward will still credit. No celebratory treatment on this screen.

**9.7 Empty is a direction, not a dead end.** Every empty state names the one action that fills it
("Make your first UPI payment to earn an assured scratch card").

---

## 10. Motion

Tokens in `src/design/tokens.ts → motion`. Engine: `framer-motion`.

### 10.1 Timing

| Name | Value | Use |
| --- | --- | --- |
| instant | 120 ms | Press feedback, toggles |
| fast | 200 ms | Micro state changes, chevrons |
| base | 280 ms | Screen transitions, accordions |
| slow | 420 ms | The reveal only |

Springs: **`spring`** (stiffness 380, damping 34) for navigation and press; **`springSoft`**
(260/28) for sheets and large surfaces. Product ease curve: `cubic-bezier(0.32, 0.72, 0, 1)`.

### 10.2 Navigation transitions

| Type | Enter | Exit |
| --- | --- | --- |
| `push` (forward) | x 100 % → 0, spring 380/36 | x 0 → −22 %, opacity → 0.55 |
| `pop` (back) | x −22 % → 0, opacity 0.55 → 1 | x 0 → 100 % |
| `sheet` | y 100 % → 0, spring 320/32 | y 0 → 100 % |
| `fade` | opacity 0 → 1 (240 ms) | opacity 1 → 0 |
| `none` | opacity 0 → 1 (180 ms) | — |

The outgoing screen dims and retreats 22 % rather than leaving fully — that keeps the stack
legible and costs one composite layer.

### 10.3 Choreography

Enter elements in **staggered groups of 120–150 ms**, max 4 groups, bottom-up or centre-out.
Example (payment success): check disc (spring) → amount (+150 ms) → receipt (+280 ms) → reward
teaser (+400 ms). Nothing waits for the previous element to *finish*.

### 10.4 The reveal (the one place we spend)

| Beat | Duration | Detail |
| --- | --- | --- |
| Anticipation | 1.8 s loop | Shine sweeps the silver layer; card breathes |
| Wipe | 450 ms | Silver fades + scales 1.06 on the product ease |
| Amount | spring 300/14 | Scale 0.6 → 1, rotate −6° → 0 |
| Confetti | 1.1–1.5 s | 18 particles, 5 brand colours, ease-out, no physics loop |
| Balance bar | 800 ms | Width 58 % → 72 %, so the credit is legible |

Total under 1.6 s from tap to settled. Confetti particle count is capped for low-end devices.

### 10.5 Rules

- **10.5a** `prefers-reduced-motion` collapses everything to 150 ms opacity crossfades; the reveal
  shows the amount immediately with no confetti. (Wired in the prototype — see §15.)
- **10.5b** Only animate `transform` and `opacity`. No layout properties except the accordion,
  which animates `height: auto` at 240 ms because the alternative (fixed height) breaks with
  vernacular copy.
- **10.5c** Motion never delays a tap response. Press feedback is 120 ms and starts on touch-down.
- **10.5d** No animation on first paint of a payment screen. The receipt appears; it does not
  arrive.

---

## 11. States

Every screen ships five states, and the prototype exposes them as toggles per step.

| State | Pattern | Copy formula |
| --- | --- | --- |
| `loading` | Skeletons matching final layout (never a centred spinner on a content screen) | none — skeletons are self-explanatory |
| `empty` | 64 px circular icon well + title + one-line reason + single action | "No {thing} yet" + the action that creates it |
| `error` | Danger disc + plain title + consequence + retry | what failed · what it means for the money · what happens next |
| `success` | Success disc + exact amount + next step | never "Success!" alone — always "₹75 credited to rewards" |
| `default` | — | — |

Additional product states to design for: **offline** (cached balance + "showing last known
balance"), **partial** (reward pending, not failed), **ineligible** (offer visible but greyed with
the reason), **first-run** (no balance, no history).

---

## 12. Accessibility (the floor, not a goal)

- **12.1 Contrast** — all text ≥ 4.5:1 (AA). Verified pairs are in §3; Appendix B holds the full
  table. The two known live-app failures (white on cyan, white on gold) are fixed here by pairing
  cyan with navy ink and gold with `reward-ink`.
- **12.2 Touch targets** — ≥ 44 × 44 px. List rows are 56 px; icon buttons get a 36 px visual with
  a 44 px hit area.
- **12.3 Not colour alone** — every semantic state has an icon and a word (§3.3a).
- **12.4 Focus** — visible 2 px cyan focus ring on all interactive elements; the shell (desktop)
  shows it always, the device viewport shows it for hardware keyboard/switch users.
- **12.5 Screen reader** — amounts read as "450 rupees"; the scratch card is a labelled button
  ("Scratch card, tap to reveal") with a live region announcing the prize; icon-only buttons carry
  `aria-label`.
- **12.6 Dynamic type** — layouts survive a 1.3× scale: rows are min-height, cards grow, no fixed
  heights on text containers.
- **12.7 Reduced motion** — §10.5a.
- **12.8 Colour vision** — success/danger are distinguished by sign (+/−), icon, and label, so the
  ledger reads correctly under deuteranopia.

---

## 13. Content & voice

- **13.1 Plain, short, second person.** "You earned ₹75", not "Congratulations on your successful
  transaction".
- **13.2 Numbers before nouns.** "₹75 cashback" beats "Cashback of ₹75".
- **13.3 ceilings are stated.** "up to ₹200" always travels with the condition that reaches it.
- **13.4 No blame, no jargon.** "QR not detected" not "Invalid input". "Payment status unknown"
  not "Transaction failed" when it might have succeeded.
- **13.5 Hinglish is allowed in celebration copy only** if the audit shows Paytm using it; never in
  errors, legal, or numbers.
- **13.6 Legal text is 12 px, sentence case, bulleted, and expanded inline** — not behind a
  webview.
- **13.7 Microcopy lengths:** CTA ≤ 4 words; subtitle ≤ 60 chars; banner body ≤ 90 chars.

---

## 14. Feature direction

> **This section is a template until the PRD arrives.** The prototype currently runs two
> placeholder flows so the shell is demonstrable. Replace them by editing
> `src/flows/index.ts` — no component code changes needed.

### 14.1 What the shell needs from the PRD

For each flow, the PRD (or your case study) should give me:

1. **Flow name + actor + success outcome** (one line each).
2. **Ordered steps**, each with: a screen name, what the user sees/does, and what triggers the move
   to the next step.
3. **Rules per step** — eligibility, limits, caps, timing, failure handling.
4. **Copy** — the actual strings for nudges, CTAs, errors, empty states.
5. **States worth showing** — which of loading / empty / error / success matter per screen.
6. **Motion intent** — anything that should feel special (the reveal is the obvious one).

### 14.2 Placeholder flows currently in the prototype

| Flow | Steps | Purpose in the prototype |
| --- | --- | --- |
| `earn-cashback` — *Earn: Scan & Pay → cashback* | home → scan-pay → payment-success → reward-reveal → rewards-hub | Demonstrates the nudge-before / reveal-after pattern (§9.1–9.2) and the reveal motion spec (§10.4) |
| `browse-redeem` — *Redeem: browse offer → coupon* | rewards-hub → offer-detail → redeem → history | Demonstrates the two-step irreversible action (§9.3), sheet, ledger and all five states |

Each step carries an `annotation` object with `what`, `why`, `details`, `design`, `motion`, `prd`
and `openQuestions` fields. The `prd` field currently reads **PENDING** — that is exactly where
your PRD text gets pasted, and it renders verbatim in the right-hand panel next to the device.

### 14.3 Per-screen annotation template

```ts
{
  id: 'step-id',
  label: 'Human name in the rail',
  screen: 'registered-screen-id',
  transition: 'push',                      // push | sheet | fade | none
  states: ['default', 'loading', 'error'], // which toggles are live
  annotation: {
    what:  'What the user sees and does.',
    why:   'Why this screen exists in the flow.',
    details: ['Rule 1', 'Rule 2'],
    design:  ['Token / hierarchy decisions'],
    motion:  'What animates, how long, why.',
    copy:    'Wording rationale.',
    prd:     'Verbatim PRD excerpt.',
    openQuestions: ['Thing to resolve'],
  },
}
```

---

## 15. Prototype shell guide

### 15.1 Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Top bar · project · current flow + step · placeholder badge      │
├───────────────┬──────────────────────────────┬───────────────────┤
│ Flow rail     │  Stage                       │ Annotation panel  │
│ • flows       │  ┌──────────┐                │ • what / why      │
│ • steps       │  │  device  │  390 × 844     │ • rules           │
│ • states      │  │  (scaled │  auto-fit      │ • design notes    │
│ • flow meta   │  │  to fit) │                │ • motion          │
│ • reset       │  └──────────┘                │ • PRD excerpt     │
│               │  ◀ step ▮▮▮▮▮ step ▶         │ • open questions  │
└───────────────┴──────────────────────────────┴───────────────────┘
```

### 15.2 Interactions

- Click a **flow** in the rail → the stack resets to step 1.
- Click a **step** → the device jumps there and the stack rebuilds from step 1, so the in-screen
  **Back** button behaves like a real device.
- Click **state toggles** → re-renders the current screen in that state; states not modelled for
  that screen are dimmed. State is remembered per step.
- Tap **inside the device** → real navigation (`goToStep` / `navigate` / `back` / `next`).
- **Keyboard:** `→` next step · `←` back · `R` reset flow.
- **Deep links:** the URL hash mirrors position, e.g. `#/earn-cashback/reward-reveal` — shareable
  with reviewers.
- **Annotation panel** collapses with the chevron on its left edge.

### 15.3 File map

```
docs/design.md                     ← this document
src/index.css                      ← design tokens (CSS source of truth)
src/design/tokens.ts               ← JS mirror (colour, radius, type, motion, device)
src/ui/icons.tsx                   ← inline SVG icon set (no icon font dependency)
src/ui/primitives.tsx              ← component library (§8), all states included
src/screens/types.ts               ← ScreenContext / ScreenState / Transition contracts
src/screens/registry.tsx           ← screen id → component, + per-screen status-bar chrome
src/screens/sample/*.tsx           ← PLACEHOLDER screens (replace with real ones)
src/flows/types.ts                 ← Flow / FlowStep / Annotation contracts
src/flows/index.ts                 ← ✎ EDIT THIS: flows, steps, annotations, PRD text
src/shell/useFlowNav.ts            ← navigation stack, direction, per-step state
src/shell/ScreenStage.tsx          ← transition engine (§10.2)
src/shell/DeviceFrame.tsx          ← bezel, status bar, auto-fit scaling
src/shell/FlowRail.tsx             ← left rail
src/shell/AnnotationPanel.tsx      ← right panel
src/shell/Shell.tsx                ← workbench layout, keyboard, deep links
```

### 15.4 Adding a screen (3 steps)

1. Create `src/screens/<name>.tsx` exporting `(ctx: ScreenContext) => ReactNode`. Use
   `ScreenShell`, `AppHeader` and the other primitives; branch on `ctx.state` via `StateGate`.
2. Register it in `src/screens/registry.tsx` (`screens` map) and add its status-bar chrome.
3. Reference it by id from a step in `src/flows/index.ts`.

### 15.5 Animation requests

Say "animate X" and it lands in the transition engine or the screen itself:
- **Navigation feel** → change a step's `transition` (`push` / `sheet` / `fade` / `none`) or tune
  the springs in `ScreenStage.tsx`.
- **In-screen motion** → add `motion.*` inside the screen (the reveal is the reference
  implementation).
- **Choreography** → stagger with `delay` or `variants` + `staggerChildren`.
- **Global** → tokens in `src/design/tokens.ts → motion`.

---

## 16. Screenshot audit checklist (runs when your screens arrive)

I will re-open this document and update §3–§8 against the real app. What I extract per screen:

- [ ] **Palette** — exact header/CTA/accent hexes, gradient stops and angles, whether cyan is used
      as text (and where contrast fails).
- [ ] **Typography** — family, the actual size ramp, weights, letter-spacing on labels, numerals.
- [ ] **Spacing** — side margins, card padding, row heights, section rhythm, corner radii.
- [ ] **Header idiom** — status bar treatment, back affordance, right-side actions, search field.
- [ ] **Card language** — shadow vs border, radius, dividers, image/illustration use.
- [ ] **Rewards-specific surfaces** — points display, scratch card, offer tiles, coupon codes,
      ledger rows, expiry messaging.
- [ ] **Iconography** — stroke weight, filled vs outlined, corner treatment, brand marks.
- [ ] **Copy voice** — sentence case vs title case, Hinglish usage, CTA phrasing, number formats.
- [ ] **Tab bar / navigation model** — items, active treatment, FAB presence.
- [ ] **Dark surfaces** — where Paytm goes dark (scanner, celebration) and what changes.

Output: a diff against §3–§8 with token updates committed to `src/index.css` and the prototype
re-skinned in the same pass.

---

## 17. Open items / decisions needed

| # | Question | Why it matters | Current prototype stance |
| --- | --- | --- | --- |
| 1 | Do we keep cyan-fill buttons with **navy** ink (6.0:1) or match the live app's white-on-cyan (2.26:1)? | Accessibility vs brand match | Navy ink — AA compliant |
| 2 | Is the reward **assured** or probabilistic? | Drives §9.1 copy and the reveal design | Assured scratch card, up to a stated ceiling |
| 3 | Scratch-card metaphor or instant reveal? | §10.4 motion budget, delight vs speed | Scratch (user-initiated), with "Skip" |
| 4 | Points vs cash value — which is the primary number on the hub? | Hierarchy, §4.3 | Points primary, cash value secondary |
| 5 | Expiry model (90 days? rolling?) and how aggressively we surface it | §9.4, trust | 90 days, countdown + best redemption |
| 6 | Where does the reward entry point live on home — promo card, tab, or both? | §1, discovery vs payment priority | Gold promo card below the action grid |
| 7 | Sound / haptics on reveal? | §10.4, low-end device budget | Out of scope for now |
| 8 | Do we ship vernacular at launch? | §4.7 type survival, copy length | Designed for it, not populated |
| 9 | Which real Paytm screens are in scope for this feature? | §16 audit | Awaiting screenshots |

---

## Appendix A — Token quick reference

```css
/* brand */      --color-brand-navy #002970 · --color-brand-navy-700 #001F54
                 --color-brand-sky #00BAF2 · --color-brand-sky-100 #E0F6FE
                 --color-brand-ink #0B1220
/* reward */     --color-reward-gold #F5A623 · --color-reward-gold-100 #FFF4E0
                 --color-reward-ink #5A3A00 · --color-reward-cashback #1C9C62
/* semantic */   success #0D6E33 / #E6F6EC · warning #9A5C00 / #FFF4E0
                 danger  #B42318 / #FDECEA · info    #0066CC / #E8F2FF
/* neutral */    text #0B1220 · #4E5C73 · #5F6A7C · #FFFFFF
                 surface #F2F4F8 · #FFFFFF · #EEF1F6
                 border #E4E8EF · #CFD6E0
/* radius */     4 · 8 · 12 · 16 · 20 · 999
/* shadow */     card · raised · float · sheet
/* type */       34/40 · 24/30 · 20/26 · 18/24 · 16/22 · 14/20 · 13/18 · 12/16 · 11/15
/* space */      0 4 8 12 16 20 24 32 40 48   (4px base)
/* motion */     120 · 200 · 280 · 420 ms — spring 380/34 · springSoft 260/28
                 ease cubic-bezier(0.32, 0.72, 0, 1)
/* device */     390 × 844
```

## Appendix B — Contrast verification

| Foreground | Background | Ratio | WCAG |
| --- | --- | --- | --- |
| `#0B1220` text-primary | `#FFFFFF` | 18.72 | AAA |
| `#4E5C73` text-secondary | `#FFFFFF` | 6.77 | AA |
| `#5F6A7C` text-tertiary | `#FFFFFF` | 5.47 | AA |
| `#5F6A7C` text-tertiary | `#F2F4F8` | 4.97 | AA |
| `#FFFFFF` | `#002970` navy | 13.54 | AAA |
| `#002970` navy ink | `#00BAF2` sky fill (primary CTA) | 6.00 | AA |
| `#002970` | `#E0F6FE` sky-100 | 12.11 | AAA |
| `#5A3A00` reward-ink | `#F5A623` gold | 5.08 | AA |
| `#9A5C00` warning | `#FFF4E0` | 4.93 | AA |
| `#0D6E33` success | `#E6F6EC` | 5.69 | AA |
| `#B42318` danger | `#FDECEA` | 5.75 | AA |
| `#0066CC` info | `#E8F2FF` | 4.92 | AA |
| `#FFFFFF` | `#B42318` danger fill | 6.57 | AA |
| `#FFFFFF` | `#00BAF2` sky fill *(live-app pattern — avoided)* | 2.26 | **fail** |

---

*Generated for the `paytm_rewards` prototype shell. Token values marked `PROVISIONAL` update after
the screenshot audit (§16); §14 updates when the PRD lands.*
