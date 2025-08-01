import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert,
    Autocomplete,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    DialogContentText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api';

const BusManagement = () => {
    const [buses, setBuses] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [newBus, setNewBus] = useState({
        busNumber: '',
        capacity: '',
        model: '',
        year: '',
        licensePlate: '',
        driverName: '',
        driverPhone: '',
        driverLicenseNumber: '',
        supervisorId: null,
        status: 'ACTIVE',
    });
    const [formErrors, setFormErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchBuses = async () => {
        try {
            const response = await api.getBuses();
            setBuses(response.data.data.buses);
        } catch (error) {
            console.error("Failed to fetch buses:", error);
            setErrorMessage('Failed to load buses.');
        }
    };

    const fetchSupervisors = async () => {
      try {
        const response = await api.searchUsers('SUPERVISOR', "");
        setSupervisors(response.data.data.users);
      } catch (error) {
        console.error("Failed to fetch supervisors:", error);
      }
    };


    useEffect(() => {
        fetchBuses();
        fetchSupervisors();
    }, []);

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
        setFormErrors({});
        setNewBus({
            busNumber: '',
            capacity: '',
            model: '',
            year: '',
            licensePlate: '',
            driverName: '',
            driverPhone: '',
            driverLicenseNumber: '',
            supervisorId: null,
            status: 'ACTIVE',
        });
    };

    const handleOpenDialog = (bus = null) => {
        setFormData(bus ? { ...bus, supervisorId: bus.supervisor?.id || null, status: bus.status || 'ACTIVE' } : {
            busNumber: '',
            capacity: '',
            model: '',
            year: '',
            licensePlate: '',
            driverName: '',
            driverPhone: '',
            driverLicenseNumber: '',
            supervisorId: null,
            status: 'ACTIVE'
        });
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenCreateDialog(false);
    };

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'new') {
            setNewBus(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCreateBus = async () => {
        const payload = {
            ...newBus,
            capacity: Number(newBus.capacity),
            year: newBus.year ? Number(newBus.year) : null,
            licensePlate: newBus.licensePlate || null,
            model: newBus.model || null,
            driverName: newBus.driverName || null,
            driverPhone: newBus.driverPhone || null,
            driverLicenseNumber: newBus.driverLicenseNumber || null,
            supervisorId: newBus.supervisorId || null,
        };

        console.log(payload);

        try {
            await api.createBus(payload);
            fetchBuses();
            handleCloseDialog();
        } catch (error) {
            console.error("Failed to create bus:", error);
            const errors = error.response?.data?.error?.details?.reduce((acc, curr) => {
                acc[curr.field.split('.').pop()] = curr.message;
                return acc;
            }, {});
            setFormErrors(errors || {});
            setErrorMessage(error.response?.data?.error?.message || 'Failed to create bus.');
        }
    };


    const handleSave = async () => {
        const payload = {
            ...formData,
            capacity: Number(formData.capacity),
            year: formData.year ? Number(formData.year) : null,
            licensePlate: formData.licensePlate || null,
            model: formData.model || null,
            status: formData.status || 'ACTIVE',
            driverName: formData.driverName || null,
            driverPhone: formData.driverPhone || null,
            driverLicenseNumber: formData.driverLicenseNumber || null,
            supervisorId: formData.supervisorId || null,
        };

        try {
            if (formData.id) {
                await api.updateBus(formData.id, payload);
            }
            fetchBuses();
            handleCloseDialog();
        } catch (error) {
            console.error("Failed to save bus:", error);
            const errors = error.response?.data?.error?.details?.reduce((acc, curr) => {
                acc[curr.field.split('.').pop()] = curr.message;
                return acc;
            }, {});
            setFormErrors(errors || {});
            setErrorMessage(error.response?.data?.error?.message || 'Failed to save bus.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await api.deleteBus(id);
                fetchBuses();
            } catch (error) {
                console.error("Failed to delete bus:", error);
                setErrorMessage('Failed to delete bus.');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Bus Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                    Create Bus
                </Button>
            </Box>
            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bus Number</TableCell>
                            <TableCell>Capacity</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Supervisor</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buses.map((bus) => (
                            <TableRow key={bus.id}>
                                <TableCell>{bus.busNumber}</TableCell>
                                <TableCell>{bus.capacity}</TableCell>
                                <TableCell>{bus.status}</TableCell>
                                <TableCell>{bus.supervisor?.user?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(bus)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(bus.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Dialog */}
            <Dialog open={openCreateDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create New Bus</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Bus Number" fullWidth value={newBus.busNumber} onChange={(e) => handleInputChange(e, 'new')} name="busNumber" error={!!formErrors.busNumber} helperText={formErrors.busNumber} placeholder="e.g., Bus 7" />
                    <TextField margin="dense" label="License Plate" fullWidth value={newBus.licensePlate} onChange={(e) => handleInputChange(e, 'new')} name="licensePlate" error={!!formErrors.licensePlate} helperText={formErrors.licensePlate} placeholder="e.g., 9989 ص ب" />
                    <TextField margin="dense" label="Capacity" fullWidth value={newBus.capacity} onChange={(e) => handleInputChange(e, 'new')} name="capacity" type="number" error={!!formErrors.capacity} helperText={formErrors.capacity} />
                    <FormControl fullWidth margin="dense" error={!!formErrors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newBus.status}
                            label="Status"
                            onChange={(e) => handleInputChange(e, 'new')}
                            name="status"
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                        </Select>
                        {formErrors.status && <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{formErrors.status}</p>}
                    </FormControl>
                    <Autocomplete
                        options={supervisors}
                        getOptionLabel={(option) => `${option.name} (${option.nationalId})`}
                        value={supervisors.find(s => s.supervisor?.id === newBus.supervisorId) || null}
                        onChange={(event, newValue) => {
                            setNewBus(prev => ({ ...prev, supervisorId: newValue ? newValue.supervisor.id : null }));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Supervisor" variant="outlined" error={!!formErrors.supervisorId} helperText={formErrors.supervisorId} />
                        )}
                    />
                    <TextField margin="dense" label="Model" fullWidth value={newBus.model} onChange={(e) => handleInputChange(e, 'new')} name="model" error={!!formErrors.model} helperText={formErrors.model} />
                    <TextField margin="dense" label="Year" fullWidth value={newBus.year} onChange={(e) => handleInputChange(e, 'new')} name="year" type="number" error={!!formErrors.year} helperText={formErrors.year} />
                    
                    <TextField margin="dense" label="Driver Name" fullWidth value={newBus.driverName} onChange={(e) => handleInputChange(e, 'new')} name="driverName" error={!!formErrors.driverName} helperText={formErrors.driverName} />
                    <TextField margin="dense" label="Driver Phone" fullWidth value={newBus.driverPhone} onChange={(e) => handleInputChange(e, 'new')} name="driverPhone" error={!!formErrors.driverPhone} helperText={formErrors.driverPhone} />
                    <TextField margin="dense" label="Driver License Number" fullWidth value={newBus.driverLicenseNumber} onChange={(e) => handleInputChange(e, 'new')} name="driverLicenseNumber" error={!!formErrors.driverLicenseNumber} helperText={formErrors.driverLicenseNumber} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCreateBus}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Bus</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill in the details of the bus you want to edit.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" label="Bus Number" fullWidth value={formData.busNumber || ''} onChange={(e) => handleInputChange(e, 'edit')} name="busNumber" error={!!formErrors.busNumber} helperText={formErrors.busNumber} placeholder="e.g., Bus 7" />
                    <TextField margin="dense" label="Capacity" fullWidth value={formData.capacity || ''} onChange={(e) => handleInputChange(e, 'edit')} name="capacity" type="number" error={!!formErrors.capacity} helperText={formErrors.capacity} />
                    <FormControl fullWidth margin="dense" error={!!formErrors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={formData.status || 'ACTIVE'}
                            label="Status"
                            onChange={(e) => handleInputChange(e, 'edit')}
                            name="status"
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                        </Select>
                        {formErrors.status && <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{formErrors.status}</p>}
                    </FormControl>
                    <Autocomplete
                        options={supervisors}
                        getOptionLabel={(option) => `${option.name} (${option.nationalId})`}
                        value={supervisors.find(s => s.supervisor?.id === formData.supervisorId) || null}
                        onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, supervisorId: newValue ? newValue.supervisor.id : null }));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Supervisor" variant="outlined" error={!!formErrors.supervisorId} helperText={formErrors.supervisorId} />
                        )}
                    />
                    <TextField margin="dense" label="Model" fullWidth value={formData.model || ''} onChange={(e) => handleInputChange(e, 'edit')} name="model" error={!!formErrors.model} helperText={formErrors.model} />
                    <TextField margin="dense" label="Year" fullWidth value={formData.year || ''} onChange={(e) => handleInputChange(e, 'edit')} name="year" type="number" error={!!formErrors.year} helperText={formErrors.year} />
                    <TextField margin="dense" label="License Plate" fullWidth value={formData.licensePlate || ''} onChange={(e) => handleInputChange(e, 'edit')} name="licensePlate" error={!!formErrors.licensePlate} helperText={formErrors.licensePlate} placeholder="e.g., 9989 ص ب" />
                    <TextField margin="dense" label="Driver Name" fullWidth value={formData.driverName || ''} onChange={(e) => handleInputChange(e, 'edit')} name="driverName" error={!!formErrors.driverName} helperText={formErrors.driverName} />
                    <TextField margin="dense" label="Driver Phone" fullWidth value={formData.driverPhone || ''} onChange={(e) => handleInputChange(e, 'edit')} name="driverPhone" error={!!formErrors.driverPhone} helperText={formErrors.driverPhone} />
                    <TextField margin="dense" label="Driver License Number" fullWidth value={formData.driverLicenseNumber || ''} onChange={(e) => handleInputChange(e, 'edit')} name="driverLicenseNumber" error={!!formErrors.driverLicenseNumber} helperText={formErrors.driverLicenseNumber} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BusManagement; 