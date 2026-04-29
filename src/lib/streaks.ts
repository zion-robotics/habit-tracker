export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today ?? new Date().toISOString().split('T')[0];

  // Remove duplicates and sort
  const unique = Array.from(new Set(completions)).sort();

  if (unique.length === 0) return 0;

  // If today is not completed, streak is 0
  if (!unique.includes(todayStr)) return 0;

  // Count consecutive days backwards from today
  let streak = 0;
  let current = todayStr;

  while (unique.includes(current)) {
    streak++;
    const date = new Date(current + 'T00:00:00Z');
    date.setUTCDate(date.getUTCDate() - 1);
    current = date.toISOString().split('T')[0];
  }

  return streak;
}