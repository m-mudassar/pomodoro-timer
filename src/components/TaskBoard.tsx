import { Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { Task, TaskStatus } from '../types/domain';

const statusOptions: TaskStatus[] = ['todo', 'in_progress', 'done'];

interface TaskBoardProps {
  tasks: Task[];
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
}

export const TaskBoard = ({ tasks, onChangeStatus }: TaskBoardProps) => (
  <Card>
    <CardContent>
      <Typography variant="h5" mb={2}>Tasks</Typography>
      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid key={task.id} item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1">{task.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{task.description ?? 'No description yet'}</Typography>
                  <Typography variant="caption" color="text.secondary">{task.estimateMinutes} min • {task.tags.join(', ') || 'untagged'}</Typography>
                  <TextField
                    select
                    size="small"
                    value={task.status}
                    onChange={(event) => onChangeStatus(task.id, event.target.value as TaskStatus)}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>{status.replace('_', ' ')}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);
