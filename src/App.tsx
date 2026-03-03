import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { TaskManagementPage } from 'src/features/tasks/TaskManagementPage';

const queryClient = new QueryClient();
const theme = createTheme();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TaskManagementPage />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
