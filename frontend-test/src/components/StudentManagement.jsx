import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../api';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    grade: '',
    parentId: '',
    homeAddress: '',
    homeLatitude: '',
    homeLongitude: '',
    busId: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.data.students);
    } catch (error) {
      setErrorMessage(error.response?.data?.error?.message || 'Failed to fetch students.');
    }
  };

  const fetchParents = async () => {
    try {
      const response = await api.get('/admin/users/search?role=PARENT');
      setParents(response.data.data.users);
    } catch (error) {
      console.error("Failed to fetch parents:", error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await api.get('/admin/buses');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClickOpen = (student = null) => {
    setIsEditing(!!student);
    setCurrentStudent(student);
    setFormData(student ? {
      name: student.name,
      nationalId: student.nationalId,
      grade: student.grade,
      parentId: student.parent?.userId || '',
      homeAddress: student.homeAddress || '',
      homeLatitude: student.homeLatitude || '',
      homeLongitude: student.homeLongitude || '',
      busId: student.bus?.id || null,
    } : {
      name: '',
      nationalId: '',
      grade: '',
      parentId: '',
      homeAddress: '',
      homeLatitude: '',
      homeLongitude: '',
      busId: null,
    });
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStudent(null);
  };

  const handleSubmit = async () => {
    // Basic validation
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.nationalId) errors.nationalId = 'National ID is required';
    if (!formData.grade) errors.grade = 'Grade is required';
    if (!formData.parentId) errors.parentId = 'Parent is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const dataPayload = {
      ...formData,
      homeLatitude: formData.homeLatitude ? parseFloat(formData.homeLatitude) : null,
      homeLongitude: formData.homeLongitude ? parseFloat(formData.homeLongitude) : null,
    };

    try {
      if (isEditing) {
        await api.put(`/admin/students/${currentStudent.id}`, dataPayload);
      } else {
        await api.post('/admin/students', dataPayload);
      }
      fetchStudents();
      handleClose();
    } catch (error) {
      const errorDetails = error.response?.data?.error?.details;
      if (errorDetails) {
        let backendErrors = {};
        errorDetails.forEach(detail => {
          const field = detail.field.split('.').pop();
          backendErrors[field] = detail.message;
        });
        setFormErrors(backendErrors);
      } else {
        setFormErrors({ form: error.response?.data?.error?.message || 'An error occurred.' });
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/admin/students/${id}`);
        fetchStudents();
      } catch (error) {
        setErrorMessage(error.response?.data?.error?.message || 'Failed to delete student.');
      }
    }
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Student Management</Typography>
            <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
                Create New Student
            </Button>
        </Box>

      {errorMessage && <Alert severity="error" sx={{ my: 2 }}>{errorMessage}</Alert>}
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>National ID</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Bus</TableCell>
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
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(student)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(student.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Student' : 'Create Student'}</DialogTitle>
        <DialogContent>
          {formErrors.form && <Alert severity="error" sx={{ mb: 2 }}>{formErrors.form}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />
          <TextField
            margin="dense"
            name="nationalId"
            label="National ID"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.nationalId}
            onChange={handleInputChange}
            error={!!formErrors.nationalId}
            helperText={formErrors.nationalId}
            required
          />
          <TextField
            margin="dense"
            name="grade"
            label="Grade"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.grade}
            onChange={handleInputChange}
            error={!!formErrors.grade}
            helperText={formErrors.grade}
            required
          />
          <Autocomplete
            options={parents}
            getOptionLabel={(option) => `${option.name} (${option.nationalId})`}
            value={parents.find(p => p.id === formData.parentId) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, parentId: newValue ? newValue.id : null }));
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Parent"
                variant="outlined"
                error={!!formErrors.parentId}
                helperText={formErrors.parentId}
                required
              />
            )}
          />
          <Autocomplete
            options={buses}
            getOptionLabel={(option) => `${option.busNumber} (Plate: ${option.licensePlate || 'N/A'})`}
            value={buses.find(b => b.id === formData.busId) || null}
            onChange={(event, newValue) => {
              setFormData(prev => ({ ...prev, busId: newValue ? newValue.id : null }));
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Bus"
                variant="outlined"
                error={!!formErrors.busId}
                helperText={formErrors.busId}
              />
            )}
          />
          <TextField
            margin="dense"
            name="homeAddress"
            label="Home Address"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.homeAddress}
            onChange={handleInputChange}
            error={!!formErrors.homeAddress}
            helperText={formErrors.homeAddress}
          />
          <TextField
            margin="dense"
            name="homeLatitude"
            label="Home Latitude"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.homeLatitude}
            onChange={handleInputChange}
            error={!!formErrors.homeLatitude}
            helperText={formErrors.homeLatitude}
          />
          <TextField
            margin="dense"
            name="homeLongitude"
            label="Home Longitude"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.homeLongitude}
            onChange={handleInputChange}
            error={!!formErrors.homeLongitude}
            helperText={formErrors.homeLongitude}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentManagement; 