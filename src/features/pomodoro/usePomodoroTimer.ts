import type { PomodoroMode, PomodoroState } from 'src/types/task';

import { useEffect, useMemo, useState } from 'react';

const modeToMs = (pomodoro: PomodoroState, mode: PomodoroMode) => {
  const minutes =
    mode === 'work'
      ? pomodoro.workMinutes
      : mode === 'short_break'
        ? pomodoro.shortBreakMinutes
        : pomodoro.longBreakMinutes;

  return minutes * 60 * 1000;
};

export function getNextMode(mode: PomodoroMode, sessionsCompleted: number): PomodoroMode {
  if (mode !== 'work') {
    return 'work';
  }

  return sessionsCompleted > 0 && sessionsCompleted % 4 === 0 ? 'long_break' : 'short_break';
}

export function calculateRemainingMs(pomodoro: PomodoroState, now = Date.now()) {
  if (!pomodoro.endsAt) {
    return modeToMs(pomodoro, pomodoro.mode);
  }

  return Math.max(new Date(pomodoro.endsAt).getTime() - now, 0);
}

export function usePomodoroTimer(pomodoro: PomodoroState) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!pomodoro.isRunning) {
      return;
    }

    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [pomodoro.isRunning]);

  const remainingMs = useMemo(() => calculateRemainingMs(pomodoro, now), [now, pomodoro]);

  return {
    remainingMs,
    isCompleted: pomodoro.isRunning && remainingMs <= 0,
  };
}
