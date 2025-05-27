// src/App.jsx
import React, { useContext } from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeModeContext } from './contexts/ThemeModeContext.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


function App() {
  const themeMode = useContext(ThemeModeContext);
  const mode = themeMode ? themeMode.mode : 'light';
  const toggleThemeMode = themeMode ? themeMode.toggleThemeMode : () => {};

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Sample Management Dashboard (Initial Setup)
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Typography variant="body1">
            Project setup complete. Basic theme and structure in place.
          </Typography>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default App;