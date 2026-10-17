export function postingAge(isoDate: string, now: Date = new Date()): string {
  const posted = new Date(`${isoDate}T00:00:00`);
  const days = Math.max(0, Math.floor((now.getTime() - posted.getTime()) / 86_400_000));
  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'Posted 1 week ago' : `Posted ${weeks} weeks ago`;
}

export function shortAge(isoDate: string, now: Date = new Date()): string {
  return postingAge(isoDate, now).replace(/^Posted /, '');
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
