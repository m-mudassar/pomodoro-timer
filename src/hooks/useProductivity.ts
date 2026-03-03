import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { repository } from '../lib/storage';
import type { TaskStatus, UserSettings } from '../types/domain';

export const QUERY_KEYS = {
  tasks: ['tasks'],
  sessions: ['sessions'],
  settings: ['settings'],
  dashboard: ['dashboard'],
} as const;

export const useTasks = () => useQuery({ queryKey: QUERY_KEYS.tasks, queryFn: repository.getTasks });

export const useSessions = () =>
  useQuery({ queryKey: QUERY_KEYS.sessions, queryFn: repository.getSessions });

export const useSettings = () =>
  useQuery({ queryKey: QUERY_KEYS.settings, queryFn: repository.getSettings });

export const useDashboard = () =>
  useQuery({ queryKey: QUERY_KEYS.dashboard, queryFn: repository.getDashboard });

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard }),
    ]);

  return {
    addTask: useMutation({
      mutationFn: repository.addTask,
      onSuccess: invalidateAll,
    }),
    updateTaskStatus: useMutation({
      mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
        repository.updateTaskStatus(taskId, status),
      onSuccess: invalidateAll,
    }),
  };
};

export const useSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repository.addSession,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sessions }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard }),
      ]),
  });
};

export const useSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: UserSettings) => repository.updateSettings(settings),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings }),
  });
};
