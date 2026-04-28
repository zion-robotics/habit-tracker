'use client';

import { useState } from 'react';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import type { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggleComplete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({ habit, today, onToggleComplete, onEdit, onDelete }: HabitCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl p-5 border-2 transition-all ${
        isCompleted
          ? 'border-violet-400 bg-violet-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-base truncate ${isCompleted ? 'text-violet-700' : 'text-gray-900'}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{habit.description}</p>
          )}
          <div
            data-testid={`habit-streak-${slug}`}
            className="mt-2 flex items-center gap-1 text-sm font-medium"
          >
            <span>🔥</span>
            <span className={streak > 0 ? 'text-orange-500' : 'text-gray-400'}>
              {streak} day{streak !== 1 ? 's' : ''} streak
            </span>
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit.id)}
          aria-label={isCompleted ? `Unmark ${habit.name} as complete` : `Mark ${habit.name} as complete`}
          className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            isCompleted
              ? 'bg-violet-500 border-violet-500 text-white'
              : 'border-gray-300 hover:border-violet-400'
          }`}
        >
          {isCompleted ? '✓' : ''}
        </button>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="flex-1 text-sm text-gray-600 hover:text-violet-600 font-medium py-1 rounded-lg hover:bg-violet-50 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          Edit
        </button>

        {!confirmDelete ? (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmDelete(true)}
            className="flex-1 text-sm text-gray-600 hover:text-red-600 font-medium py-1 rounded-lg hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        ) : (
          <div className="flex-1 flex gap-1">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white font-medium py-1 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 text-sm border border-gray-300 text-gray-600 font-medium py-1 rounded-lg hover:bg-gray-50 transition"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
