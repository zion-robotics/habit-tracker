import type { User, Session } from '@/types/auth';
import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage';

export function signUp(email: string, password: string): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return { success: false, error: 'User already exists' };
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);

  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);

  return { success: true, session };
}

export function logIn(email: string, password: string): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);

  return { success: true, session };
}

export function logOut(): void {
  clearSession();
}

export function getCurrentSession(): Session | null {
  return getSession();
}
