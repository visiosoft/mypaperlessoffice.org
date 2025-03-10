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
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface Setting {
  _id: string;
  key: string;
  value: string | number | boolean;
  description: string;
  category: 'General' | 'Currency' | 'Notifications' | 'System';
  isSystem: boolean;
}

interface FormValues {
  key: string;
  value: string | number | boolean;
  description: string;
  category: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    key: '',
    value: '',
    description: '',
    category: 'General',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const categories = ['General', 'Currency', 'Notifications', 'System'];

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAdd = () => {
    setSelectedSetting(null);
    setFormValues({
      key: '',
      value: '',
      description: '',
      category: categories[activeTab],
    });
    setOpenDialog(true);
  };

  const handleEdit = (setting: Setting) => {
    setSelectedSetting(setting);
    setFormValues({
      key: setting.key,
      value: setting.value,
      description: setting.description,
      category: setting.category,
    });
    setOpenDialog(true);
  };

  const handleDelete = (setting: Setting) => {
    setSelectedSetting(setting);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      if (selectedSetting) {
        const response = await fetch(`/api/settings`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: selectedSetting._id,
            ...values,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update setting');
        }

        toast.success('Setting updated successfully');
      } else {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create setting');
        }

        toast.success('Setting created successfully');
      }
      setOpenDialog(false);
      fetchSettings();
    } catch (error: any) {
      console.error('Error saving setting:', error);
      toast.error(error.message || 'Failed to save setting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSetting) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/settings?id=${selectedSetting._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete setting');
      }

      toast.success('Setting deleted successfully');
      setOpenDeleteDialog(false);
      fetchSettings();
    } catch (error: any) {
      console.error('Error deleting setting:', error);
      toast.error(error.message || 'Failed to delete setting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredSettings = settings.filter(
    setting => setting.category === categories[activeTab]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              System Settings
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Setting
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                }
              }}
            >
              {categories.map((category) => (
                <Tab key={category} label={category} />
              ))}
            </Tabs>
          </Paper>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Key</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>System</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSettings.map((setting) => (
                  <TableRow key={setting._id} hover>
                    <TableCell>{setting.key}</TableCell>
                    <TableCell>
                      {typeof setting.value === 'boolean' ? (
                        <Chip
                          label={setting.value ? 'Yes' : 'No'}
                          color={setting.value ? 'success' : 'error'}
                          size="small"
                          sx={{ minWidth: 80 }}
                        />
                      ) : (
                        setting.value
                      )}
                    </TableCell>
                    <TableCell>{setting.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={setting.isSystem ? 'Yes' : 'No'}
                        color={setting.isSystem ? 'primary' : 'default'}
                        size="small"
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!setting.isSystem && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(setting)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(setting)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
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
          {selectedSetting ? 'Edit Setting' : 'Add Setting'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Key"
                value={formValues.key}
                onChange={(e) =>
                  setFormValues({ ...formValues, key: e.target.value })
                }
                required
                disabled={!!selectedSetting}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Value"
                value={formValues.value}
                onChange={(e) =>
                  setFormValues({ ...formValues, value: e.target.value })
                }
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
                required
                multiline
                rows={2}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                value={formValues.category}
                onChange={(e) =>
                  setFormValues({ ...formValues, category: e.target.value })
                }
                required
                disabled={!!selectedSetting}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
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
            {selectedSetting ? 'Update' : 'Create'}
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
        <DialogTitle>Delete Setting</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this setting? This action cannot be undone.
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