// src/contexts/ThemeModeContext.jsx
import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { blue, pink, grey } from '@mui/material/colors'; 

export const ThemeModeContext = createContext({
  toggleThemeMode: () => {},
  mode: 'light',
});

// Basic theme definition for now
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
  }
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // Default to light

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
