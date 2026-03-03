import { Card, CardContent, Grid, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  <Card>
    <CardContent>
      <Typography variant="h5" mb={2}>Productivity Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Daily Focus Minutes</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={snapshot.sessionsByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#2065D1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" mb={1}>Task Status Mix</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={snapshot.taskStatusBreakdown} dataKey="count" nameKey="status" outerRadius={80} fill="#00AB55" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" mb={1}>Top Tasks by Focus Time</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={snapshot.topTasksByFocusTime} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="task" width={150} />
              <Tooltip />
              <Bar dataKey="minutes" fill="#22C55E" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
