import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { CreateTaskInput, Task, UpdateTaskInput } from 'src/types/task';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from 'src/api/tasksApi';

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

type UpdateTaskVariables = {
  id: string;
  patch: UpdateTaskInput;
};

export function useTasks(): UseQueryResult<Task[], Error> {
  return useQuery<Task[], Error>({
    queryKey: taskKeys.all,
    queryFn: tasksApi.list,
  });
}

export function useTask(id: string): UseQueryResult<Task, Error> {
  return useQuery<Task, Error>({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateTask(): UseMutationResult<Task, Error, CreateTaskInput> {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: (input: CreateTaskInput) => tasksApi.create(input),
    onSuccess: (createdTask: Task) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (current: Task[] | undefined) => [
        createdTask,
        ...(current ?? []),
      ]);
      queryClient.setQueryData<Task>(taskKeys.detail(createdTask.id), createdTask);
    },
  });
}

export function useUpdateTask(): UseMutationResult<Task, Error, UpdateTaskVariables> {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskVariables>({
    mutationFn: ({ id, patch }: UpdateTaskVariables) => tasksApi.update(id, patch),
    onSuccess: (updatedTask: Task) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (current: Task[] | undefined) =>
        (current ?? []).map((task: Task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      queryClient.setQueryData<Task>(taskKeys.detail(updatedTask.id), updatedTask);
    },
  });
}

export function useDeleteTask(): UseMutationResult<{ ok: true }, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, string>({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: (_result: { ok: true }, id: string) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (current: Task[] | undefined) =>
        (current ?? []).filter((task: Task) => task.id !== id)
      );
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}
