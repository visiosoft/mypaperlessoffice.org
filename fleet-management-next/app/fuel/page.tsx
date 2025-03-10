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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/utils/currency';

interface Vehicle {
  _id: string;
  id: string;
  name: string;
  licensePlate: string;
}

interface FuelRecord {
  _id: string;
  fuelId: string;
  vehicle: Vehicle;
  date: string;
  fuelType: string;
  quantity: number;
  unit: string;
  cost: number;
  odometerReading?: number;
  location?: string;
  notes?: string;
}

interface FormValues {
  vehicle: string;
  date: string;
  fuelType: string;
  quantity: string;
  unit: string;
  cost: string;
  odometerReading: string;
  location: string;
  notes: string;
}

interface FuelRecordWithFormattedCost extends FuelRecord {
  formattedCost?: string;
}

export default function Fuel() {
  const [fuelRecords, setFuelRecords] = useState<FuelRecordWithFormattedCost[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    vehicle: '',
    date: new Date().toISOString().split('T')[0],
    fuelType: 'Gasoline',
    quantity: '',
    unit: 'Liters',
    cost: '',
    odometerReading: '',
    location: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [fuelResponse, vehiclesResponse] = await Promise.all([
        fetch('/api/fuel'),
        fetch('/api/vehicles'),
      ]);

      if (!fuelResponse.ok || !vehiclesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [fuelData, vehiclesData] = await Promise.all([
        fuelResponse.json(),
        vehiclesResponse.json(),
      ]);

      // Format the currency for each record
      const formattedRecords = await Promise.all(
        fuelData.map(async (record: FuelRecord) => ({
          ...record,
          formattedCost: await formatCurrency(record.cost)
        }))
      );

      setFuelRecords(formattedRecords);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedRecord(null);
    setFormValues({
      vehicle: '',
      date: new Date().toISOString().split('T')[0],
      fuelType: 'Gasoline',
      quantity: '',
      unit: 'Liters',
      cost: '',
      odometerReading: '',
      location: '',
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = (record: FuelRecord) => {
    setSelectedRecord(record);
    setFormValues({
      vehicle: record.vehicle._id,
      date: new Date(record.date).toISOString().split('T')[0],
      fuelType: record.fuelType,
      quantity: record.quantity.toString(),
      unit: record.unit,
      cost: record.cost.toString(),
      odometerReading: record.odometerReading?.toString() || '',
      location: record.location || '',
      notes: record.notes || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = (record: FuelRecord) => {
    setSelectedRecord(record);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const data = {
        ...values,
        quantity: parseFloat(values.quantity),
        cost: parseFloat(values.cost),
        odometerReading: values.odometerReading ? parseFloat(values.odometerReading) : undefined,
      };

      if (selectedRecord) {
        const response = await fetch(`/api/fuel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: selectedRecord._id,
            ...data,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update fuel record');
        }

        toast.success('Fuel record updated successfully');
      } else {
        const response = await fetch('/api/fuel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create fuel record');
        }

        toast.success('Fuel record created successfully');
      }

      setOpenDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error saving fuel record:', error);
      toast.error('Failed to save fuel record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/fuel?id=${selectedRecord._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete fuel record');
      }

      toast.success('Fuel record deleted successfully');
      setOpenDeleteDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting fuel record:', error);
      toast.error('Failed to delete fuel record');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { id: 'vehicle', label: 'Vehicle', minWidth: 170 },
    { id: 'date', label: 'Date', minWidth: 100 },
    { id: 'fuelType', label: 'Fuel Type', minWidth: 100 },
    { id: 'quantity', label: 'Quantity', minWidth: 100 },
    { id: 'cost', label: 'Cost', minWidth: 100 },
    { id: 'odometerReading', label: 'Odometer', minWidth: 100 },
    { id: 'location', label: 'Location', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 100 },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Fuel Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Fuel Record
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{ fontWeight: 'bold' }}
                      align={column.id === 'actions' ? 'right' : 'left'}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {fuelRecords.map((record) => (
                  <TableRow key={record._id} hover>
                    <TableCell>
                      {record.vehicle?.name} ({record.vehicle?.licensePlate})
                    </TableCell>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.fuelType}</TableCell>
                    <TableCell>
                      {record.quantity} {record.unit}
                    </TableCell>
                    <TableCell>
                      {record.formattedCost || '-'}
                    </TableCell>
                    <TableCell>
                      {record.odometerReading?.toLocaleString() || '-'}
                    </TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(record)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(record)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {selectedRecord ? 'Edit Fuel Record' : 'Add Fuel Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Vehicle"
                value={formValues.vehicle}
                onChange={(e) =>
                  setFormValues({ ...formValues, vehicle: e.target.value })
                }
                required
                disabled={!!selectedRecord}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle._id} value={vehicle._id}>
                    {vehicle.name} ({vehicle.licensePlate})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formValues.date}
                onChange={(e) =>
                  setFormValues({ ...formValues, date: e.target.value })
                }
                required
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Fuel Type"
                value={formValues.fuelType}
                onChange={(e) =>
                  setFormValues({ ...formValues, fuelType: e.target.value })
                }
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="Gasoline">Gasoline</MenuItem>
                <MenuItem value="Diesel">Diesel</MenuItem>
                <MenuItem value="Electric">Electric</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Unit"
                value={formValues.unit}
                onChange={(e) =>
                  setFormValues({ ...formValues, unit: e.target.value })
                }
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="Liters">Liters</MenuItem>
                <MenuItem value="Gallons">Gallons</MenuItem>
                <MenuItem value="kWh">kWh</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={formValues.quantity}
                onChange={(e) =>
                  setFormValues({ ...formValues, quantity: e.target.value })
                }
                required
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Cost"
                value={formValues.cost}
                onChange={(e) =>
                  setFormValues({ ...formValues, cost: e.target.value })
                }
                required
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Odometer Reading"
                value={formValues.odometerReading}
                onChange={(e) =>
                  setFormValues({ ...formValues, odometerReading: e.target.value })
                }
                inputProps={{ min: 0 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formValues.location}
                onChange={(e) =>
                  setFormValues({ ...formValues, location: e.target.value })
                }
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formValues.notes}
                onChange={(e) =>
                  setFormValues({ ...formValues, notes: e.target.value })
                }
                multiline
                rows={2}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit(formValues)}
            disabled={isLoading}
            sx={{ borderRadius: 2 }}
          >
            {selectedRecord ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Delete Fuel Record</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this fuel record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isLoading}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 