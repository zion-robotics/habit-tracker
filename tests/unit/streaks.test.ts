/* MENTOR_TRACE_STAGE3_HABIT_A91 */
import { describe, it, expect } from 'vitest'
import { calculateCurrentStreak } from '@/lib/streaks'

const TODAY = '2024-06-15'
const YESTERDAY = '2024-06-14'
const TWO_DAYS_AGO = '2024-06-13'
const THREE_DAYS_AGO = '2024-06-12'

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0)
  })

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([YESTERDAY], TODAY)).toBe(0)
    expect(calculateCurrentStreak([YESTERDAY, TWO_DAYS_AGO], TODAY)).toBe(0)
  })

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak([TODAY], TODAY)).toBe(1)
    expect(calculateCurrentStreak([TODAY, YESTERDAY], TODAY)).toBe(2)
    expect(calculateCurrentStreak([TODAY, YESTERDAY, TWO_DAYS_AGO], TODAY)).toBe(3)
    expect(calculateCurrentStreak([TODAY, YESTERDAY, TWO_DAYS_AGO, THREE_DAYS_AGO], TODAY)).toBe(4)
  })

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak([TODAY, TODAY, TODAY], TODAY)).toBe(1)
    expect(calculateCurrentStreak([TODAY, TODAY, YESTERDAY, YESTERDAY], TODAY)).toBe(2)
  })

  it('breaks the streak when a calendar day is missing', () => {
    // today + two days ago (yesterday missing) => streak is 1
    expect(calculateCurrentStreak([TODAY, TWO_DAYS_AGO], TODAY)).toBe(1)
    // today + yesterday + three days ago (two days ago missing) => streak is 2
    expect(calculateCurrentStreak([TODAY, YESTERDAY, THREE_DAYS_AGO], TODAY)).toBe(2)
  })
})
