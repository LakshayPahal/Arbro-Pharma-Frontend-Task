// src/App.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ScienceIcon from '@mui/icons-material/Science';
import { ThemeModeContext } from './contexts/ThemeModeContext.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import mockSamplesData from './data/mockSamples.json';
import SampleTable from './components/SampleTable.jsx';

const statusFilterOptions = ["All", "Pending", "Processing", "Completed"];

function App() {
  const themeMode = useContext(ThemeModeContext);
  const mode = themeMode ? themeMode.mode : 'light';
  const toggleThemeMode = themeMode ? themeMode.toggleThemeMode : () => {};

  const [allSamples, setAllSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setAllSamples(mockSamplesData);
    setLoading(false);
  }, []);

  const filteredSamples = useMemo(() => {
    let samplesToShow = allSamples;

    if (searchTerm.trim()) {
      samplesToShow = samplesToShow.filter(sample =>
        sample.sampleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      samplesToShow = samplesToShow.filter(sample =>
        sample.status === statusFilter
      );
    }

    return samplesToShow;
  }, [allSamples, searchTerm, statusFilter]);

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
        <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          Samples Overview
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 2,
          alignItems: 'center'
        }}>
          <TextField
            fullWidth={true}
            sx={{ flexGrow: {sm: 1} }}
            label="Search by Sample Name"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: {xs: '100%', sm: 200} }}>
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Filter by Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusFilterOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <SampleTable samples={filteredSamples} />
      </Container>
    </LocalizationProvider>
  );
}

export default App;
