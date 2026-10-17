import type { Job } from '../types';
import type { ApplicationValues } from './validation';

export type SubmitResult =
  | { mode: 'live'; message: string }
  | { mode: 'demo'; message: string };

/**
 * Where a real employer would receive applications.
 * Set VITE_APPLICATION_ENDPOINT in a .env file (for example to a serverless
 * function or form-processing service you control). When it is unset, the
 * form runs in clearly labelled demo mode and nothing leaves the browser.
 */
const ENDPOINT = import.meta.env.VITE_APPLICATION_ENDPOINT as string | undefined;

export async function submitApplication(job: Job, values: ApplicationValues): Promise<SubmitResult> {
  if (!ENDPOINT) {
    // Demo mode: simulate latency so the submitting state is visible. No network call.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      mode: 'demo',
      message:
        'Demo only. Nothing was sent to ' +
        job.company +
        '. Connect VITE_APPLICATION_ENDPOINT to deliver applications.',
    };
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      name: values.name.trim(),
      email: values.email.trim(),
      portfolio: values.portfolio.trim() || null,
      resumeLink: values.resumeLink.trim(),
      note: values.note.trim() || null,
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}.`);
  }
  return { mode: 'live', message: `Your application for ${job.title} was sent to ${job.company}.` };
}
