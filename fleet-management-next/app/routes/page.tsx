'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '@/components/DataTable';

const routeFields = [
  {
    name: 'routeId',
    label: 'Route ID',
    required: true,
  },
  {
    name: 'name',
    label: 'Name',
    required: true,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Cancelled', label: 'Cancelled' },
    ],
  },
  {
    name: 'startLocation',
    label: 'Start Location',
    required: true,
  },
  {
    name: 'endLocation',
    label: 'End Location',
    required: true,
  },
  {
    name: 'distance',
    label: 'Distance (km)',
    type: 'number',
    required: true,
    inputProps: { min: 0 },
  },
  {
    name: 'estimatedDuration',
    label: 'Estimated Duration (hours)',
    type: 'number',
    required: true,
    inputProps: { min: 0 },
  },
];

const columns = [
  { id: 'routeId', label: 'Route ID' },
  { id: 'name', label: 'Name' },
  {
    id: 'status',
    label: 'Status',
    render: (row: any) => (
      <Typography
        component="span"
        sx={{
          backgroundColor:
            row.status === 'Active'
              ? '#e8f5e9'
              : row.status === 'Completed'
              ? '#e3f2fd'
              : '#ffebee',
          color:
            row.status === 'Active'
              ? '#2e7d32'
              : row.status === 'Completed'
              ? '#1565c0'
              : '#c62828',
          px: 1,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        {row.status}
      </Typography>
    ),
  },
  { id: 'startLocation', label: 'Start Location' },
  { id: 'endLocation', label: 'End Location' },
  { id: 'distance', label: 'Distance (km)' },
  { id: 'estimatedDuration', label: 'Duration (hrs)' },
  {
    id: 'progress',
    label: 'Progress',
    render: (row: any) => (
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={row.progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: row.progress === 100 ? '#4caf50' : '#2196f3',
            },
          }}
        />
        <Typography variant="body2" color="text.secondary" align="right">
          {row.progress}%
        </Typography>
      </Box>
    ),
  },
];

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState({});

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAdd = () => {
    setSelectedRoute(null);
    setFormValues({});
    setOpenDialog(true);
  };

  const handleEdit = (route: any) => {
    setSelectedRoute(route);
    setFormValues(route);
    setOpenDialog(true);
  };

  const handleDelete = (route: any) => {
    setSelectedRoute(route);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (selectedRoute) {
        await fetch(`/api/routes/${selectedRoute._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      } else {
        await fetch('/api/routes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      }
      setOpenDialog(false);
      fetchRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`/api/routes/${selectedRoute._id}`, {
        method: 'DELETE',
      });
      setOpenDeleteDialog(false);
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Routes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Route
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={routes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRoute ? 'Edit Route' : 'Add Route'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {routeFields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.type === 'select' ? (
                  <TextField
                    fullWidth
                    select
                    label={field.label}
                    value={formValues[field.name] || ''}
                    onChange={(e) =>
                      setFormValues({ ...formValues, [field.name]: e.target.value })
                    }
                    required={field.required}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    type={field.type || 'text'}
                    label={field.label}
                    value={formValues[field.name] || ''}
                    onChange={(e) =>
                      setFormValues({ ...formValues, [field.name]: e.target.value })
                    }
                    required={field.required}
                    inputProps={field.inputProps}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleSubmit(formValues)} variant="contained" color="primary">
            {selectedRoute ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this route?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 