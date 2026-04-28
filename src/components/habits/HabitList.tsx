'use client';

import { useState, useEffect } from 'react';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { getUserHabits, createHabit, updateHabit, deleteHabit, toggleCompletion } from '@/lib/habits';
import type { Habit } from '@/types/habit';

interface HabitListProps {
  userId: string;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export default function HabitList({ userId }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = getToday();

  useEffect(() => {
    setHabits(getUserHabits(userId));
  }, [userId]);

  const handleCreate = (name: string, description: string) => {
    createHabit(userId, name, description);
    setHabits(getUserHabits(userId));
    setShowForm(false);
  };

  const handleUpdate = (name: string, description: string) => {
    if (!editingHabit) return;
    updateHabit(editingHabit.id, { name, description });
    setHabits(getUserHabits(userId));
    setEditingHabit(null);
  };

  const handleDelete = (habitId: string) => {
    deleteHabit(habitId);
    setHabits(getUserHabits(userId));
  };

  const handleToggle = (habitId: string) => {
    toggleCompletion(habitId, today);
    setHabits(getUserHabits(userId));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Habits</h2>
        {!showForm && !editingHabit && (
          <button
            data-testid="create-habit-button"
            onClick={() => setShowForm(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            + New habit
          </button>
        )}
      </div>

      {(showForm || editingHabit) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            {editingHabit ? 'Edit habit' : 'New habit'}
          </h3>
          <HabitForm
            habit={editingHabit ?? undefined}
            onSubmit={editingHabit ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingHabit(null); }}
          />
        </div>
      )}

      {habits.length === 0 && !showForm ? (
        <div
          data-testid="empty-state"
          className="text-center py-16 text-gray-400"
        >
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-lg font-medium text-gray-500">No habits yet</p>
          <p className="text-sm mt-1">Click &ldquo;+ New habit&rdquo; to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onToggleComplete={handleToggle}
              onEdit={setEditingHabit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
