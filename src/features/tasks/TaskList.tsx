import type { Task, TaskStatus } from 'src/types/task';

import { Chip, List, ListItemButton, Stack, Typography } from '@mui/material';

const statusOptions: Array<{ label: string; value: TaskStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Todo', value: 'todo' },
  { label: 'Doing', value: 'doing' },
  { label: 'Done', value: 'done' },
];

type Props = {
  tasks: Task[];
  selectedTaskId: string | null;
  selectedStatus: TaskStatus | 'all';
  onSelectTask: (id: string) => void;
  onSelectStatus: (status: TaskStatus | 'all') => void;
};

export function TaskList({
  tasks,
  selectedTaskId,
  selectedStatus,
  onSelectTask,
  onSelectStatus,
}: Props) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {statusOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            color={selectedStatus === option.value ? 'primary' : 'default'}
            onClick={() => onSelectStatus(option.value)}
          />
        ))}
      </Stack>

      <List dense sx={{ p: 0 }}>
        {tasks.map((task) => (
          <ListItemButton
            key={task.id}
            selected={task.id === selectedTaskId}
            onClick={() => onSelectTask(task.id)}
            sx={{ borderRadius: 1, mb: 0.5 }}
          >
            <Stack width="100%" spacing={0.5}>
              <Typography variant="subtitle2">{task.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {task.status} • sessions {task.pomodoro.sessionsCompleted}
              </Typography>
            </Stack>
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );
}
