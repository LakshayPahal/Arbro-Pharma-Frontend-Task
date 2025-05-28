// src/components/StatusBadge.jsx
import React from 'react';
import { Chip } from '@mui/material';

const StatusBadge = ({ status }) => {
  let color = 'default';

  switch (status) {
    case 'Pending':
      color = 'warning';
      break;
    case 'Processing':
      color = 'info';
      break;
    case 'Completed':
      color = 'success';
      break;
    default:
      color = 'default';
  }

  return (
    <Chip
      label={status || 'Unknown'}
      color={color}
      size="small"
      sx={{
        minWidth: '90px',
        justifyContent: 'center',
        fontWeight: 'medium',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        animation: 'fadeIn 0.3s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      }}
    />
  );
};

export default StatusBadge;
