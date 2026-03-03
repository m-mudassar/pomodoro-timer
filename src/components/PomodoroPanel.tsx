import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Task, UserSettings } from '../types/domain';

interface PomodoroPanelProps {
  tasks: Task[];
  settings?: UserSettings;
  onCompleteSession: (taskId: string, minutes: number, focusScore: number) => void;
}

export const PomodoroPanel = ({ tasks, settings, onCompleteSession }: PomodoroPanelProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [focusScore, setFocusScore] = useState(80);
  const focusMinutes = settings?.focusMinutes ?? 25;

  const selectedTaskName = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId)?.title,
    [tasks, selectedTaskId],
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5">Pomodoro Command Center</Typography>
            <Typography color="text.secondary">Run structured focus sprints and log outcomes.</Typography>
          </Box>
          <TextField
            select
            label="Active task"
            value={selectedTaskId}
            onChange={(event) => setSelectedTaskId(event.target.value)}
          >
            <MenuItem value="">Choose a task</MenuItem>
            {tasks.map((task) => (
              <MenuItem key={task.id} value={task.id}>{task.title}</MenuItem>
            ))}
          </TextField>
          <Box>
            <Typography gutterBottom>Focus score: {focusScore}</Typography>
            <Slider min={50} max={100} step={5} value={focusScore} onChange={(_, v) => setFocusScore(v as number)} />
          </Box>
          <Button
            type="button"
            variant="contained"
            disabled={!selectedTaskId}
            onClick={() => onCompleteSession(selectedTaskId, focusMinutes, focusScore)}
          >
            Complete {focusMinutes} min session
          </Button>
          <Typography color="text.secondary">{selectedTaskName ? `Tracking: ${selectedTaskName}` : 'Pick a task to begin.'}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
