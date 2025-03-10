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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

interface Vehicle {
  _id: string;
  vehicleId: string;
  type: string;
}

interface Driver {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  driverId: string;
  status: string;
  phone: string;
  email: string;
  licenseNumber: string;
  lastLocation?: string;
  assignedVehicle?: Vehicle;
}

interface FormValues {
  firstName?: string;
  lastName?: string;
  driverId?: string;
  status?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  assignedVehicle?: string;
}

const statusOptions = [
  { value: 'On Duty', label: 'Active' },
  { value: 'Off Duty', label: 'Off Duty' },
  { value: 'On Leave', label: 'On Leave' },
];

const vehicleOptions = [
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'car', label: 'Car' },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    driverId: '',
    status: '',
    phone: '',
    email: '',
    licenseNumber: '',
    assignedVehicle: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers');
      const data = await response.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAdd = () => {
    setSelectedDriver(null);
    setFormValues({
      firstName: '',
      lastName: '',
      driverId: '',
      status: '',
      phone: '',
      email: '',
      licenseNumber: '',
      assignedVehicle: '',
    });
    setOpenDialog(true);
  };

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenViewDialog(true);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormValues({
      firstName: driver.firstName,
      lastName: driver.lastName,
      driverId: driver.driverId,
      status: driver.status,
      phone: driver.phone,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      assignedVehicle: driver.assignedVehicle?.vehicleId,
    });
    setOpenDialog(true);
  };

  const handleDelete = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (selectedDriver) {
        await fetch(`/api/drivers/${selectedDriver._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
      } else {
        await fetch('/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
      }
      setOpenDialog(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error saving driver:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedDriver) return;
      
      await fetch(`/api/drivers/${selectedDriver._id}`, {
        method: 'DELETE',
      });
      setOpenDeleteDialog(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = 
      (driver.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (driver.driverId?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || driver.status === statusFilter;
    const matchesVehicle = !vehicleFilter || driver.assignedVehicle?.type === vehicleFilter;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Drivers Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Driver
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={vehicleFilter}
                label="Vehicle Type"
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <MenuItem value="">All Vehicles</MenuItem>
                {vehicleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setStatusFilter('');
                setVehicleFilter('');
                setSearchQuery('');
              }}
              sx={{ height: '56px' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Location</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{driver.firstName ? driver.firstName[0] : 'D'}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{driver.firstName} {driver.lastName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {driver.driverId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{driver.phone}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {driver.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{driver.assignedVehicle?.vehicleId || '-'}</TableCell>
                  <TableCell>
                    <Typography
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          driver.status === 'On Duty'
                            ? '#E8F5E9'
                            : driver.status === 'Off Duty'
                            ? '#FFF3E0'
                            : '#FFEBEE',
                        color:
                          driver.status === 'On Duty'
                            ? '#2E7D32'
                            : driver.status === 'Off Duty'
                            ? '#EF6C00'
                            : '#C62828',
                      }}
                    >
                      {driver.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{driver.lastLocation || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleView(driver)}
                      sx={{ mr: 1 }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(driver)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(driver)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Driver Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedDriver ? 'Edit Driver' : 'Add Driver'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formValues.firstName || ''}
                onChange={(e) =>
                  setFormValues({ ...formValues, firstName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formValues.lastName || ''}
                onChange={(e) =>
                  setFormValues({ ...formValues, lastName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driver ID"
                value={formValues.driverId || ''}
                onChange={(e) =>
                  setFormValues({ ...formValues, driverId: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="License Number"
                value={formValues.licenseNumber || ''}
                onChange={(e) =>
                  setFormValues({ ...formValues, licenseNumber: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formValues.phone || ''}
                onChange={(e) =>
                  setFormValues({ ...formValues, phone: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formValues.email || ''}
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle</InputLabel>
                <Select
                  value={formValues.assignedVehicle || ''}
                  label="Vehicle"
                  onChange={(e) =>
                    setFormValues({ ...formValues, assignedVehicle: e.target.value })
                  }
                >
                  <MenuItem value="">Select Vehicle</MenuItem>
                  {vehicleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formValues.status || ''}
                  label="Status"
                  onChange={(e) =>
                    setFormValues({ ...formValues, status: e.target.value })
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleSubmit(formValues)} variant="contained" color="primary">
            {selectedDriver ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Driver Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          {selectedDriver && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Name:</TableCell>
                      <TableCell>{selectedDriver.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Driver ID:</TableCell>
                      <TableCell>{selectedDriver.driverId}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>License Number:</TableCell>
                      <TableCell>{selectedDriver.licenseNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Phone:</TableCell>
                      <TableCell>{selectedDriver.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Email:</TableCell>
                      <TableCell>{selectedDriver.email}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Assigned Vehicle:</TableCell>
                      <TableCell>{selectedDriver.assignedVehicle?.vehicleId || 'None'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Vehicle Type:</TableCell>
                      <TableCell>{selectedDriver.assignedVehicle?.type || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Status:</TableCell>
                      <TableCell>{selectedDriver.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Last Location:</TableCell>
                      <TableCell>{selectedDriver.lastLocation || 'N/A'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Driver</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this driver?</Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
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