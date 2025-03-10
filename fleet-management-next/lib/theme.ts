'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#875A7B',
      light: '#9b6b8d',
      dark: '#6B4423',
    },
    secondary: {
      main: '#6B4423',
      light: '#8b6443',
      dark: '#4B2413',
    },
    success: {
      main: '#28a745',
      light: '#48c765',
      dark: '#1e7e34',
    },
    warning: {
      main: '#ffc107',
      light: '#ffcd38',
      dark: '#d39e00',
    },
    error: {
      main: '#dc3545',
      light: '#e4606d',
      dark: '#bd2130',
    },
    info: {
      main: '#17a2b8',
      light: '#31b9d0',
      dark: '#138496',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4C4C4C',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Lucida Grande", Helvetica, Verdana, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme; 