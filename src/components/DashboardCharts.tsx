import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ProductivitySnapshot } from '../types/domain';

interface DashboardChartsProps {
  snapshot: ProductivitySnapshot;
}

export const DashboardCharts = ({ snapshot }: DashboardChartsProps) => (
  <section className="card charts">
    <h2>Productivity Dashboard</h2>
    <div className="chart-row">
      <article>
        <h3>Daily Focus Minutes</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={snapshot.sessionsByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </article>
      <article>
        <h3>Task Status Mix</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={snapshot.taskStatusBreakdown}
              dataKey="count"
              nameKey="status"
              outerRadius={80}
              fill="#22c55e"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </article>
    </div>
    <article>
      <h3>Top Tasks by Focus Time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={snapshot.topTasksByFocusTime} layout="vertical" margin={{ left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="task" width={150} />
          <Tooltip />
          <Bar dataKey="minutes" fill="#14b8a6" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  </section>
);
