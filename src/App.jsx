// src/App.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import mockSamplesData from './data/mockSamples.json';
import {
  Container, Typography, Box, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Modal,
  IconButton, Paper, AppBar, Toolbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ScienceIcon from '@mui/icons-material/Science'; // App Bar Icon
import EditNoteIcon from '@mui/icons-material/EditNote'; // Icon for Edit Modal Title
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'; // Icon for Add Modal Title
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import SampleTable from './components/SampleTable';
import SampleForm from './components/SampleForm';
import { ThemeModeContext } from './contexts/ThemeModeContext.jsx';

const statusOptions = ["All", "Pending", "Processing", "Completed"];
const sampleTypeOptions = ["Blood", "Urine", "Tissue", "Saliva", "Other"];
const initialSampleFormState = {
  id: null,
  sampleName: '',
  sampleType: sampleTypeOptions[0],
  collectedOn: new Date().toISOString().split('T')[0],
  status: statusOptions[1],
  description: ''
};

function App() {
  const [allSamples, setAllSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'sampleName', direction: 'ascending' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [currentSampleData, setCurrentSampleData] = useState(initialSampleFormState);

  const themeMode = useContext(ThemeModeContext);
  const mode = themeMode ? themeMode.mode : 'light';
  const toggleThemeMode = themeMode ? themeMode.toggleThemeMode : () => console.error("toggleThemeMode not available");

  useEffect(() => {
    setAllSamples(mockSamplesData);
    setLoading(false);
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setPage(0);
  };

  const sortedAndFilteredSamples = useMemo(() => {
    let samplesToProcess = [...allSamples];
    if (searchTerm.trim()) {
      samplesToProcess = samplesToProcess.filter(sample =>
        sample.sampleName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'All') {
      samplesToProcess = samplesToProcess.filter(sample =>
        sample.status === statusFilter
      );
    }
    if (sortConfig.key !== null) {
      samplesToProcess.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'collectedOn') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return samplesToProcess;
  }, [allSamples, searchTerm, statusFilter, sortConfig]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSamples = useMemo(() => {
    return sortedAndFilteredSamples.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedAndFilteredSamples, page, rowsPerPage]);

  const handleOpenModal = (mode, sampleData = null) => {
    setFormMode(mode);
    if (mode === 'edit' && sampleData) {
      setCurrentSampleData(sampleData);
    } else {
      setCurrentSampleData({
        ...initialSampleFormState,
        collectedOn: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveSample = (formData) => {
    if (formMode === 'add') {
      const newSample = { ...formData, id: `SMPL${Date.now().toString().slice(-6)}` };
      setAllSamples(prevSamples => [newSample, ...prevSamples]);
    } else if (formMode === 'edit') {
      setAllSamples(prevSamples =>
        prevSamples.map(sample => (sample.id === formData.id ? { ...sample, ...formData } : sample))
      );
    }
    handleCloseModal();
  };

  const handleEditSampleClick = (sampleToEdit) => handleOpenModal('edit', sampleToEdit);
  const handleInlineStatusUpdate = (sampleId, newStatus) => {
    setAllSamples(prevSamples =>
      prevSamples.map(sample =>
        sample.id === sampleId ? { ...sample, status: newStatus } : sample
      )
    );
  };

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
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', py: { xs: 0, sm: 2 } }}>
        <AppBar position="static" elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
          <Toolbar>
            <ScienceIcon sx={{ mr: 1.5, fontSize: '2rem', color: 'inherit' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Sample Management
            </Typography>
            <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit" aria-label="toggle theme mode">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Paper component="main" elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, flexGrow: 1 }}>
          <Box sx={{
            mb: 3,
            display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2,
          }}>
            <TextField
              variant="outlined" label="Search by Sample Name" placeholder="Enter sample name..."
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              sx={{ flexGrow: { sm: 1 }, width: { xs: '100%', sm: 'auto' } }}
            />
            <FormControl variant="outlined" sx={{ minWidth: { sm: 200 }, width: { xs: '100%', sm: 'auto' } }}>
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select labelId="status-filter-label" value={statusFilter} label="Filter by Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                {statusOptions.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
              </Select>
            </FormControl>
            <Button
              variant="contained" color="primary" startIcon={<AddIcon />}
              onClick={() => handleOpenModal('add')}
              sx={{ width: { xs: '100%', sm: 'auto' }, py: 1.5, px: 3 }}
            > Add Sample </Button>
          </Box>

          {sortedAndFilteredSamples.length > 0 ? (
            <SampleTable
              samples={paginatedSamples}
              onEditSample={handleEditSampleClick}
              requestSort={requestSort}
              sortConfig={sortConfig}
              totalSamplesCount={sortedAndFilteredSamples.length}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              onInlineStatusChange={handleInlineStatusUpdate}
              updatableStatusOptions={statusOptions.filter(s => s !== 'All')}
            />
          ) : (
             <Typography sx={{ textAlign: 'center', mt: 4, py: 5, fontStyle: 'italic', color: 'text.secondary' }}>
                {searchTerm || statusFilter !== 'All' ? 'No samples match your current criteria.' : 'No samples available. Click "Add Sample" to begin.'}
              </Typography>
          )}
        </Paper>

        <Modal open={isModalOpen} onClose={handleCloseModal} aria-labelledby="sample-form-modal-title">
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500, md: 600 }, maxHeight: '90vh', overflowY: 'auto',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2, boxShadow: 24, p: { xs: 2, sm: 3, md: 4 },
          }}>
            {/* Enhanced Modal Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              {formMode === 'add' ? (
                <PlaylistAddIcon sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
              ) : (
                <EditNoteIcon sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
              )}
              <Typography id="sample-form-modal-title" variant="h5" component="h2">
                {formMode === 'add' ? 'Add New Sample' : 'Edit Sample Details'}
              </Typography>
            </Box>
            <SampleForm
              mode={formMode} initialData={currentSampleData}
              onSave={handleSaveSample} onCancel={handleCloseModal}
              sampleTypeOptions={sampleTypeOptions}
              statusOptions={statusOptions.filter(s => s !== 'All')}
            />
          </Box>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
}

export default App;