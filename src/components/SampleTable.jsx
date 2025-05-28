// src/components/SampleTable.jsx
import React from 'react';
import { format } from 'date-fns';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TableSortLabel, Box, TablePagination,
  Select, MenuItem, FormControl, Skeleton, useMediaQuery, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import StatusBadge from './StatusBadge';

const columns = [
  { id: 'id', label: 'Sample ID', minWidth: 100, sortable: false },
  { id: 'sampleName', label: 'Sample Name', minWidth: 170, sortable: true },
  { id: 'sampleType', label: 'Sample Type', minWidth: 120, sortable: false },
  {
    id: 'collectedOn',
    label: 'Collected On',
    minWidth: 130,
    format: (value) => format(new Date(value), 'dd/MM/yyyy'),
    sortable: true,
  },
  { id: 'status', label: 'Status', minWidth: 150, sortable: false },
  { id: 'actions', label: 'Actions', minWidth: 100, align: 'center', sortable: false },
];

const LoadingSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <TableRow>
      <TableCell><Skeleton animation="wave" /></TableCell>
      <TableCell><Skeleton animation="wave" /></TableCell>
      <TableCell><Skeleton animation="wave" /></TableCell>
      <TableCell><Skeleton animation="wave" /></TableCell>
      <TableCell><Skeleton animation="wave" width={100} /></TableCell>
      {!isMobile && <TableCell><Skeleton animation="wave" width={80} /></TableCell>}
    </TableRow>
  );
};

const SampleTable = ({
  samples,
  onEditSample,
  requestSort,
  sortConfig,
  totalSamplesCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onInlineStatusChange,
  updatableStatusOptions,
  loading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const createSortHandler = (property) => (event) => {
    requestSort(property);
  };

  return (
    <Paper 
      sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        boxShadow: 3, 
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sample collection table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ 
                    minWidth: column.minWidth, 
                    fontWeight: 'bold',
                    display: isMobile && column.hideOnMobile ? 'none' : 'table-cell'
                  }}
                  sortDirection={sortConfig.key === column.id ? sortConfig.direction : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortConfig.key === column.id}
                      direction={sortConfig.key === column.id ? sortConfig.direction : 'asc'}
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                      {sortConfig.key === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortConfig.direction === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array(5).fill().map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : (
              samples.map((row) => (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                  onClick={() => onEditSample(row)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transition: 'background-color 0.2s ease-in-out'
                    }
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    
                    if (column.id === 'status') {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{
                            display: isMobile && column.hideOnMobile ? 'none' : 'table-cell',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          <FormControl
                            variant="standard"
                            size="small"
                            sx={{ m: 0, minWidth: 120 }}
                            onClick={(e) => e.stopPropagation()} 
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <Select
                              value={value}
                              onChange={(e) => onInlineStatusChange(row.id, e.target.value)}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Sample status' }}
                              MenuProps={{
                                container: document.body,
                              }}
                            >
                              {updatableStatusOptions.map((statusOpt) => (
                                <MenuItem key={statusOpt} value={statusOpt}>
                                  {statusOpt}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      );
                    }
                    
                    if (column.id === 'actions') {
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{
                            display: isMobile && column.hideOnMobile ? 'none' : 'table-cell',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                              e.stopPropagation(); 
                              onEditSample(row);
                            }}
                            sx={{ textTransform: 'none' }} 
                          >
                            Edit
                          </Button>
                        </TableCell>
                      );
                    }
                    
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{
                          display: isMobile && column.hideOnMobile ? 'none' : 'table-cell',
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        {column.format && (typeof value === 'string' || value instanceof Date) 
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalSamplesCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default SampleTable;
