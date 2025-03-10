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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '@/components/DataTable';
import { toast } from 'react-hot-toast';

interface Vehicle {
  _id: string;
  name: string;
  id: string;
  licensePlate: string;
}

interface MaintenanceRecord {
  _id: string;
  maintenanceId: string;
  vehicle: Vehicle;
  type: string;
  status: string;
  dueDate: string;
  description: string;
  cost: number;
  notes?: string;
  completedDate?: string;
}

interface FormField {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  inputProps?: any;
  InputLabelProps?: any;
  options?: Array<{ value: string; label: string }>;
}

interface FormValues {
  [key: string]: string | number;
}

const maintenanceFields: FormField[] = [
  {
    name: 'maintenanceId',
    label: 'Maintenance ID',
    required: true,
    disabled: true,
  },
  {
    name: 'vehicle',
    label: 'Vehicle',
    type: 'select',
    required: true,
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Oil Change', label: 'Oil Change' },
      { value: 'Brake Check', label: 'Brake Check' },
      { value: 'Tire Rotation', label: 'Tire Rotation' },
      { value: 'General Service', label: 'General Service' },
      { value: 'Repair', label: 'Repair' },
    ],
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Scheduled', label: 'Scheduled' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Completed', label: 'Completed' },
      { value: 'Cancelled', label: 'Cancelled' },
    ],
  },
  {
    name: 'dueDate',
    label: 'Due Date',
    type: 'date',
    required: true,
    InputLabelProps: {
      shrink: true,
    },
  },
  {
    name: 'description',
    label: 'Description',
    required: true,
    multiline: true,
    rows: 3,
  },
  {
    name: 'cost',
    label: 'Cost',
    type: 'number',
    required: true,
    inputProps: { min: 0 },
  },
  {
    name: 'notes',
    label: 'Notes',
    multiline: true,
    rows: 3,
  },
];

const columns = [
  { id: 'maintenanceId', label: 'Maintenance ID' },
  { 
    id: 'vehicle', 
    label: 'Vehicle',
    render: (row: any) => `${row.vehicle?.name} (${row.vehicle?.licensePlate})`
  },
  { id: 'type', label: 'Type' },
  {
    id: 'status',
    label: 'Status',
    render: (row: any) => (
      <Typography
        component="span"
        sx={{
          backgroundColor:
            row.status === 'Completed'
              ? '#e8f5e9'
              : row.status === 'In Progress'
              ? '#fff3e0'
              : row.status === 'Scheduled'
              ? '#e3f2fd'
              : '#ffebee',
          color:
            row.status === 'Completed'
              ? '#2e7d32'
              : row.status === 'In Progress'
              ? '#e65100'
              : row.status === 'Scheduled'
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
  {
    id: 'dueDate',
    label: 'Due Date',
    render: (row: any) => new Date(row.dueDate).toLocaleDateString(),
  },
  { id: 'description', label: 'Description' },
  {
    id: 'cost',
    label: 'Cost',
    render: (row: any) => `$${row.cost.toFixed(2)}`,
  },
];

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceRecord | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    }
  };

  const fetchMaintenance = async () => {
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      setMaintenance(data);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast.error('Failed to fetch maintenance records');
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchMaintenance();
  }, []);

  const handleAdd = () => {
    setSelectedMaintenance(null);
    setFormValues({});
    setOpenDialog(true);
  };

  const handleEdit = (record: any) => {
    setSelectedMaintenance(record);
    setFormValues(record);
    setOpenDialog(true);
  };

  const handleDelete = (record: any) => {
    setSelectedMaintenance(record);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      if (selectedMaintenance) {
        const response = await fetch(`/api/maintenance`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: selectedMaintenance._id,
            ...values,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update maintenance record');
        }

        toast.success('Maintenance record updated successfully');
      } else {
        const response = await fetch('/api/maintenance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create maintenance record');
        }

        toast.success('Maintenance record created successfully');
      }
      setOpenDialog(false);
      fetchMaintenance();
    } catch (error: any) {
      console.error('Error saving maintenance record:', error);
      toast.error(error.message || 'Failed to save maintenance record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMaintenance) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/maintenance?id=${selectedMaintenance._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete maintenance record');
      }

      toast.success('Maintenance record deleted successfully');
      setOpenDeleteDialog(false);
      fetchMaintenance();
    } catch (error: any) {
      console.error('Error deleting maintenance record:', error);
      toast.error(error.message || 'Failed to delete maintenance record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Maintenance</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Schedule Maintenance
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={maintenance}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMaintenance ? 'Edit Maintenance Record' : 'Schedule Maintenance'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {maintenanceFields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {field.name === 'vehicle' ? (
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
                    <MenuItem value="">Select Vehicle</MenuItem>
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle._id} value={vehicle._id}>
                        {vehicle.name} ({vehicle.licensePlate})
                      </MenuItem>
                    ))}
                  </TextField>
                ) : field.type === 'select' && field.options ? (
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
                    label={field.label}
                    type={field.type || 'text'}
                    value={formValues[field.name] || ''}
                    onChange={(e) =>
                      setFormValues({ ...formValues, [field.name]: e.target.value })
                    }
                    required={field.required}
                    disabled={field.disabled}
                    multiline={field.multiline}
                    rows={field.rows}
                    inputProps={field.inputProps}
                    InputLabelProps={field.InputLabelProps}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit(formValues)}
            disabled={isLoading}
          >
            {selectedMaintenance ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Maintenance Record</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this maintenance record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 