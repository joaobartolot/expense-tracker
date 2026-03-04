export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateLabel(input) {
  const d = new Date(`${input}T00:00:00`);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const dayKey = (date) => date.toISOString().slice(0, 10);
  if (dayKey(d) === dayKey(today)) return 'Today';
  if (dayKey(d) === dayKey(yesterday)) return 'Yesterday';

  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export function shiftDate(date, interval) {
  const d = new Date(`${date}T00:00:00`);
  if (interval === 'weekly') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}
