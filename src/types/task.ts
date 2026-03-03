export type PomodoroMode = 'work' | 'short_break' | 'long_break';

export type TaskStatus = 'todo' | 'doing' | 'done';

export type PomodoroState = {
  mode: PomodoroMode;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsCompleted: number;
  isRunning: boolean;
  endsAt: string | null;
  lastTickAt: string | null;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  pomodoro: PomodoroState;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'description' | 'status' | 'pomodoro'>>;
