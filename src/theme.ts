import { alpha, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2065D1' },
    secondary: { main: '#00AB55' },
    background: { default: '#F9FAFB', paper: '#FFFFFF' },
    text: { primary: '#1C252E', secondary: '#637381' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Public Sans", "Inter", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 24px 0 rgba(145, 158, 171, 0.16)',
          border: `1px solid ${alpha('#919EAB', 0.2)}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#919EAB', 0.08),
        },
      },
    },
  },
});
