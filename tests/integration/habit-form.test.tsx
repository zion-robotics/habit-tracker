import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

import HabitList from '@/components/habits/HabitList'
import { signUp } from '@/lib/auth'
import { createHabit } from '@/lib/habits'

const TEST_USER_ID = 'test-user-123'

beforeEach(() => {
  localStorage.clear()
})

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup()
    render(<HabitList userId={TEST_USER_ID} />)

    await user.click(screen.getByTestId('create-habit-button'))
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required')
    })
  })

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup()
    render(<HabitList userId={TEST_USER_ID} />)

    await user.click(screen.getByTestId('create-habit-button'))
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup()

    const habit = createHabit(TEST_USER_ID, 'Read Books', 'Original desc')
    render(<HabitList userId={TEST_USER_ID} />)

    // Click edit
    await waitFor(() => screen.getByTestId('habit-edit-read-books'))
    await user.click(screen.getByTestId('habit-edit-read-books'))

    // Update the name
    const nameInput = screen.getByTestId('habit-name-input')
    await user.clear(nameInput)
    await user.type(nameInput, 'Read More Books')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-read-more-books')).toBeInTheDocument()
    })

    // Verify immutable fields preserved in localStorage
    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') ?? '[]')
    const updated = habits.find((h: { id: string }) => h.id === habit.id)
    expect(updated).toBeDefined()
    expect(updated.id).toBe(habit.id)
    expect(updated.userId).toBe(TEST_USER_ID)
    expect(updated.createdAt).toBe(habit.createdAt)
    expect(updated.completions).toEqual(habit.completions)
  })

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup()

    createHabit(TEST_USER_ID, 'Exercise', 'Daily workout')
    render(<HabitList userId={TEST_USER_ID} />)

    await waitFor(() => screen.getByTestId('habit-card-exercise'))

    // Click delete — should show confirm button
    await user.click(screen.getByTestId('habit-delete-exercise'))
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    // Habit should still be there before confirm
    expect(screen.getByTestId('habit-card-exercise')).toBeInTheDocument()

    // Confirm delete
    await user.click(screen.getByTestId('confirm-delete-button'))

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-exercise')).not.toBeInTheDocument()
    })
  })

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup()

    createHabit(TEST_USER_ID, 'Meditate', '')
    render(<HabitList userId={TEST_USER_ID} />)

    await waitFor(() => screen.getByTestId('habit-streak-meditate'))

    // Initial streak should be 0
    expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('0')

    // Toggle complete
    await user.click(screen.getByTestId('habit-complete-meditate'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('1')
    })

    // Toggle off
    await user.click(screen.getByTestId('habit-complete-meditate'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('0')
    })
  })
})
