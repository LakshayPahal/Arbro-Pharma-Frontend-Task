// src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ScienceIcon from '@mui/icons-material/Science';
import { ThemeModeContext } from './contexts/ThemeModeContext.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import mockSamplesData from './data/mockSamples.json';
import SampleTable from './components/SampleTable.jsx';

function App() {
  const themeMode = useContext(ThemeModeContext);
  const mode = themeMode ? themeMode.mode : 'light';
  const toggleThemeMode = themeMode ? themeMode.toggleThemeMode : () => {};

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSamples(mockSamplesData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography variant="h6">Loading samples...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppBar position="static" elevation={1} sx={{ borderRadius: {sm: 2}, mx: {sm: 2}, mt: {sm:2} }}>
        <Toolbar>
          <ScienceIcon sx={{ mr: 1.5, fontSize: '2rem' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Sample Management
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Samples Overview
        </Typography>
        <SampleTable samples={samples} />
      </Container>
    </LocalizationProvider>
  );
}

export default App;
