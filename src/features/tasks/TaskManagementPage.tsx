import type { TaskStatus } from 'src/types/task';

import { useMemo, useState } from 'react';

import { Alert, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material';

import { EmptyContent } from 'src/components/empty-content';
import { useTasks } from 'src/hooks/tasksHooks';

import { CreateTaskForm } from './CreateTaskForm';
import { TaskDetail } from './TaskDetail';
import { TaskList } from './TaskList';

export function TaskManagementPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const tasksQuery = useTasks();

  const filteredTasks = useMemo(() => {
    const tasks = tasksQuery.data ?? [];

    if (statusFilter === 'all') {
      return tasks;
    }

    return tasks.filter((task) => task.status === statusFilter);
  }, [statusFilter, tasksQuery.data]);

  const selectedTask = filteredTasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? null;

  return (
    <Stack spacing={2} p={3}>
      <Typography variant="h4">Task Management + Pomodoro</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <CreateTaskForm />
                {tasksQuery.isLoading && <CircularProgress size={24} />}
                {tasksQuery.isError && <Alert severity="error">Unable to load tasks.</Alert>}
                {tasksQuery.isSuccess && (
                  <TaskList
                    tasks={filteredTasks}
                    selectedTaskId={selectedTask?.id ?? null}
                    selectedStatus={statusFilter}
                    onSelectTask={setSelectedTaskId}
                    onSelectStatus={setStatusFilter}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ minHeight: 460 }}>
            <CardContent>
              {selectedTask ? (
                <TaskDetail
                  task={selectedTask}
                  onDeleted={() => {
                    setSelectedTaskId(null);
                  }}
                />
              ) : (
                <EmptyContent
                  filled
                  title="No task selected"
                  description="Create a task or adjust filters to continue."
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
