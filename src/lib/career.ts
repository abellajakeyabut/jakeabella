// Date helpers for career facts. Dates are 'YYYY-MM' strings. Durations count months
// inclusively, the way LinkedIn does (Jul 2008 – Jul 2009 is "1 yr 1 mo").

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthIndex(ym: string) {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
}

function currentMonthIndex(now: Date) {
  return now.getUTCFullYear() * 12 + now.getUTCMonth();
}

function formatMonth(ym: string) {
  const i = monthIndex(ym);
  return `${MONTHS[i % 12]} ${Math.floor(i / 12)}`;
}

/** "Jul 2008 – Jul 2009", or "Mar 2022 – Present" when there's no end. */
export function formatPeriod(start: string, end?: string) {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}

/** "1 yr 1 mo", "5 yrs 3 mos", "11 mos". A missing end means "up to now". */
export function formatDuration(start: string, end: string | undefined, now: Date) {
  const last = end ? monthIndex(end) : currentMonthIndex(now);
  const total = last - monthIndex(start) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months || !years) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}

/** Whole years elapsed since `start`. */
export function yearsSince(start: string, now: Date) {
  return Math.floor((currentMonthIndex(now) - monthIndex(start)) / 12);
}

/** Replaces `{key}` tokens in `text` with the matching value; unknown tokens are left as-is. */
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (token, key: string) => (key in values ? String(values[key]) : token));
}
