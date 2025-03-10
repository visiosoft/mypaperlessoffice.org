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
  Chip,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

interface Document {
  type: 'License' | 'Insurance' | 'Registration' | 'Other';
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
}

interface HistoryEntry {
  action: string;
  date: string;
  details: string;
  previousEndDate?: string;
  newEndDate?: string;
}

interface Contract {
  _id: string;
  contractId: string;
  companyName: string;
  licenseNumber: string;
  contractStartDate: string;
  contractEndDate: string;
  isExtended: boolean;
  allowedStates: string[];
  documents: Document[];
  status: 'Active' | 'Expired' | 'Terminated' | 'Extended';
  history: HistoryEntry[];
  notes?: string;
}

interface FormValues {
  companyName: string;
  licenseNumber: string;
  contractStartDate: string;
  contractEndDate: string;
  allowedStates: string[];
  notes: string;
}

const DOCUMENT_TYPES = ['License', 'Insurance', 'Registration', 'Other'];
const CONTRACT_STATUSES = ['Active', 'Expired', 'Terminated', 'Extended'];
const STATES = [
  'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
  'Uttar Pradesh', 'West Bengal', 'Telangana', 'Rajasthan',
  // Add more states as needed
];

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [openDocumentsDialog, setOpenDocumentsDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({
    companyName: '',
    licenseNumber: '',
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: '',
    allowedStates: [],
    notes: '',
  });

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/contracts');
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('Failed to fetch contracts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleAdd = () => {
    setSelectedContract(null);
    setFormValues({
      companyName: '',
      licenseNumber: '',
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: '',
      allowedStates: [],
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setFormValues({
      companyName: contract.companyName,
      licenseNumber: contract.licenseNumber,
      contractStartDate: new Date(contract.contractStartDate).toISOString().split('T')[0],
      contractEndDate: new Date(contract.contractEndDate).toISOString().split('T')[0],
      allowedStates: contract.allowedStates,
      notes: contract.notes || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = (contract: Contract) => {
    setSelectedContract(contract);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const method = selectedContract ? 'PUT' : 'POST';
      const url = '/api/contracts';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          _id: selectedContract?._id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save contract');
      }

      toast.success(`Contract ${selectedContract ? 'updated' : 'created'} successfully`);
      setOpenDialog(false);
      fetchContracts();
    } catch (error) {
      console.error('Error saving contract:', error);
      toast.error('Failed to save contract');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedContract) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/contracts?id=${selectedContract._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contract');
      }

      toast.success('Contract deleted successfully');
      setOpenDeleteDialog(false);
      fetchContracts();
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('Failed to delete contract');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = (contract: Contract) => {
    setSelectedContract(contract);
    setOpenHistoryDialog(true);
  };

  const handleViewDocuments = (contract: Contract) => {
    setSelectedContract(contract);
    setOpenDocumentsDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expired':
        return 'error';
      case 'Terminated':
        return 'error';
      case 'Extended':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Company Contracts
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              Add Contract
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contract ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>License Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract._id} hover>
                    <TableCell>{contract.contractId}</TableCell>
                    <TableCell>{contract.companyName}</TableCell>
                    <TableCell>{contract.licenseNumber}</TableCell>
                    <TableCell>
                      {new Date(contract.contractStartDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(contract.contractEndDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={contract.status}
                        color={getStatusColor(contract.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(contract)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Documents">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDocuments(contract)}
                          sx={{ mr: 1 }}
                        >
                          <DescriptionIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="History">
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(contract)}
                          sx={{ mr: 1 }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(contract)}
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {selectedContract ? 'Edit Contract' : 'Add Contract'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formValues.companyName}
                onChange={(e) =>
                  setFormValues({ ...formValues, companyName: e.target.value })
                }
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                value={formValues.licenseNumber}
                onChange={(e) =>
                  setFormValues({ ...formValues, licenseNumber: e.target.value })
                }
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formValues.contractStartDate}
                onChange={(e) =>
                  setFormValues({ ...formValues, contractStartDate: e.target.value })
                }
                required
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formValues.contractEndDate}
                onChange={(e) =>
                  setFormValues({ ...formValues, contractEndDate: e.target.value })
                }
                required
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Allowed States"
                value={formValues.allowedStates}
                onChange={(e) => {
                  const value = e.target.value as string[];
                  setFormValues({ ...formValues, allowedStates: value });
                }}
                required
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {STATES.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
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
                rows={3}
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
            {selectedContract ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Contract History</DialogTitle>
        <DialogContent>
          <List>
            {selectedContract?.history.map((entry, index) => (
              <ListItem key={index} divider={index < (selectedContract?.history.length || 0) - 1}>
                <ListItemText
                  primary={entry.action}
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(entry.date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2">{entry.details}</Typography>
                      {entry.previousEndDate && entry.newEndDate && (
                        <Typography variant="body2" color="textSecondary">
                          Extended from {new Date(entry.previousEndDate).toLocaleDateString()} to{' '}
                          {new Date(entry.newEndDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenHistoryDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog
        open={openDocumentsDialog}
        onClose={() => setOpenDocumentsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Contract Documents</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="View Documents" />
              <Tab label="Upload Document" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <List>
              {selectedContract?.documents.map((doc, index) => (
                <ListItem key={index} divider={index < (selectedContract?.documents.length || 0) - 1}>
                  <ListItemText
                    primary={doc.fileName}
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Type: {doc.type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </Typography>
                        {doc.expiryDate && (
                          <Typography variant="body2" color="textSecondary">
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      href={doc.fileUrl}
                      target="_blank"
                      sx={{ borderRadius: 2 }}
                    >
                      View
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Document Type"
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {DOCUMENT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expiry Date (Optional)"
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Upload Document
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDocumentsDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Delete Contract</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this contract? This action cannot be undone.
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