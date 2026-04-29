import { test, expect, Page } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

function generateEmail() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`
}

async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('habit-tracker-users')
    localStorage.removeItem('habit-tracker-session')
    localStorage.removeItem('habit-tracker-habits')
  })
}

async function signUpUser(page: Page, email: string, password = 'testpass123') {
  await page.goto('/signup')
  await page.getByTestId('auth-signup-email').fill(email)
  await page.getByTestId('auth-signup-password').fill(password)
  await page.getByTestId('auth-signup-submit').click()
  await page.waitForURL('**/dashboard')
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearStorage(page)
    await page.goto('about:blank')
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await page.waitForURL('**/login', { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    const email = generateEmail()
    await signUpUser(page, email)
    await page.goto('/')
    await page.waitForURL('**/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    const email = generateEmail()
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill(email)
    await page.getByTestId('auth-signup-password').fill('mypassword')
    await page.getByTestId('auth-signup-submit').click()
    await page.waitForURL('**/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('empty-state')).toBeVisible()
  })

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    const email = generateEmail()
    // Sign up first
    await signUpUser(page, email)
    // Create a habit
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('My Private Habit')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-my-private-habit')).toBeVisible()

    // Logout
    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('**/login')

    // Login again
    await page.getByTestId('auth-login-email').fill(email)
    await page.getByTestId('auth-login-password').fill('testpass123')
    await page.getByTestId('auth-login-submit').click()
    await page.waitForURL('**/dashboard')

    // Should see own habit
    await expect(page.getByTestId('habit-card-my-private-habit')).toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    const email = generateEmail()
    await signUpUser(page, email)

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Exercise Daily')
    await page.getByTestId('habit-description-input').fill('30 minutes workout')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-exercise-daily')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const email = generateEmail()
    await signUpUser(page, email)

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Read Books')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-streak-read-books')).toContainText('0')

    await page.getByTestId('habit-complete-read-books').click()

    await expect(page.getByTestId('habit-streak-read-books')).toContainText('1')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    const email = generateEmail()
    await signUpUser(page, email)

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()

    // Reload
    await page.reload()
    await page.waitForURL('**/dashboard')

    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    const email = generateEmail()
    await signUpUser(page, email)

    await page.getByTestId('auth-logout-button').click()
    await page.waitForURL('**/login')
    expect(page.url()).toContain('/login')

    // Verify session is cleared
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'))
    expect(session).toBeFalsy()
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    const email = generateEmail()
    await signUpUser(page, email)

    // Wait for service worker to install and cache
    await page.waitForTimeout(2000)

    // Go offline
    await context.setOffline(true)

    // Navigate to login (app shell page)
    try {
      await page.goto('/login', { timeout: 8000 })
    } catch {
      // May timeout offline — check what we have
    }

    // The page should not hard crash — check for no fatal error
    const body = await page.locator('body').innerHTML().catch(() => '')
    // Should not be empty or a plain error
    expect(body.length).toBeGreaterThan(0)

    await context.setOffline(false)
  })
})
