// src/components/SampleTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

const columns = [
  { id: 'id', label: 'Sample ID' },
  { id: 'sampleName', label: 'Sample Name' },
  { id: 'sampleType', label: 'Sample Type' },
  { id: 'status', label: 'Status' },
];

const SampleTable = ({ samples }) => {
  if (!samples || samples.length === 0) {
    return <Typography sx={{ textAlign: 'center', my: 2 }}>No samples to display.</Typography>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="simple sample table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ fontWeight: 'bold' }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {samples.map((row) => (
              <TableRow hover key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SampleTable;