## Pomodoro Task Management System

A React + TypeScript (Vite) task manager with a Pomodoro timer per task.

### Run

```sh
npm install
npm run dev
```

### Build

```sh
npm run build
```

## Architecture

- UI is built from feature modules under `src/features/tasks` and `src/features/pomodoro`.
- Data reads/writes are done through TanStack React Query hooks in `src/hooks/tasksHooks.ts`.
- The UI never reads/writes `localStorage` directly.
- Storage is abstracted in `src/api/tasksApi.ts` with async endpoint-like methods:
  - `tasksApi.list()`
  - `tasksApi.get(id)`
  - `tasksApi.create(input)`
  - `tasksApi.update(id, patch)`
  - `tasksApi.delete(id)`

## Swapping LocalStorage for a real backend

Only replace the internals of `src/api/tasksApi.ts`.

As long as these method signatures and return types remain the same, no UI or hook changes are needed because all components consume data through `useTasks`, `useTask`, `useCreateTask`, `useUpdateTask`, and `useDeleteTask`.

Typical migration path:

1. Keep exported function signatures unchanged.
2. Replace localStorage read/write with `fetch('/api/tasks')` (or your API client).
3. Preserve returned `Task` shape and error semantics.
4. Keep React Query hooks untouched.
