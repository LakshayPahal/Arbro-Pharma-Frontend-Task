// src/components/SampleForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Grid, FormHelperText, Typography, Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isValid, parseISO, isFuture, format as formatDateFns } from 'date-fns';
import StatusBadge from './StatusBadge';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const SampleForm = ({
  initialData,
  mode,
  onSave,
  onCancel,
  sampleTypeOptions,
  statusOptions
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleDateChange = (newDate) => {
    const newDateString = newDate ? formatDateFns(newDate, 'yyyy-MM-dd') : null;
    setFormData(prevData => ({
      ...prevData,
      collectedOn: newDateString,
    }));
    if (errors.collectedOn) {
      setErrors(prevErrors => ({ ...prevErrors, collectedOn: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sampleName || formData.sampleName.trim() === '') {
      newErrors.sampleName = 'Sample Name is required.';
    }
    if (!formData.sampleType) {
      newErrors.sampleType = 'Sample Type is required.';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required.';
    }
    if (!formData.collectedOn) {
      newErrors.collectedOn = 'Collected Date is required.';
    } else {
      const dateObj = parseISO(formData.collectedOn);
      if (!isValid(dateObj)) {
        newErrors.collectedOn = 'Invalid date format. Please use DD/MM/YYYY.';
      } else if (isFuture(dateObj)) {
        newErrors.collectedOn = 'Collected Date cannot be in the future.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0 }}>
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="sampleName"
            label="Sample Name"
            name="sampleName"
            value={formData.sampleName || ''}
            onChange={handleChange}
            autoFocus={mode === 'add'}
            error={!!errors.sampleName}
            helperText={errors.sampleName}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required error={!!errors.sampleType} variant="outlined">
            <InputLabel id="sampleType-label">Sample Type</InputLabel>
            <Select
              labelId="sampleType-label"
              id="sampleType"
              name="sampleType"
              value={formData.sampleType || ''}
              label="Sample Type"
              onChange={handleChange}
            >
              {sampleTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.sampleType && <FormHelperText>{errors.sampleType}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            label="Collected Date *"
            value={formData.collectedOn ? parseISO(formData.collectedOn) : null}
            onChange={handleDateChange}
            inputFormat="dd/MM/yyyy"
            maxDate={new Date()}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                error={!!errors.collectedOn}
                helperText={errors.collectedOn}
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          {mode === 'edit' && formData.status && (
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight:'medium' }}>Current Status:</Typography>
                <StatusBadge status={formData.status} />
            </Box>
          )}
          <FormControl fullWidth required error={!!errors.status} variant="outlined">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status || ''}
              label="Status"
              onChange={handleChange}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            label="Description (Optional)"
            name="description"
            multiline
            rows={4}
            value={formData.description || ''}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="secondary"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          {mode === 'add' ? 'Add Sample' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default SampleForm;
