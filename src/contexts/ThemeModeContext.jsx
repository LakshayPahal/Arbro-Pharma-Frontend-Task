// src/contexts/ThemeModeContext.jsx
import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { amber, grey, deepOrange, blue, pink } from '@mui/material/colors';

export const ThemeModeContext = createContext({
  toggleThemeMode: () => {},
  mode: 'light',
});

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: blue[700], contrastText: '#fff' },
          secondary: { main: pink[600], contrastText: '#fff' },
          background: {
            default: grey[100],
            paper: '#ffffff',
          },
          text: {
            primary: grey[900],
            secondary: grey[700],
          },
          error: { main: deepOrange[700] },
          warning: { main: amber[700] },
          info: { main: blue[500] },
          success: { main: '#2e7d32' }
        }
      : {
          primary: { main: amber[500], contrastText: 'rgba(0,0,0,0.87)' },
          secondary: { main: deepOrange[500], contrastText: '#fff' },
          background: {
            default: '#121212',
            paper: grey[900],
          },
          text: {
            primary: grey[50],
            secondary: grey[400],
          },
          error: { main: deepOrange[400] },
          warning: { main: amber[400] },
          info: { main: blue[300] },
          success: { main: '#66bb6a' }
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500, marginBottom: '0.5em' },
    h2: { fontSize: '2rem', fontWeight: 500, marginBottom: '0.4em' },
    h3: { fontSize: '1.75rem', fontWeight: 500, marginBottom: '0.4em' },
    h4: { fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.35em' },
    h5: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35em' },
    h6: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35em' },
    subtitle1: { fontSize: '1rem', fontWeight: 400, color: mode === 'light' ? grey[700] : grey[400] },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 500 },
    caption: { fontSize: '0.75rem', color: mode === 'light' ? grey[600] : grey[500] },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: ${mode === 'light' ? grey[400] : grey[700]} ${mode === 'light' ? grey[200] : grey[900]};
        }
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        *::-webkit-scrollbar-track {
          background: ${mode === 'light' ? grey[200] : grey[900]};
          border-radius: 10px;
        }
        *::-webkit-scrollbar-thumb {
          background-color: ${mode === 'light' ? grey[400] : grey[700]};
          border-radius: 10px;
          border: 2px solid ${mode === 'light' ? grey[200] : grey[900]};
        }
      `,
    },
    MuiPaper: {
      defaultProps: {
        elevation: mode === 'light' ? 1 : 3,
      },
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        }
      }
    },
    MuiButton: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          padding: '8px 20px',
        },
        containedPrimary: ({theme}) => (
          theme.palette.mode === 'dark' ? { color: theme.palette.getContrastText(theme.palette.primary.main) } : {}
        ),
        containedSecondary: ({theme}) => (
          theme.palette.mode === 'dark' ? { color: theme.palette.getContrastText(theme.palette.secondary.main) } : {}
        )
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontWeight: 'bold',
          ...(theme.palette.mode === 'dark'
            ? {
                backgroundColor: grey[800],
                color: theme.palette.text.primary,
              }
            : {
                backgroundColor: grey[200],
                color: theme.palette.text.primary,
              }),
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.text.secondary,
          }),
        }),
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({theme}) => ({
          ...(theme.palette.mode === 'dark' && {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: grey[700],
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: grey[500],
            },
          })
        })
      }
    },
    MuiSelect: {
      styleOverrides: {
        icon: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.text.secondary,
          }),
        }),
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        }
      }
    }
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
