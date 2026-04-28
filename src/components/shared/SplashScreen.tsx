'use client';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700"
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🔥</div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Habit Tracker</h1>
        <p className="mt-3 text-violet-200 text-lg">Build streaks. Build yourself.</p>
        <div className="mt-8 flex justify-center gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-violet-300 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
