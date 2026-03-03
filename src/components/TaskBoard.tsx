import type { Task, TaskStatus } from '../types/domain';

const statusOptions: TaskStatus[] = ['todo', 'in_progress', 'done'];

interface TaskBoardProps {
  tasks: Task[];
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
}

export const TaskBoard = ({ tasks, onChangeStatus }: TaskBoardProps) => (
  <section className="card">
    <h2>Tasks</h2>
    <div className="task-grid">
      {tasks.map((task) => (
        <article key={task.id} className="task-card">
          <div>
            <h3>{task.title}</h3>
            <p>{task.description ?? 'No description yet'}</p>
          </div>
          <div className="meta-row">
            <span>{task.estimateMinutes} min estimate</span>
            <span>{task.tags.join(', ') || 'untagged'}</span>
          </div>
          <select
            value={task.status}
            onChange={(event) => onChangeStatus(task.id, event.target.value as TaskStatus)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </article>
      ))}
    </div>
  </section>
);
