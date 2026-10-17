export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type Job = {
  id: string;
  title: string;
  company: string;
  /** Short text used for the company's typographic mark (original, fictional). */
  companyMark: string;
  /** City or 'Remote' — used for the location filter. */
  region: 'Bengaluru' | 'Mumbai' | 'Remote';
  /** Human-readable location line. */
  location: string;
  workMode: WorkMode;
  employmentType: string;
  /** ISO date (YYYY-MM-DD) the posting went live. */
  postedAt: string;
  category: 'Design' | 'Engineering' | 'Product' | 'Research' | 'Content';
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  /** Only set when a real figure is supplied. Sample data omits it. */
  compensation?: string;
};
