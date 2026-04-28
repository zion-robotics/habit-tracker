# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits and building streaks. Built with Next.js App Router, React, TypeScript, Tailwind CSS, and localStorage for persistence.

---

## Project Overview

Users can:
- Sign up and log in with email + password
- Create, edit, and delete habits
- Mark habits complete for today (toggleable)
- View a live current streak per habit
- Reload and retain all saved state
- Install the app as a PWA
- Use the cached app shell offline

---

## Setup Instructions

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone <your-repo-url>
cd habit-tracker

# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install chromium
```

---

## Run Instructions

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

```bash
# Build for production
npm run build
npm run start
```

---

## Test Instructions

```bash
# Unit tests + coverage report
npm run test:unit

# Integration / component tests
npm run test:integration

# End-to-end tests (requires dev server running or will auto-start)
npm run test:e2e

# Run all tests
npm run test
```

Coverage report is generated in the `coverage/` folder after running `test:unit`. Minimum threshold is 80% line coverage for `src/lib/`.

---

## Local Persistence Structure

All data is stored in `localStorage` under three keys:

| Key | Shape | Description |
|-----|-------|-------------|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | Currently logged-in session |
| `habit-tracker-habits` | `Habit[]` | All habits across all users |

**User shape:**
```json
{ "id": "uuid", "email": "user@example.com", "password": "plain", "createdAt": "ISO string" }
```

**Session shape:**
```json
{ "userId": "uuid", "email": "user@example.com" }
```

**Habit shape:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Drink Water",
  "description": "Stay hydrated",
  "frequency": "daily",
  "createdAt": "ISO string",
  "completions": ["2024-06-15", "2024-06-14"]
}
```

The dashboard filters habits by `userId` matching the active session, so each user only sees their own habits.

---

## PWA Implementation

- **`public/manifest.json`** — defines app name, icons, start URL, display mode, and theme colors
- **`public/sw.js`** — service worker that caches the app shell on install and serves cached responses when offline
- **Service worker registration** — done client-side in `src/app/layout.tsx` via an inline script on `load`
- **Offline behavior** — after first load, the app shell (routes `/`, `/login`, `/signup`, `/dashboard`) is cached and renders without a network connection

---

## Trade-offs and Limitations

- **Plain-text passwords** — passwords are stored as plain text in localStorage. Acceptable for a local-only demo; not for production.
- **No real authentication** — sessions are stored client-side with no expiry or signing. Any user can manipulate localStorage.
- **Single-device only** — localStorage is per-browser. No sync across devices.
- **Daily frequency only** — the spec requires only `'daily'` frequency; other frequencies are not implemented.
- **No pagination** — all habits render in a single list. Fine for personal use.

---

## Test File Map

| Test File | What It Verifies |
|-----------|-----------------|
| `tests/unit/slug.test.ts` | `getHabitSlug()` — lowercase, hyphenation, trimming, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName()` — empty input, length limit, trimmed valid output |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak()` — empty list, today not completed, consecutive days, duplicates, broken streaks |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion()` — add date, remove date, no mutation, no duplicates |
| `tests/integration/auth-flow.test.tsx` | Signup flow, duplicate email error, login flow, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | Validation error, create habit, edit with immutable fields preserved, delete with confirmation, streak update on toggle |
| `tests/e2e/app.spec.ts` | Full user journeys: splash screen, auth redirects, signup, login, create habit, complete habit, reload persistence, logout, offline shell |
