import type { CreateTaskInput, Task, UpdateTaskInput } from 'src/types/task';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from 'src/api/tasksApi';

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: tasksApi.list,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: (createdTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (current = []) => [createdTask, ...current]);
      queryClient.setQueryData(taskKeys.detail(createdTask.id), createdTask);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateTaskInput }) => tasksApi.update(id, patch),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (current = []) =>
        current.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (current = []) =>
        current.filter((task) => task.id !== id)
      );
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}
