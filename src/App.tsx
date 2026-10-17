import { useCallback, useState } from 'react';
import type { Job } from './types';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { JobBoard } from './components/JobBoard';
import { JobDialog } from './components/JobDialog';

type Active = { job: Job; origin: HTMLElement };

export default function App() {
  const [active, setActive] = useState<Active | null>(null);

  const openJob = useCallback((job: Job, origin: HTMLElement) => {
    setActive((current) => current ?? { job, origin });
  }, []);

  // Runs after the close animation. Restore focus to the job's grid card (or the section heading if it was filtered out).
  const handleExit = useCallback(() => {
    setActive((current) => {
      const id = current?.job.id;
      requestAnimationFrame(() => {
        const card = id ? document.querySelector<HTMLElement>(`.job-card[data-job-id="${id}"]`) : null;
        (card ?? document.getElementById('roles-title'))?.focus({ preventScroll: true });
      });
      return null;
    });
  }, []);

  const isOpen = active !== null;

  return (
    <>
      <a className="skip-link" href="#roles">
        Skip to open roles
      </a>
      {/* Everything behind the dialog is inert while it is open: no tabbing, no clicks, hidden from AT. */}
      <div id="app" inert={isOpen ? true : undefined}>
        <SiteHeader />
        <main id="main">
          <Hero onOpen={openJob} />
          <JobBoard onOpen={openJob} />

          <section id="about" className="plain-section" aria-labelledby="about-title">
            <div className="plain-section__inner">
              <h2 id="about-title">About this board</h2>
              <p>
                Clippings is a demo job board. The companies, roles and details are fictional samples. The
                point is to show how a listing can be read, sorted and applied to in an editorial layout.
              </p>
              <p>
                No salary figures are shown because none were supplied. Each role lists only what the sample
                data includes.
              </p>
            </div>
          </section>

          <section id="contact" className="plain-section plain-section--alt" aria-labelledby="contact-title">
            <div className="plain-section__inner">
              <h2 id="contact-title">Contact</h2>
              <p>
                This demo has no inbox. Replace this paragraph with your team’s contact route before publishing.
              </p>
            </div>
          </section>
        </main>
        <footer className="site-footer">
          <p>Clippings · demo job board · sample roles only</p>
        </footer>
      </div>

      {active && (
        <JobDialog key={active.job.id} job={active.job} origin={active.origin} onExit={handleExit} />
      )}
    </>
  );
}
