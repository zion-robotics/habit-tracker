import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock next/navigation
const mockPush = vi.fn()
const mockReplace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}))

import SignupForm from '@/components/auth/SignupForm'
import LoginForm from '@/components/auth/LoginForm'

beforeEach(() => {
  localStorage.clear()
  mockPush.mockReset()
  mockReplace.mockReset()
})

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null')
    expect(session).not.toBeNull()
    expect(session.email).toBe('test@example.com')
  })

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup()

    // First signup
    render(<SignupForm />)
    await user.type(screen.getByTestId('auth-signup-email'), 'dupe@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))

    // Second signup with same email
    const { unmount } = screen as unknown as { unmount: () => void }
    render(<SignupForm />)
    const emailInputs = screen.getAllByTestId('auth-signup-email')
    const passwordInputs = screen.getAllByTestId('auth-signup-password')
    const submitButtons = screen.getAllByTestId('auth-signup-submit')

    await user.type(emailInputs[emailInputs.length - 1], 'dupe@example.com')
    await user.type(passwordInputs[passwordInputs.length - 1], 'different')
    await user.click(submitButtons[submitButtons.length - 1])

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists')
    })
  })

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup()

    // Create user first
    const { signUp } = await import('@/lib/auth')
    signUp('login@example.com', 'secret')
    localStorage.removeItem('habit-tracker-session')

    render(<LoginForm />)
    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'secret')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') ?? 'null')
    expect(session).not.toBeNull()
    expect(session.email).toBe('login@example.com')
  })

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpass')
    await user.click(screen.getByTestId('auth-login-submit'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password')
    })
  })
})
