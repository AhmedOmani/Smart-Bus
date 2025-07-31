import { useState, useEffect } from 'react';
import { api } from '../api';
import {
    Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, CircularProgress, Alert, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Autocomplete, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [parents, setParents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formErrors, setFormErrors] = useState({});
    
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newStudent, setNewStudent] = useState({ nationalId: '', name: '', grade: '', parentId: null });

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/students');
            setStudents(response.data.data.students);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch students.');
        }
        setIsLoading(false);
    };
    
    const fetchParents = async () => {
        try {
            // Corrected to use the /search endpoint
            const response = await api.get('/admin/users/search', { params: { role: 'PARENT' } });
            const parentData = response.data.data.users.map(user => ({
                id: user.parent.id, 
                name: `${user.name} (${user.nationalId})`
            }));
            setParents(parentData);
        } catch (err) {
            console.error("Failed to fetch parents", err);
        }
    };
    
    useEffect(() => {
        fetchStudents();
        fetchParents();
    }, []);

    const handleOpenCreateDialog = () => {
        setFormErrors({});
        setNewStudent({ nationalId: '', name: '', grade: '', parentId: null });
        setOpenCreateDialog(true);
    };

    const handleCreateStudent = async () => {
        try {
            await api.post('/admin/students', {
                ...newStudent,
                parentId: newStudent.parentId?.id
            });
            setOpenCreateDialog(false);
            fetchStudents();
        } catch (err) {
            if (err.response?.data?.error?.code === 'VALIDATION_ERROR') {
                const newErrors = {};
                err.response.data.error.details.forEach(detail => {
                    newErrors[detail.field.split('.').pop()] = detail.message;
                });
                setFormErrors(newErrors);
            } else {
                setError(err.response?.data?.error?.message || 'Failed to create student.');
                setOpenCreateDialog(false);
            }
        }
    };

    const handleOpenEditDialog = (student) => {
        setFormErrors({});
        setEditingStudent({
            ...student,
            parentId: student.parent.id, // Set the parentId for the form
        });
        setOpenEditDialog(true);
    };

    const handleUpdateStudent = async () => {
        if (!editingStudent) return;
        try {
            await api.put(`/admin/students/${editingStudent.id}`, editingStudent);
            setOpenEditDialog(false);
            fetchStudents();
        } catch (err) {
             if (err.response?.data?.error?.code === 'VALIDATION_ERROR') {
                const newErrors = {};
                err.response.data.error.details.forEach(detail => {
                    newErrors[detail.field.split('.').pop()] = detail.message;
                });
                setFormErrors(newErrors);
            } else {
                setError(err.response?.data?.error?.message || 'Failed to update student.');
                setOpenEditDialog(false);
            }
        }
    };

    const confirmDeleteStudent = async () => {
        if (!studentToDelete) return;
        try {
            await api.delete(`/admin/students/${studentToDelete.id}`);
            fetchStudents();
        } catch (err) {
             setError(err.response?.data?.error?.message || 'Failed to delete student.');
        } finally {
            setOpenDeleteDialog(false);
            setStudentToDelete(null);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Student Management</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
                    Create New Student
                </Button>
            </Box>

            {error && <Alert severity="error" onClose={() => setError('')} sx={{my: 2}}>{error}</Alert>}

            <TableContainer component={Paper}>
                {isLoading ? <CircularProgress sx={{m: 5}}/> : (
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
                            <TableRow key={student.id} hover>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.nationalId}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.parent?.user?.name || 'N/A'}</TableCell>
                                <TableCell>{student.bus?.busNumber || 'Unassigned'}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleOpenEditDialog(student)}><EditIcon /></IconButton>
                                    <IconButton size="small" onClick={() => { setStudentToDelete(student); setOpenDeleteDialog(true); }}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </TableContainer>

            {/* Create Student Dialog */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Student</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="National ID" fullWidth value={newStudent.nationalId} onChange={(e) => { setNewStudent({...newStudent, nationalId: e.target.value}); if(formErrors.nationalId) setFormErrors({...formErrors, nationalId: undefined}); }} error={!!formErrors.nationalId} helperText={formErrors.nationalId} />
                    <TextField margin="dense" label="Full Name" fullWidth value={newStudent.name} onChange={(e) => { setNewStudent({...newStudent, name: e.target.value}); if(formErrors.name) setFormErrors({...formErrors, name: undefined}); }} error={!!formErrors.name} helperText={formErrors.name} />
                    <TextField margin="dense" label="Grade" fullWidth value={newStudent.grade} onChange={(e) => { setNewStudent({...newStudent, grade: e.target.value}); if(formErrors.grade) setFormErrors({...formErrors, grade: undefined}); }} error={!!formErrors.grade} helperText={formErrors.grade} />
                    <Autocomplete
                        options={parents}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            setNewStudent({...newStudent, parentId: newValue });
                            if(formErrors.parentId) setFormErrors({...formErrors, parentId: undefined});
                        }}
                        renderInput={(params) => <TextField {...params} margin="dense" label="Search for Parent" error={!!formErrors.parentId} helperText={formErrors.parentId} />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateStudent}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Student Dialog */}
            {editingStudent && (
                 <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" label="National ID" fullWidth value={editingStudent.nationalId} onChange={(e) => { setEditingStudent({...editingStudent, nationalId: e.target.value}); if(formErrors.nationalId) setFormErrors({...formErrors, nationalId: undefined}); }} error={!!formErrors.nationalId} helperText={formErrors.nationalId} />
                        <TextField margin="dense" label="Full Name" fullWidth value={editingStudent.name} onChange={(e) => { setEditingStudent({...editingStudent, name: e.target.value}); if(formErrors.name) setFormErrors({...formErrors, name: undefined}); }} error={!!formErrors.name} helperText={formErrors.name} />
                        <TextField margin="dense" label="Grade" fullWidth value={editingStudent.grade} onChange={(e) => { setEditingStudent({...editingStudent, grade: e.target.value}); if(formErrors.grade) setFormErrors({...formErrors, grade: undefined}); }} error={!!formErrors.grade} helperText={formErrors.grade} />
                        <FormControl fullWidth margin="dense" error={!!formErrors.status}>
                            <InputLabel>Status</InputLabel>
                            <Select value={editingStudent.status} label="Status" onChange={(e) => { setEditingStudent({...editingStudent, status: e.target.value}); if(formErrors.status) setFormErrors({...formErrors, status: undefined}); }}>
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="INACTIVE">Inactive</MenuItem>
                            </Select>
                            {formErrors.status && <p style={{color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0'}}>{formErrors.status}</p>}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleUpdateStudent}>Save Changes</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {studentToDelete && (
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to permanently delete the student: <strong>{studentToDelete.name}</strong>?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={confirmDeleteStudent} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
}

export default StudentManagement; 