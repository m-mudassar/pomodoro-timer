import { useState } from 'react';

import { Alert, Button, Stack, TextField } from '@mui/material';

import { useCreateTask } from 'src/hooks/tasksHooks';

export function CreateTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createTask = useCreateTask();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError('Title is required.');
      return;
    }

    setError(null);

    await createTask.mutateAsync({ title: trimmed, description });
    setTitle('');
    setDescription('');
  };

  return (
    <Stack component="form" spacing={1.5} onSubmit={onSubmit}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Title"
        size="small"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextField
        label="Description"
        size="small"
        multiline
        minRows={2}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button type="submit" variant="contained" disabled={createTask.isPending}>
        Add Task
      </Button>
    </Stack>
  );
}
