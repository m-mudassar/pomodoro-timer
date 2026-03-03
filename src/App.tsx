import { FormEvent, useMemo, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BoltIcon from '@mui/icons-material/Bolt';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DashboardCharts } from './components/DashboardCharts';
import { PomodoroPanel } from './components/PomodoroPanel';
import { TaskBoard } from './components/TaskBoard';
import {
  useDashboard,
  useSessionMutation,
  useSettings,
  useSettingsMutation,
  useTaskMutations,
  useTasks,
} from './hooks/useProductivity';

const App = () => {
  const { data: tasks = [] } = useTasks();
  const { data: dashboard } = useDashboard();
  const { data: settings } = useSettings();
  const sessionMutation = useSessionMutation();
  const settingsMutation = useSettingsMutation();
  const { addTask, updateTaskStatus } = useTaskMutations();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState(25);
  const [tags, setTags] = useState('');

  const summary = useMemo(() => ({
    tasks: tasks.length,
    sessions: dashboard?.sessionsByDay.reduce((sum, day) => sum + day.sessions, 0) ?? 0,
    minutes: dashboard?.sessionsByDay.reduce((sum, day) => sum + day.minutes, 0) ?? 0,
  }), [dashboard, tasks.length]);

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask.mutate({
      title,
      description,
      estimateMinutes,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    });
    setTitle('');
    setDescription('');
    setEstimateMinutes(25);
    setTags('');
  };

  return (
    <Box sx={{ py: 5, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3">Pomodoro Workspace</Typography>
            <Typography color="text.secondary">Minimal UI inspired dashboard built with Material UI.</Typography>
          </Box>

          <Grid container spacing={2}>
            {[
              { label: 'Tasks managed', value: summary.tasks, icon: <AssignmentTurnedInIcon color="primary" /> },
              { label: 'Sessions logged', value: summary.sessions, icon: <AccessTimeIcon color="primary" /> },
              { label: 'Minutes focused', value: summary.minutes, icon: <BoltIcon color="primary" /> },
            ].map((stat) => (
              <Grid key={stat.label} item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {stat.icon}
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">{stat.label}</Typography>
                        <Typography variant="h5">{stat.value}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h5" mb={2}>Add Task</Typography>
              <Box component="form" onSubmit={submitTask}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}><TextField fullWidth required label="Task title" value={title} onChange={(e) => setTitle(e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} /></Grid>
                  <Grid item xs={12} md={2}><TextField fullWidth required type="number" label="Estimate" value={estimateMinutes} onChange={(e) => setEstimateMinutes(Number(e.target.value))} /></Grid>
                  <Grid item xs={12} md={2}><TextField fullWidth label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} /></Grid>
                  <Grid item xs={12} md={2}><Button fullWidth sx={{ height: '100%' }} type="submit" variant="contained" disabled={addTask.isPending}>Add Task</Button></Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          <PomodoroPanel
            tasks={tasks}
            settings={settings}
            onCompleteSession={(taskId, minutes, focusScore) =>
              sessionMutation.mutate({ taskId, durationMinutes: minutes, focusScore })}
          />

          {settings && (
            <Card>
              <CardContent>
                <Typography variant="h5" mb={2}>Focus Settings</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: 'Focus', key: 'focusMinutes' as const },
                    { label: 'Short break', key: 'shortBreakMinutes' as const },
                    { label: 'Long break', key: 'longBreakMinutes' as const },
                  ].map((item) => (
                    <Grid item xs={12} md={4} key={item.key}>
                      <TextField
                        fullWidth
                        type="number"
                        label={item.label}
                        value={settings[item.key]}
                        onChange={(event) => settingsMutation.mutate({ ...settings, [item.key]: Number(event.target.value) })}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          <TaskBoard tasks={tasks} onChangeStatus={(taskId, status) => updateTaskStatus.mutate({ taskId, status })} />

          {dashboard && <DashboardCharts snapshot={dashboard} />}
        </Stack>
      </Container>
    </Box>
  );
};

export default App;
