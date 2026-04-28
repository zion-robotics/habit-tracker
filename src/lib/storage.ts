import { STORAGE_KEYS } from './constants';
import type { User, Session } from '@/types/auth';
import type { Habit } from '@/types/habit';

function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function getUsers(): User[] {
  const raw = safeGetItem(STORAGE_KEYS.USERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  safeSetItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getSession(): Session | null {
  const raw = safeGetItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  safeSetItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  safeRemoveItem(STORAGE_KEYS.SESSION);
}

export function getHabits(): Habit[] {
  const raw = safeGetItem(STORAGE_KEYS.HABITS);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Habit[];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  safeSetItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}
