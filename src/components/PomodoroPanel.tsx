import { useMemo, useState } from 'react';
import type { Task } from '../types/domain';
import type { UserSettings } from '../types/domain';

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
    <section className="card">
      <h2>Pomodoro Command Center</h2>
      <p>Run structured focus sprints and log outcomes for team-level reporting.</p>
      <select value={selectedTaskId} onChange={(event) => setSelectedTaskId(event.target.value)}>
        <option value="">Choose a task</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>
      <label>
        Focus score: {focusScore}
        <input
          type="range"
          min={50}
          max={100}
          step={5}
          value={focusScore}
          onChange={(event) => setFocusScore(Number(event.target.value))}
        />
      </label>
      <button
        type="button"
        disabled={!selectedTaskId}
        onClick={() => onCompleteSession(selectedTaskId, focusMinutes, focusScore)}
      >
        Complete {focusMinutes} min session
      </button>
      <p>{selectedTaskName ? `Tracking: ${selectedTaskName}` : 'Pick a task to begin.'}</p>
    </section>
  );
};
