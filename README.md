# Clippings — editorial job board (demo)

An art-directed job discovery site. Job postings appear as a collage of paper clippings in a framed hero; scrolling gathers them into a filterable grid; opening one morphs it into a detail and application sheet.

All companies, roles, and details are fictional. No salary figures are shown because none were supplied. The "Clippings" wordmark is a placeholder.

## Run it

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173 (binds 0.0.0.0)
npm run build      # type-check + production build into dist/
npm run preview    # serve the built dist/ on port 4173
```

### Connecting a real application endpoint (optional)

By default the application form runs in **demo mode**: nothing leaves the browser, and the UI says so. To deliver applications, set an endpoint in `.env.local`:

```bash
VITE_APPLICATION_ENDPOINT=https://your-service.example.com/applications
```

The form then `POST`s JSON with `jobId`, `jobTitle`, `company`, `name`, `email`, `portfolio`, `resumeLink`, `note`, and `submittedAt`. Your endpoint must:

- accept CORS from the site origin (or be same-origin);
- return a 2xx status on success (any other status shows a visible error);
- handle spam protection, storage, and forwarding to the employer.

Backend work still required before any real use: the endpoint itself, spam protection (for example a honeypot or CAPTCHA), data-retention policy, and a privacy notice on the form.

## Project structure

```
index.html
vite.config.ts
src/
  main.tsx                 entry: fonts, global CSS, ScrollTrigger refresh
  App.tsx                  page shell, open/close state, focus restore, inert while open
  types.ts                 Job type (the shared record for cards and dialog)
  data/
    jobs.ts                8 fictional sample roles (replace with a feed later)
    presentation.ts        clipping variants + hero collage layouts (desktop/tablet/mobile)
  components/
    SiteHeader.tsx         wordmark + Open roles / About / Contact
    Hero.tsx               framed collage, responsive recomposition, entrance animation
    ClippingCard.tsx       shared clipping body; HeroClipping (decorative) and GridClipping (button)
    Marks.tsx              hand-drawn SVG marks, stamps, notes, tape (decorative, aria-hidden)
    JobBoard.tsx           filters, accessible grid, scroll-scrubbed gather animation, empty state
    JobDialog.tsx          morphing dialog, fold cue, focus trap, scroll lock, Escape/backdrop close
    ApplicationForm.tsx    validated application form with submitting/success/error states
  lib/
    gsap.ts                GSAP + ScrollTrigger registration (single place)
    validation.ts          form rules (pure functions)
    submitApplication.ts   demo submission, or POST to VITE_APPLICATION_ENDPOINT
    submitStatus.ts        isDemoSubmission flag
    format.ts              posting age and date formatting
  hooks/useMediaQuery.ts   matchMedia hooks (reduced motion, mobile)
  styles/
    tokens.css             design tokens from design-system.md
    base.css               reset, paper grain, focus, skip link
    components.css         all components and responsive/reduced-motion rules
```

## Design and interaction notes

- **Hero:** a fixed-composition stage per breakpoint (desktop, tablet, mobile), scaled to fit its container. The mobile layout is a separate arrangement, not a shrunk desktop. Clippings rise in with a staggered 0.9s ease-out and small rotation differences.
- **Gather:** each grid slot starts displaced and rotated, like loose paper, and settles to its cell as it scrolls into view. It is scroll-scrubbed without pinning, and native scrolling is untouched.
- **Dialog:** opens by morphing from the clicked clipping's bounding box (translate and scale, with the origin's rotation). A short crease and sheen mark the fold, and content is revealed after the sheet settles. Closing reverses toward the origin when it is on screen. On mobile and with reduced motion it is a simple sheet or fade.
- **Accessibility:** the grid is the keyboard path, with each card an `h3 > button`. The dialog uses `role="dialog"`, `aria-modal`, and labelled headings. Focus moves into the dialog, is trapped there, and returns to the job's card on close. Everything behind the dialog is `inert`. Escape closes; backdrop clicks close only when both press and release land on the backdrop.
- **Reduced motion:** entrance, gather, and morph are skipped or reduced to fades, and CSS animation durations are collapsed.

## Demo-only behaviour

- Submissions are simulated (about 0.9s delay) and stay in the browser tab unless `VITE_APPLICATION_ENDPOINT` is set. The success message says that nothing was sent to the employer.
- The resume field is a link field, because there is no file upload. This is deliberate: no fake upload control.
- Contact is a placeholder paragraph, not a working channel.
- Lenis smooth scrolling was not added. Native scrolling is kept, which avoids scroll-hijacking and keeps ScrollTrigger reliable.
