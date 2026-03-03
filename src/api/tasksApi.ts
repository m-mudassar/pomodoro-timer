import type { CreateTaskInput, PomodoroState, Task, UpdateTaskInput } from 'src/types/task';

const STORAGE_KEY = 'tms.tasks.v1';
const NETWORK_DELAY_MS = 150;

const defaultPomodoro = (): PomodoroState => ({
  mode: 'work',
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsCompleted: 0,
  isRunning: false,
  endsAt: null,
  lastTickAt: null,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readTasks = (): Task[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const ensureTask = (task?: Task): Task => {
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};

const updateTimestamp = (task: Task): Task => ({
  ...task,
  updatedAt: new Date().toISOString(),
});

export const tasksApi = {
  async list(): Promise<Task[]> {
    await sleep(NETWORK_DELAY_MS);
    return readTasks().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string): Promise<Task> {
    await sleep(NETWORK_DELAY_MS);
    const task = readTasks().find((item) => item.id === id);
    return ensureTask(task);
  },

  async create(input: CreateTaskInput): Promise<Task> {
    await sleep(NETWORK_DELAY_MS);

    const now = new Date().toISOString();
    const nextTask: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim(),
      status: input.status ?? 'todo',
      createdAt: now,
      updatedAt: now,
      pomodoro: defaultPomodoro(),
    };

    const tasks = readTasks();
    writeTasks([nextTask, ...tasks]);

    return nextTask;
  },

  async update(id: string, patch: UpdateTaskInput): Promise<Task> {
    await sleep(NETWORK_DELAY_MS);

    const tasks = readTasks();
    const index = tasks.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error('Task not found');
    }

    const current = tasks[index];

    const updated = updateTimestamp({
      ...current,
      ...patch,
      description:
        patch.description !== undefined
          ? patch.description?.trim() || undefined
          : current.description,
      title: patch.title !== undefined ? patch.title.trim() : current.title,
      pomodoro: patch.pomodoro ? { ...current.pomodoro, ...patch.pomodoro } : current.pomodoro,
    });

    tasks[index] = updated;
    writeTasks(tasks);

    return updated;
  },

  async delete(id: string): Promise<{ ok: true }> {
    await sleep(NETWORK_DELAY_MS);
    const tasks = readTasks();
    writeTasks(tasks.filter((item) => item.id !== id));
    return { ok: true };
  },
};
