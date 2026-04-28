'use client';

import { useState } from 'react';
import { validateHabitName } from '@/lib/validators';
import type { Habit } from '@/types/habit';

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (name: string, description: string) => void;
  onCancel: () => void;
}

export default function HabitForm({ habit, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '');
  const [description, setDescription] = useState(habit?.description ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }
    setNameError(null);
    onSubmit(validation.value, description.trim());
  };

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={e => { setName(e.target.value); setNameError(null); }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="e.g. Drink Water"
          maxLength={80}
        />
        {nameError && (
          <p role="alert" className="text-red-500 text-xs mt-1">{nameError}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          rows={3}
          placeholder="Optional description…"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition"
        >
          {habit ? 'Save changes' : 'Create habit'}
        </button>
      </div>
    </form>
  );
}
