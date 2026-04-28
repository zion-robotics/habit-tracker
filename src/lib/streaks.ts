export function calculateCurrentStreak(completions: string[], today?: string): number {
  const todayStr = today ?? new Date().toISOString().split('T')[0];

  // Remove duplicates and sort
  const unique = [...new Set(completions)].sort();

  if (unique.length === 0) return 0;

  // Determine starting point for counting
  let current: string;
  
  if (!unique.includes(todayStr)) {
    // Today not completed, check yesterday
    const date = new Date(todayStr + 'T00:00:00Z');
    date.setUTCDate(date.getUTCDate() - 1);
    const yesterdayStr = date.toISOString().split('T')[0];
    
    if (!unique.includes(yesterdayStr)) return 0;
    current = yesterdayStr;
  } else {
    current = todayStr;
  }

  // Count consecutive days backwards from today
  let streak = 0;

  while (unique.includes(current)) {
    streak++;
    // Go back one day
    const date = new Date(current + 'T00:00:00Z');
    date.setUTCDate(date.getUTCDate() - 1);
    current = date.toISOString().split('T')[0];
  }

  return streak;
}
