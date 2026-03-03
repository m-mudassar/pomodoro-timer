import type { PomodoroMode, PomodoroState, Task } from 'src/types/task';

import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Button,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { useUpdateTask } from 'src/hooks/tasksHooks';

import { calculateRemainingMs, getNextMode, usePomodoroTimer } from './usePomodoroTimer';

const PRESETS = {
  work: [15, 25, 30, 45, 50],
  short_break: [3, 5, 10],
  long_break: [10, 15, 20, 30],
} as const;

const LIMITS: Record<PomodoroMode, { min: number; max: number }> = {
  work: { min: 5, max: 120 },
  short_break: { min: 1, max: 60 },
  long_break: { min: 5, max: 90 },
};

const modeLabel: Record<PomodoroMode, string> = {
  work: 'Work',
  short_break: 'Short break',
  long_break: 'Long break',
};

const getModeMinutes = (pomodoro: PomodoroState, mode: PomodoroMode) => {
  if (mode === 'work') return pomodoro.workMinutes;
  if (mode === 'short_break') return pomodoro.shortBreakMinutes;
  return pomodoro.longBreakMinutes;
};

const formatRemaining = (remainingMs: number) => {
  const totalSeconds = Math.ceil(Math.max(remainingMs, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

type Props = {
  task: Task;
};

export function PomodoroPanel({ task }: Props) {
  const updateTask = useUpdateTask();
  const { pomodoro } = task;
  const { remainingMs, isCompleted } = usePomodoroTimer(pomodoro);

  const [customValue, setCustomValue] = useState('');
  const [durationError, setDurationError] = useState<string | null>(null);
  const [durationDirty, setDurationDirty] = useState(false);

  useEffect(() => {
    if (!isCompleted) return;

    const nextSessionsCompleted =
      pomodoro.mode === 'work' ? pomodoro.sessionsCompleted + 1 : pomodoro.sessionsCompleted;
    const nextMode = getNextMode(pomodoro.mode, nextSessionsCompleted);

    updateTask.mutate({
      id: task.id,
      patch: {
        pomodoro: {
          ...pomodoro,
          mode: nextMode,
          isRunning: false,
          endsAt: null,
          lastTickAt: new Date().toISOString(),
          sessionsCompleted: nextSessionsCompleted,
        },
      },
    });
  }, [isCompleted, pomodoro, task.id, updateTask]);

  const displayRemaining = useMemo(() => formatRemaining(remainingMs), [remainingMs]);

  const updatePomodoro = (nextPomodoro: PomodoroState) => {
    updateTask.mutate({ id: task.id, patch: { pomodoro: nextPomodoro } });
  };

  const setMode = (mode: PomodoroMode) => {
    const nextPomodoro = {
      ...pomodoro,
      mode,
      isRunning: false,
      endsAt: null,
      lastTickAt: new Date().toISOString(),
    };
    updatePomodoro(nextPomodoro);
  };

  const start = () => {
    if (pomodoro.isRunning) return;

    const durationMs = calculateRemainingMs(pomodoro);
    const now = Date.now();

    updatePomodoro({
      ...pomodoro,
      isRunning: true,
      endsAt: new Date(now + durationMs).toISOString(),
      lastTickAt: new Date(now).toISOString(),
    });
  };

  const pause = () => {
    if (!pomodoro.isRunning) return;

    const now = Date.now();
    const remaining = calculateRemainingMs(pomodoro, now);
    const nextPomodoro = {
      ...pomodoro,
      isRunning: false,
      endsAt: new Date(now + remaining).toISOString(),
      lastTickAt: new Date(now).toISOString(),
    };

    updatePomodoro(nextPomodoro);
  };

  const reset = () => {
    const now = Date.now();
    const modeDurationMs = getModeMinutes(pomodoro, pomodoro.mode) * 60 * 1000;

    updatePomodoro({
      ...pomodoro,
      endsAt: pomodoro.isRunning ? new Date(now + modeDurationMs).toISOString() : null,
      lastTickAt: new Date(now).toISOString(),
    });

    setDurationDirty(false);
  };

  const applyMinutes = (mode: PomodoroMode, value: number) => {
    const { min, max } = LIMITS[mode];

    if (!Number.isInteger(value)) {
      setDurationError('Only whole minutes are allowed.');
      return;
    }

    if (value < min || value > max) {
      setDurationError(`${modeLabel[mode]} must be between ${min} and ${max} minutes.`);
      return;
    }

    setDurationError(null);
    setDurationDirty(true);

    updatePomodoro({
      ...pomodoro,
      ...(mode === 'work'
        ? { workMinutes: value }
        : mode === 'short_break'
          ? { shortBreakMinutes: value }
          : { longBreakMinutes: value }),
      ...(pomodoro.isRunning ? {} : { endsAt: null }),
    });
  };

  const selectedMode = pomodoro.mode;

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Pomodoro</Typography>
      <Typography variant="body2" color="text.secondary">
        Mode: {modeLabel[selectedMode]} • Remaining: {displayRemaining}
      </Typography>
      <Typography variant="body2">Sessions completed: {pomodoro.sessionsCompleted}</Typography>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={start} disabled={pomodoro.isRunning || updateTask.isPending}>
          Start
        </Button>
        <Button variant="outlined" onClick={pause} disabled={!pomodoro.isRunning || updateTask.isPending}>
          Pause
        </Button>
        <Button variant="outlined" onClick={reset} disabled={updateTask.isPending || (!pomodoro.isRunning && !durationDirty)}>
          Reset session
        </Button>
      </Stack>

      <Tabs value={selectedMode} onChange={(_, value) => setMode(value)}>
        <Tab value="work" label="Work" />
        <Tab value="short_break" label="Short break" />
        <Tab value="long_break" label="Long break" />
      </Tabs>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {PRESETS[selectedMode].map((preset) => (
          <Chip
            key={preset}
            label={`${preset}m`}
            onClick={() => applyMinutes(selectedMode, preset)}
            color={preset === getModeMinutes(pomodoro, selectedMode) ? 'primary' : 'default'}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          size="small"
          label="Custom (minutes)"
          value={customValue}
          onChange={(event) => setCustomValue(event.target.value)}
        />
        <Button
          variant="outlined"
          onClick={() => {
            const value = Number(customValue);
            applyMinutes(selectedMode, value);
          }}
        >
          Apply
        </Button>
      </Stack>

      {durationError && <Alert severity="error">{durationError}</Alert>}
      <Divider />
      <Typography variant="caption" color="text.secondary">
        Work {pomodoro.workMinutes}m • Short break {pomodoro.shortBreakMinutes}m • Long break{' '}
        {pomodoro.longBreakMinutes}m
      </Typography>
    </Stack>
  );
}
