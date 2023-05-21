import { ThemeProvider, createTheme } from '@mui/material';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffa447',
    },
    secondary: {
      main: '#1eccc3',
    },
    info: {
      main: '#7ecbff',
    },
    success: {
      main: '#1eccc3',
    },
    warning: {
      main: '#ffa447',
    },
    error: {
      main: '#ffa3a3',
    },
    text: {
      primary: '#0b1330',
    },
  },
  shape: {
    borderRadius: 5,
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
