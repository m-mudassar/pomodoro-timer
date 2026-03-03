export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimateMinutes: number;
  tags: string[];
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  durationMinutes: number;
  startedAt: string;
  completedAt: string;
  focusScore: number;
}

export interface UserSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
}

export interface ProductivitySnapshot {
  sessionsByDay: Array<{ date: string; sessions: number; minutes: number }>;
  taskStatusBreakdown: Array<{ status: string; count: number }>;
  topTasksByFocusTime: Array<{ task: string; minutes: number }>;
}

export interface ProductivityStore {
  tasks: Task[];
  sessions: PomodoroSession[];
  settings: UserSettings;
}
