'use client';

import React, { useState, useEffect } from 'react';
import './vehicles.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface Driver {
  id: string;
  driverId: string;
  label: string;
}

interface Vehicle {
  id: string;
  name: string;
  type: string;
  model: string;
  year: number;
  licensePlate: string;
  driver: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  lastLocation: string;
  capacity: string;
  currentMileage: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

interface VehicleFormData {
  id: string;
  name: string;
  type: string;
  model: string;
  year: number;
  licensePlate: string;
  driver: string;
  status: string;
  capacity: string;
  currentMileage: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

const initialFormData: VehicleFormData = {
  id: '',
  name: '',
  type: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  driver: '',
  status: 'Active',
  capacity: '',
  currentMileage: '',
  lastMaintenance: '',
  nextMaintenance: '',
};

// Update the Delete Modal content
const DeleteModalContent = ({ vehicle }: { vehicle: Vehicle }) => (
  <div className="delete-modal-content">
    <div className="delete-warning-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8L12 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 16L12 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </div>
    <div style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--odoo-dark)' }}>
      Are you sure you want to delete <strong>{vehicle.name}</strong>?
    </div>
    <div style={{ color: 'var(--odoo-gray-dark)', fontSize: '0.95rem', lineHeight: '1.5' }}>
      This action cannot be undone and will permanently remove the vehicle from the system.
      All associated data will be deleted.
    </div>
  </div>
);

// Update the View Modal content
const ViewModalContent = ({ vehicle, drivers }: { vehicle: Vehicle, drivers: Driver[] }) => {
  // Find the driver's label from the drivers list
  const driverLabel = drivers.find(d => d.id === vehicle.driver)?.label || 'Not Assigned';
  
  return (
    <div className="view-modal-content">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <div className="section-title">
            Vehicle Information
            <div style={{ fontSize: '0.9rem', color: 'var(--odoo-gray-dark)', fontWeight: 'normal', marginTop: '0.25rem' }}>
              Basic details about the vehicle
            </div>
          </div>
          <table className="info-table">
            <tbody>
              <tr>
                <th>Vehicle ID</th>
                <td>{vehicle.id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{vehicle.name}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{vehicle.type}</td>
              </tr>
              <tr>
                <th>Model</th>
                <td>{vehicle.model}</td>
              </tr>
              <tr>
                <th>Year</th>
                <td>{vehicle.year}</td>
              </tr>
              <tr>
                <th>License Plate</th>
                <td>{vehicle.licensePlate}</td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="section-title">
            Status & Maintenance
            <div style={{ fontSize: '0.9rem', color: 'var(--odoo-gray-dark)', fontWeight: 'normal', marginTop: '0.25rem' }}>
              Current status and maintenance schedule
            </div>
          </div>
          <table className="info-table">
            <tbody>
              <tr>
                <th>Status</th>
                <td>
                  <span className={`status-badge status-${vehicle.status.toLowerCase()}`}>
                    {vehicle.status}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Driver</th>
                <td>{driverLabel}</td>
              </tr>
              <tr>
                <th>Current Mileage</th>
                <td style={{ color: 'var(--odoo-primary)', fontWeight: '600' }}>
                  {vehicle.currentMileage} km
                </td>
              </tr>
              <tr>
                <th>Capacity</th>
                <td>{vehicle.capacity}</td>
              </tr>
              <tr>
                <th>Last Maintenance</th>
                <td>{new Date(vehicle.lastMaintenance).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</td>
              </tr>
              <tr>
                <th>Next Maintenance</th>
                <td style={{ color: getMaintenanceStatusColor(vehicle.nextMaintenance) }}>
                  {new Date(vehicle.nextMaintenance).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Grid>
    </div>
  );
};

// Helper function to determine maintenance status color
const getMaintenanceStatusColor = (nextMaintenance: string) => {
  const today = new Date();
  const maintenance = new Date(nextMaintenance);
  const diffDays = Math.ceil((maintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'var(--odoo-danger)';
  if (diffDays <= 7) return '#ff9800';
  return 'var(--odoo-success)';
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/drivers/list');
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

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data);
      setTotalPages(Math.ceil(data.length / 10));
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add vehicle');
      }
      fetchVehicles();
      setAddModalOpen(false);
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add vehicle');
    }
  };

  const handleEditVehicle = async (formData: VehicleFormData) => {
    try {
      setIsLoading(true);
      
      if (!selectedVehicle?._id) {
        throw new Error('No vehicle selected for editing');
      }

      const response = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: selectedVehicle._id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update vehicle');
      }

      const updatedVehicle = await response.json();
      
      // Update the vehicles list with the new data
      setVehicles(vehicles.map(v => 
        v._id === updatedVehicle._id ? updatedVehicle : v
      ));
      
      // Close the modal and reset form
      setEditModalOpen(false);
      setFormData(initialFormData);
      toast.success('Vehicle updated successfully');
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      toast.error(error.message || 'Failed to update vehicle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      fetchVehicles();
      setDeleteModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    // Make sure to set all the form fields, including the driver
    setFormData({
      ...vehicle,
      driver: vehicle.driver || ''  // Ensure driver is a string, even if empty
    });
    setEditModalOpen(true);
  };

  const handleDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteModalOpen(true);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Card>
          <CardContent>
            <h4 className="h4 text-danger">Error: {error}</h4>
            <Button variant="contained" onClick={fetchVehicles} className="mt-3">
              Retry
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <>
      <div className="vehicles-header">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Vehicles Management</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="filters-card">
        <div className="card-body">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <div className="search-box">
                <TextField
                  fullWidth
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth className="filter-select">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth className="filter-select">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Truck">Truck</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                className="filter-button"
                startIcon={<FilterIcon />}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </div>
      </Card>

      {/* Vehicles Table */}
      <Card className="vehicles-table-card">
        <div className="card-body">
          <TableContainer>
            <Table className="vehicles-table">
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No vehicles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.id}</TableCell>
                      <TableCell>{vehicle.name}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                      <TableCell>
                        <span className={`status-badge status-${vehicle.status.toLowerCase()}`}>
                          {vehicle.status}
                        </span>
                      </TableCell>
                      <TableCell>{vehicle.lastLocation}</TableCell>
                      <TableCell>
                        <div className="action-buttons">
                          <IconButton
                            className="action-button"
                            onClick={() => handleView(vehicle)}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            className="action-button"
                            onClick={() => handleEdit(vehicle)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className="action-button delete-button"
                            onClick={() => handleDelete(vehicle)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="pagination-container">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    &laquo;
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${page === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </Card>

      {/* Add Vehicle Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 400
        }}
      >
        <DialogTitle>
          <div style={{ position: 'relative', zIndex: 1 }}>
            Add New Vehicle
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem', fontWeight: 'normal' }}>
              Enter the details of the new vehicle
            </div>
          </div>
          <IconButton
            onClick={() => setAddModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Vehicle ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="Truck">Truck</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="License Plate"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <FormControl fullWidth>
                <InputLabel>Driver</InputLabel>
                <Select
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  label="Driver"
                >
                  <MenuItem value="">Select Driver</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Current Mileage"
                value={formData.currentMileage}
                onChange={(e) => setFormData({ ...formData, currentMileage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                type="date"
                label="Last Maintenance"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                type="date"
                label="Next Maintenance"
                value={formData.nextMaintenance}
                onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddVehicle}>
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Vehicle Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div style={{ position: 'relative', zIndex: 1 }}>
            Vehicle Details
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem', fontWeight: 'normal' }}>
              Complete information about the vehicle
            </div>
          </div>
          <IconButton
            onClick={() => setViewModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedVehicle && <ViewModalContent vehicle={selectedVehicle} drivers={drivers} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={() => {
              setViewModalOpen(false);
              handleEdit(selectedVehicle!);
            }}
          >
            Edit Vehicle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Vehicle Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Vehicle
          <IconButton
            onClick={() => setEditModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Vehicle ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="Truck">Truck</MenuItem>
                  <MenuItem value="Van">Van</MenuItem>
                  <MenuItem value="Car">Car</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="License Plate"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <FormControl fullWidth>
                <InputLabel>Driver</InputLabel>
                <Select
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  label="Driver"
                >
                  <MenuItem value="">Select Driver</MenuItem>
                  {drivers.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                label="Current Mileage"
                value={formData.currentMileage}
                onChange={(e) => setFormData({ ...formData, currentMileage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                type="date"
                label="Last Maintenance"
                value={formData.lastMaintenance}
                onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6} className="form-field">
              <TextField
                fullWidth
                type="date"
                label="Next Maintenance"
                value={formData.nextMaintenance}
                onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditModalOpen(false);
            setFormData(initialFormData);
          }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleEditVehicle(formData)}
            disabled={!formData.name || !formData.type || !formData.model || !formData.licensePlate}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Vehicle Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Vehicle
          <IconButton
            onClick={() => setDeleteModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedVehicle && <DeleteModalContent vehicle={selectedVehicle} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteVehicle}>
            Delete Vehicle
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 