import { subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type {
  PomodoroSession,
  ProductivitySnapshot,
  ProductivityStore,
  Task,
  TaskStatus,
  UserSettings,
} from '../types/domain';

const STORE_KEY = 'pomodoro-enterprise-store';

const defaultSettings: UserSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

const seedTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Prepare product launch briefing',
    description: 'Finalize GTM strategy and align with sales + success teams.',
    estimateMinutes: 120,
    tags: ['strategy', 'launch'],
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Deep work: architecture refactor',
    description: 'Break legacy timer logic into composable domain services.',
    estimateMinutes: 180,
    tags: ['engineering'],
    status: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedSessions = Array.from({ length: 8 }).map((_, index): PomodoroSession => ({
  id: uuidv4(),
  taskId: seedTasks[index % seedTasks.length].id,
  durationMinutes: 25,
  startedAt: subDays(new Date(), index).toISOString(),
  completedAt: subDays(new Date(), index).toISOString(),
  focusScore: 70 + (index % 3) * 10,
}));

const fallbackStore: ProductivityStore = {
  tasks: seedTasks,
  sessions: seedSessions,
  settings: defaultSettings,
};

const safeParseStore = (raw: string | null): ProductivityStore => {
  if (!raw) {
    return fallbackStore;
  }

  try {
    const parsed = JSON.parse(raw) as ProductivityStore;
    return {
      tasks: parsed.tasks ?? [],
      sessions: parsed.sessions ?? [],
      settings: parsed.settings ?? defaultSettings,
    };
  } catch {
    return fallbackStore;
  }
};

const getStore = (): ProductivityStore => safeParseStore(localStorage.getItem(STORE_KEY));

const setStore = (store: ProductivityStore): void => {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
};

export const repository = {
  getTasks: async (): Promise<Task[]> => getStore().tasks,

  addTask: async (payload: {
    title: string;
    description?: string;
    estimateMinutes: number;
    tags: string[];
  }): Promise<Task> => {
    const store = getStore();
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: payload.title,
      description: payload.description,
      estimateMinutes: payload.estimateMinutes,
      tags: payload.tags,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    };

    store.tasks = [task, ...store.tasks];
    setStore(store);
    return task;
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task[]> => {
    const store = getStore();
    store.tasks = store.tasks.map((task) =>
      task.id === taskId ? { ...task, status, updatedAt: new Date().toISOString() } : task,
    );
    setStore(store);
    return store.tasks;
  },

  getSessions: async (): Promise<PomodoroSession[]> => getStore().sessions,

  addSession: async (payload: {
    taskId: string;
    durationMinutes: number;
    focusScore: number;
  }): Promise<PomodoroSession> => {
    const store = getStore();
    const now = new Date().toISOString();
    const session: PomodoroSession = {
      id: uuidv4(),
      taskId: payload.taskId,
      durationMinutes: payload.durationMinutes,
      startedAt: now,
      completedAt: now,
      focusScore: payload.focusScore,
    };

    store.sessions = [session, ...store.sessions];
    setStore(store);
    return session;
  },

  getSettings: async (): Promise<UserSettings> => getStore().settings,

  updateSettings: async (settings: UserSettings): Promise<UserSettings> => {
    const store = getStore();
    store.settings = settings;
    setStore(store);
    return settings;
  },

  getDashboard: async (): Promise<ProductivitySnapshot> => {
    const store = getStore();
    const sessionsByDayMap = new Map<string, { date: string; sessions: number; minutes: number }>();

    store.sessions.forEach((session) => {
      const date = session.completedAt.slice(0, 10);
      const existing = sessionsByDayMap.get(date) ?? { date, sessions: 0, minutes: 0 };
      existing.sessions += 1;
      existing.minutes += session.durationMinutes;
      sessionsByDayMap.set(date, existing);
    });

    const taskStatusBreakdown = ['todo', 'in_progress', 'done'].map((status) => ({
      status,
      count: store.tasks.filter((task) => task.status === status).length,
    }));

    const taskLookup = new Map(store.tasks.map((task) => [task.id, task.title]));
    const minutesByTask = new Map<string, number>();

    store.sessions.forEach((session) => {
      const taskName = taskLookup.get(session.taskId) ?? 'Unknown task';
      minutesByTask.set(taskName, (minutesByTask.get(taskName) ?? 0) + session.durationMinutes);
    });

    const topTasksByFocusTime = Array.from(minutesByTask.entries())
      .map(([task, minutes]) => ({ task, minutes }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);

    return {
      sessionsByDay: Array.from(sessionsByDayMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
      taskStatusBreakdown,
      topTasksByFocusTime,
    };
  },
};
