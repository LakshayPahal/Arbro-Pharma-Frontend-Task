// src/contexts/ThemeModeContext.jsx
import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { blue, pink, grey } from '@mui/material/colors';

export const ThemeModeContext = createContext({
  toggleThemeMode: () => {},
  mode: 'light',
});

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: blue[700],
    },
    secondary: {
      main: pink[600],
    },
    background: {
      default: mode === 'light' ? grey[50] : grey[900],
      paper: mode === 'light' ? '#ffffff' : grey[800],
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => `
        body {
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: ${theme.palette.mode === 'light' ? grey[400] : grey[700]} ${theme.palette.mode === 'light' ? grey[200] : grey[900]};
        }
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        *::-webkit-scrollbar-track {
          background: ${theme.palette.mode === 'light' ? grey[200] : grey[900]};
          border-radius: 10px;
        }
        *::-webkit-scrollbar-thumb {
          background-color: ${theme.palette.mode === 'light' ? grey[400] : grey[700]};
          border-radius: 10px;
          border: 2px solid ${theme.palette.mode === 'light' ? grey[200] : grey[900]};
        }
      `,
    },
  }
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const themeModeAPI = useMemo(
    () => ({
      toggleThemeMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeModeContext.Provider value={themeModeAPI}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MUIThemeProvider>
    </ThemeModeContext.Provider>
  );
};
