import { FormEvent, useState } from 'react';
import { Activity, BriefcaseBusiness, Timer } from 'lucide-react';
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

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask.mutate({
      title,
      description,
      estimateMinutes,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setTitle('');
    setDescription('');
    setEstimateMinutes(25);
    setTags('');
  };

  return (
    <main className="layout">
      <header>
        <h1>Enterprise Pomodoro OS</h1>
        <p>A backend-ready productivity cockpit with local-first persistence and analytics.</p>
        <div className="stats-strip">
          <div>
            <BriefcaseBusiness size={18} />
            <span>{tasks.length} tasks managed</span>
          </div>
          <div>
            <Timer size={18} />
            <span>{dashboard?.sessionsByDay.reduce((sum, day) => sum + day.sessions, 0) ?? 0} sessions logged</span>
          </div>
          <div>
            <Activity size={18} />
            <span>
              {dashboard?.sessionsByDay.reduce((sum, day) => sum + day.minutes, 0) ?? 0} min deep work
            </span>
          </div>
        </div>
      </header>

      <section className="card">
        <h2>Add Task</h2>
        <form onSubmit={submitTask} className="task-form">
          <input
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <input
            type="number"
            min={5}
            step={5}
            value={estimateMinutes}
            onChange={(event) => setEstimateMinutes(Number(event.target.value))}
            required
          />
          <input
            placeholder="tags (comma separated)"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
          <button type="submit" disabled={addTask.isPending}>
            Add Task
          </button>
        </form>
      </section>

      <PomodoroPanel
        tasks={tasks}
        settings={settings}
        onCompleteSession={(taskId, minutes, focusScore) =>
          sessionMutation.mutate({ taskId, durationMinutes: minutes, focusScore })
        }
      />

      {settings && (
        <section className="card">
          <h2>Focus Settings</h2>
          <div className="settings-row">
            <label>
              Focus
              <input
                type="number"
                value={settings.focusMinutes}
                onChange={(event) =>
                  settingsMutation.mutate({ ...settings, focusMinutes: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Short break
              <input
                type="number"
                value={settings.shortBreakMinutes}
                onChange={(event) =>
                  settingsMutation.mutate({ ...settings, shortBreakMinutes: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Long break
              <input
                type="number"
                value={settings.longBreakMinutes}
                onChange={(event) =>
                  settingsMutation.mutate({ ...settings, longBreakMinutes: Number(event.target.value) })
                }
              />
            </label>
          </div>
        </section>
      )}

      <TaskBoard
        tasks={tasks}
        onChangeStatus={(taskId, status) => updateTaskStatus.mutate({ taskId, status })}
      />

      {dashboard && <DashboardCharts snapshot={dashboard} />}
    </main>
  );
};

export default App;
