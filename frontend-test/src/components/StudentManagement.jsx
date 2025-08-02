import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert,
    Autocomplete, Select, MenuItem, InputLabel, FormControl, DialogContentText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [buses, setBuses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [formData, setFormData] = useState({});
    const [newStudent, setNewStudent] = useState({
        nationalId: '',
        name: '',
        grade: '',
        homeAddress: '',
        homeLatitude: '',
        homeLongitude: '',
        parentId: null,
        busId: null,
        status: 'ACTIVE',
    });
    const [formErrors, setFormErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchStudents = async () => {
        try {
            const response = await api.getStudents();
            setStudents(response.data.data.students);
        } catch (error) {
            console.error("Failed to fetch students:", error);
            setErrorMessage('Failed to load students.');
        }
    };

    const fetchParents = async () => {
        try {
            const response = await api.searchUsers('PARENT', "");
            setParents(response.data.data.users);
        } catch (error) {
            console.error("Failed to fetch parents:", error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await api.getBuses();
            setBuses(response.data.data.buses);
        } catch (error) {
            console.error("Failed to fetch buses:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchParents();
        fetchBuses();
    }, []);

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
        setFormErrors({});
        setNewStudent({
            nationalId: '',
            name: '',
            grade: '',
            homeAddress: '',
            homeLatitude: '',
            homeLongitude: '',
            parentId: null,
            busId: null,
            status: 'ACTIVE',
        });
    };

    const handleOpenDialog = (student = null) => {
        setFormData(student ? { 
            ...student, 
            parentId: student.parent?.user?.id || null,
            busId: student.bus?.id || null,
            status: student.status || 'ACTIVE'
        } : {
            nationalId: '',
            name: '',
            grade: '',
            homeAddress: '',
            homeLatitude: '',
            homeLongitude: '',
            parentId: null,
            busId: null,
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
            setNewStudent(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCreateStudent = async () => {
        const payload = {
            ...newStudent,
            homeLatitude: newStudent.homeLatitude ? Number(newStudent.homeLatitude) : null,
            homeLongitude: newStudent.homeLongitude ? Number(newStudent.homeLongitude) : null,
            homeAddress: newStudent.homeAddress || null,
            parentId: newStudent.parentId || null,
            busId: newStudent.busId || null,
        };

        try {
            await api.createStudent(payload);
            fetchStudents();
            handleCloseDialog();
        } catch (error) {
            console.error("Failed to create student:", error);
            const errors = error.response?.data?.error?.details?.reduce((acc, curr) => {
                acc[curr.field.split('.').pop()] = curr.message;
                return acc;
            }, {});
            setFormErrors(errors || {});
            setErrorMessage(error.response?.data?.error?.message || 'Failed to create student.');
        }
    };

    const handleSave = async () => {
        const payload = {
            ...formData,
            homeLatitude: formData.homeLatitude ? Number(formData.homeLatitude) : null,
            homeLongitude: formData.homeLongitude ? Number(formData.homeLongitude) : null,
            homeAddress: formData.homeAddress || null,
            parentId: formData.parentId || null,
            busId: formData.busId || null,
            status: formData.status || 'ACTIVE',
        };

        try {
            if (formData.id) {
                await api.updateStudent(formData.id, payload);
            }
            fetchStudents();
            handleCloseDialog();
        } catch (error) {
            console.error("Failed to save student:", error);
            const errors = error.response?.data?.error?.details?.reduce((acc, curr) => {
                acc[curr.field.split('.').pop()] = curr.message;
                return acc;
            }, {});
            setFormErrors(errors || {});
            setErrorMessage(error.response?.data?.error?.message || 'Failed to save student.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.deleteStudent(id);
                fetchStudents();
            } catch (error) {
                console.error("Failed to delete student:", error);
                setErrorMessage('Failed to delete student.');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Student Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                    Add Student
                </Button>
            </Box>
            {errorMessage && <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>National ID</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Parent</TableCell>
                            <TableCell>Bus</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.nationalId}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.parent?.user?.name || 'N/A'}</TableCell>
                                <TableCell>{student.bus?.busNumber || 'N/A'}</TableCell>
                                <TableCell>{student.status}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(student)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(student.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Dialog */}
            <Dialog open={openCreateDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="National ID" fullWidth value={newStudent.nationalId} onChange={(e) => handleInputChange(e, 'new')} name="nationalId" error={!!formErrors.nationalId} helperText={formErrors.nationalId} placeholder="e.g., 12345678" />
                    <TextField margin="dense" label="Full Name" fullWidth value={newStudent.name} onChange={(e) => handleInputChange(e, 'new')} name="name" error={!!formErrors.name} helperText={formErrors.name} />
                    <TextField margin="dense" label="Grade" fullWidth value={newStudent.grade} onChange={(e) => handleInputChange(e, 'new')} name="grade" error={!!formErrors.grade} helperText={formErrors.grade} placeholder="e.g., Grade 5" />
                    <TextField margin="dense" label="Home Address" fullWidth value={newStudent.homeAddress} onChange={(e) => handleInputChange(e, 'new')} name="homeAddress" error={!!formErrors.homeAddress} helperText={formErrors.homeAddress} />
                    <TextField margin="dense" label="Home Latitude" fullWidth value={newStudent.homeLatitude} onChange={(e) => handleInputChange(e, 'new')} name="homeLatitude" type="number" step="any" error={!!formErrors.homeLatitude} helperText={formErrors.homeLatitude} />
                    <TextField margin="dense" label="Home Longitude" fullWidth value={newStudent.homeLongitude} onChange={(e) => handleInputChange(e, 'new')} name="homeLongitude" type="number" step="any" error={!!formErrors.homeLongitude} helperText={formErrors.homeLongitude} />
                    
                    <Autocomplete
                        options={parents}
                        getOptionLabel={(option) => `${option.name} (${option.nationalId})`}
                        value={parents.find(p => p.id === newStudent.parentId) || null}
                        onChange={(event, newValue) => {
                            setNewStudent(prev => ({ ...prev, parentId: newValue ? newValue.id : null }));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Parent" variant="outlined" error={!!formErrors.parentId} helperText={formErrors.parentId} />
                        )}
                    />

                    <Autocomplete
                        options={buses}
                        getOptionLabel={(option) => `${option.busNumber} - ${option.licensePlate || 'No Plate'}`}
                        value={buses.find(b => b.id === newStudent.busId) || null}
                        onChange={(event, newValue) => {
                            setNewStudent(prev => ({ ...prev, busId: newValue ? newValue.id : null }));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Bus (Optional)" variant="outlined" error={!!formErrors.busId} helperText={formErrors.busId} />
                        )}
                    />

                    <FormControl fullWidth margin="dense" error={!!formErrors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newStudent.status}
                            label="Status"
                            onChange={(e) => handleInputChange(e, 'new')}
                            name="status"
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                        </Select>
                        {formErrors.status && <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{formErrors.status}</p>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleCreateStudent}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill in the details of the student you want to edit.
                    </DialogContentText>
                    <TextField autoFocus margin="dense" label="National ID" fullWidth value={formData.nationalId || ''} onChange={(e) => handleInputChange(e, 'edit')} name="nationalId" error={!!formErrors.nationalId} helperText={formErrors.nationalId} />
                    <TextField margin="dense" label="Full Name" fullWidth value={formData.name || ''} onChange={(e) => handleInputChange(e, 'edit')} name="name" error={!!formErrors.name} helperText={formErrors.name} />
                    <TextField margin="dense" label="Grade" fullWidth value={formData.grade || ''} onChange={(e) => handleInputChange(e, 'edit')} name="grade" error={!!formErrors.grade} helperText={formErrors.grade} />
                    <TextField margin="dense" label="Home Address" fullWidth value={formData.homeAddress || ''} onChange={(e) => handleInputChange(e, 'edit')} name="homeAddress" error={!!formErrors.homeAddress} helperText={formErrors.homeAddress} />
                    <TextField margin="dense" label="Home Latitude" fullWidth value={formData.homeLatitude || ''} onChange={(e) => handleInputChange(e, 'edit')} name="homeLatitude" type="number" step="any" error={!!formErrors.homeLatitude} helperText={formErrors.homeLatitude} />
                    <TextField margin="dense" label="Home Longitude" fullWidth value={formData.homeLongitude || ''} onChange={(e) => handleInputChange(e, 'edit')} name="homeLongitude" type="number" step="any" error={!!formErrors.homeLongitude} helperText={formErrors.homeLongitude} />
                    
                    <Autocomplete
                        options={parents}
                        getOptionLabel={(option) => `${option.name} (${option.nationalId})`}
                        value={parents.find(p => p.id === formData.parentId) || null}
                        onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, parentId: newValue ? newValue.id : null }));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Parent" variant="outlined" error={!!formErrors.parentId} helperText={formErrors.parentId} />
                        )}
                    />

                    <Autocomplete
                        options={buses}
                        getOptionLabel={(option) => `${option.busNumber} - ${option.licensePlate || 'No Plate'}`}
                        value={buses.find(b => b.id === formData.busId) || null}
                        onChange={(event, newValue) => {
                            setFormData(prev => ({ ...prev, busId: newValue ? newValue.id : null }));
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Bus (Optional)" variant="outlined" error={!!formErrors.busId} helperText={formErrors.busId} />
                        )}
                    />

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
                        </Select>
                        {formErrors.status && <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{formErrors.status}</p>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentManagement; 