// utils/date.ts
const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const dateDisablers = {
  noFuture: (date: Date) => stripTime(date) > stripTime(new Date()),
  noPast: (date: Date) => stripTime(date) < stripTime(new Date()),
  onlyToday: (date: Date) => {
    const today = stripTime(new Date());
    return stripTime(date).getTime() !== today.getTime();
  },
};

export function parseLocalDate(dateStr: string) {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d); // local time midnight
}

export function formatLocalDate(date: Date) {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
}
