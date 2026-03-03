import type { Task, TaskStatus } from 'src/types/task';

import { useEffect, useMemo, useState } from 'react';

import { Alert, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';

import { useDeleteTask, useUpdateTask } from 'src/hooks/tasksHooks';

import { PomodoroPanel } from 'src/features/pomodoro/PomodoroPanel';

const statuses: TaskStatus[] = ['todo', 'doing', 'done'];

type Props = {
  task: Task;
  onDeleted: () => void;
};

export function TaskDetail({ task, onDeleted }: Props) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task.status);


  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
  }, [task.description, task.id, task.status, task.title]);

  const hasChanges = useMemo(
    () => title !== task.title || description !== (task.description ?? '') || status !== task.status,
    [description, status, task.description, task.status, task.title, title]
  );

  const onSave = async () => {
    if (!title.trim()) {
      return;
    }

    await updateTask.mutateAsync({
      id: task.id,
      patch: {
        title,
        description,
        status,
      },
    });
  };

  const onDelete = async () => {
    await deleteTask.mutateAsync(task.id);
    onDeleted();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Task detail</Typography>

      <TextField
        size="small"
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextField
        size="small"
        label="Description"
        multiline
        minRows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <TextField
        select
        size="small"
        label="Status"
        value={status}
        onChange={(event) => setStatus(event.target.value as TaskStatus)}
      >
        {statuses.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={onSave} disabled={!hasChanges || updateTask.isPending}>
          Save
        </Button>
        <Button color="error" variant="outlined" onClick={onDelete} disabled={deleteTask.isPending}>
          Delete
        </Button>
      </Stack>

      {(updateTask.isError || deleteTask.isError) && <Alert severity="error">Action failed</Alert>}

      <PomodoroPanel task={task} />
    </Stack>
  );
}
