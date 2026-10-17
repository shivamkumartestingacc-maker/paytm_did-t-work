export type ApplicationValues = {
  name: string;
  email: string;
  portfolio: string;
  resumeLink: string;
  note: string;
};

export type ApplicationErrors = Partial<Record<keyof ApplicationValues, string>>;

export const emptyValues: ApplicationValues = {
  name: '',
  email: '',
  portfolio: '',
  resumeLink: '',
  note: '',
};

export const NOTE_MAX = 500;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateApplication(values: ApplicationValues): ApplicationErrors {
  const errors: ApplicationErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const portfolio = values.portfolio.trim();
  const resume = values.resumeLink.trim();

  if (name.length < 2) errors.name = 'Enter your full name (at least 2 characters).';
  if (!email) errors.email = 'Enter an email address.';
  else if (!EMAIL.test(email)) errors.email = 'Enter an email in the form name@example.com.';

  if (portfolio && !isHttpUrl(portfolio)) {
    errors.portfolio = 'Enter a full link starting with https://, or leave this blank.';
  }

  if (!resume) errors.resumeLink = 'Add a link to your resume (Google Drive, Dropbox, or a personal site).';
  else if (!isHttpUrl(resume)) errors.resumeLink = 'Resume link must start with https://.';

  if (values.note.length > NOTE_MAX) errors.note = `Keep the note under ${NOTE_MAX} characters.`;

  return errors;
}
