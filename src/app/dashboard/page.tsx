'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import { getCurrentSession, logOut } from '@/lib/auth';
import type { Session } from '@/types/auth';

function DashboardContent() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = getCurrentSession();
    setSession(s);
  }, []);

  const handleLogout = () => {
    logOut();
    router.push('/login');
  };

  if (!session) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-gray-900 text-lg">Habit Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[150px]">
              {session.email}
            </span>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-xl mx-auto px-4 py-6">
        <HabitList userId={session.userId} />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
