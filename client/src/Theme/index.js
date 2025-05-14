// src/theme.js
import { createTheme } from '@mui/material/styles';

const commonTypography = {
  fontFamily: "'Vazirmatn', 'Roboto', 'Arial', sans-serif",
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
};

const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: 'Vazirmatn';
        font-style: normal;
        font-weight: 400;
        src: url('/fonts/Vazirmatn.woff2') format('woff2');
      }
      body {
        font-family: 'Vazirmatn', 'Roboto', 'Arial', sans-serif;
      }
    `,
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        textTransform: 'none',
        fontWeight: 500,
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#D35400',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#34495E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9F9F9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1B1B1B',
      secondary: '#4A4A4A',
    },
    divider: '#E0E0E0',
  },
  typography: commonTypography,
  shape: {
    borderRadius: 12,
  },
  components: commonComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E67E22',
      contrastText: '#0D0B0C',
    },
    secondary: {
      main: '#95A5A6',
      contrastText: '#0D0B0C',
    },
    background: {
      default: '#0D0B0C',
      paper: '#1C1C1C',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#BDC3C7',
    },
    divider: '#2C3E50',
  },
  typography: commonTypography,
  shape: {
    borderRadius: 12,
  },
  components: commonComponents,
});
