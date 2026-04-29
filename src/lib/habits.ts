import type { Habit } from '@/types/habit';
import { getHabits, saveHabits } from './storage';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...habit.completions];
  const index = completions.indexOf(date);

  if (index === -1) {
    completions.push(date);
  } else {
    completions.splice(index, 1);
  }

  // Ensure no duplicates
  const unique = Array.from(new Set(completions));

  return { ...habit, completions: unique };
}

export function getUserHabits(userId: string): Habit[] {
  return getHabits().filter(h => h.userId === userId);
}

export function createHabit(userId: string, name: string, description: string): Habit {
  const habit: Habit = {
    id: crypto.randomUUID(),
    userId,
    name,
    description,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };

  const all = getHabits();
  saveHabits([...all, habit]);
  return habit;
}

export function updateHabit(habitId: string, updates: { name: string; description: string }): Habit | null {
  const all = getHabits();
  const index = all.findIndex(h => h.id === habitId);
  if (index === -1) return null;

  const updated: Habit = {
    ...all[index],
    name: updates.name,
    description: updates.description,
  };

  const newAll = [...all];
  newAll[index] = updated;
  saveHabits(newAll);
  return updated;
}

export function deleteHabit(habitId: string): void {
  const all = getHabits();
  saveHabits(all.filter(h => h.id !== habitId));
}

export function toggleCompletion(habitId: string, date: string): Habit | null {
  const all = getHabits();
  const index = all.findIndex(h => h.id === habitId);
  if (index === -1) return null;

  const updated = toggleHabitCompletion(all[index], date);
  const newAll = [...all];
  newAll[index] = updated;
  saveHabits(newAll);
  return updated;
}
