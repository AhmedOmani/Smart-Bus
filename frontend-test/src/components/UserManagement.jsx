import { useState, useEffect } from 'react';
import api from '../api';
import {
    Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, CircularProgress, Alert, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newUser, setNewUser] = useState({ nationalId: '', name: '', email: '', role: 'PARENT', phone: '' });
    const [formErrors, setFormErrors] = useState({});

    const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
    const [newCredentials, setNewCredentials] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.getUsers();
            setUsers(response.data.data.users);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenCreateDialog = () => {
        setFormErrors({});
        setNewUser({ nationalId: '', name: '', email: '', role: 'PARENT', phone: '' });
        setOpenCreateDialog(true);
    };

    const handleCreateUser = async () => {
        try {
            const response = await api.createUser(newUser);
            setOpenCreateDialog(false);
            fetchUsers();
            setNewCredentials(response.data.data.credentials);
            setShowCredentialsDialog(true);
        } catch (err) {
            if (err.response?.data?.error?.code === 'VALIDATION_ERROR') {
                const newErrors = {};
                err.response.data.error.details.forEach(detail => {
                    const fieldName = detail.field.split('.').pop(); // 'body.name' -> 'name'
                    newErrors[fieldName] = detail.message;
                });
                setFormErrors(newErrors);
            } else {
                setError(err.response?.data?.error?.message || 'Failed to create user.');
                setOpenCreateDialog(false);
            }
        }
    };
    
    // Implement similar logic for handleUpdateUser
    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            const response = await api.updateUser(editingUser.id, editingUser);
            setOpenEditDialog(false);
            fetchUsers();
        } catch (err) {
             if (err.response?.data?.error?.code === 'VALIDATION_ERROR') {
                const newErrors = {};
                err.response.data.error.details.forEach(detail => {
                    const fieldName = detail.field.split('.').pop();
                    newErrors[fieldName] = detail.message;
                });
                setFormErrors(newErrors);
            } else {
                setError(err.response?.data?.error?.message || 'Failed to update user.');
                setOpenEditDialog(false);
            }
        }
    };
    
    const handleOpenEditDialog = (user) => {
        setFormErrors({});
        setEditingUser(user);
        setOpenEditDialog(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await api.deleteUser(userToDelete.id);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to delete user.');
        } finally {
            setOpenDeleteDialog(false);
            setUserToDelete(null);
        }
    };

    const handleCopyToClipboard = () => {
        if (newCredentials) {
            navigator.clipboard.writeText(`Username: ${newCredentials.username}\nPassword: ${newCredentials.password}`);
            alert('Credentials copied to clipboard!');
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">User Management</Typography>
                <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
                    Create New User
                </Button>
            </Box>

            {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

            <TableContainer component={Paper}>
                {isLoading ? <CircularProgress sx={{m: 5}}/> : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>National ID</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.nationalId}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { setEditingUser(user); setOpenEditDialog(true); }}><EditIcon /></IconButton>
                                    <IconButton size="small" onClick={() => { setUserToDelete(user); setOpenDeleteDialog(true); }}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </TableContainer>

            {/* Dialogs for Create, Edit, Delete, Show Credentials */}
            
            {/* Create User Dialog */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New User</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="National ID" fullWidth value={newUser.nationalId} onChange={(e) => { setNewUser({...newUser, nationalId: e.target.value}); if(formErrors.nationalId) setFormErrors({...formErrors, nationalId: undefined}); }} error={!!formErrors.nationalId} helperText={formErrors.nationalId} />
                    <TextField margin="dense" label="Full Name" fullWidth value={newUser.name} onChange={(e) => { setNewUser({...newUser, name: e.target.value}); if(formErrors.name) setFormErrors({...formErrors, name: undefined}); }} error={!!formErrors.name} helperText={formErrors.name} />
                    <TextField margin="dense" label="Email" type="email" fullWidth value={newUser.email} onChange={(e) => { setNewUser({...newUser, email: e.target.value}); if(formErrors.email) setFormErrors({...formErrors, email: undefined}); }} error={!!formErrors.email} helperText={formErrors.email} />
                    <TextField margin="dense" label="Phone" fullWidth value={newUser.phone} onChange={(e) => { setNewUser({...newUser, phone: e.target.value}); if(formErrors.phone) setFormErrors({...formErrors, phone: undefined}); }} error={!!formErrors.phone} helperText={formErrors.phone} />
                    <FormControl fullWidth margin="dense" error={!!formErrors.role}>
                        <InputLabel>Role</InputLabel>
                        <Select value={newUser.role} label="Role" onChange={(e) => { setNewUser({...newUser, role: e.target.value}); if(formErrors.role) setFormErrors({...formErrors, role: undefined}); }}>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                            <MenuItem value="PARENT">Parent</MenuItem>
                        </Select>
                        {formErrors.role && <p style={{color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0'}}>{formErrors.role}</p>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateUser}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Dialog */}
            {editingUser && (
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="National ID" fullWidth value={editingUser.nationalId} onChange={(e) => { setEditingUser({...editingUser, nationalId: e.target.value}); if(formErrors.nationalId) setFormErrors({...formErrors, nationalId: undefined}); }} error={!!formErrors.nationalId} helperText={formErrors.nationalId} />
                    <TextField margin="dense" label="Full Name" fullWidth value={editingUser.name} onChange={(e) => { setEditingUser({...editingUser, name: e.target.value}); if(formErrors.name) setFormErrors({...formErrors, name: undefined}); }} error={!!formErrors.name} helperText={formErrors.name} />
                    <TextField margin="dense" label="Email" type="email" fullWidth value={editingUser.email} onChange={(e) => { setEditingUser({...editingUser, email: e.target.value}); if(formErrors.email) setFormErrors({...formErrors, email: undefined}); }} error={!!formErrors.email} helperText={formErrors.email} />
                    <TextField margin="dense" label="Phone" fullWidth value={editingUser.phone} onChange={(e) => { setEditingUser({...editingUser, phone: e.target.value}); if(formErrors.phone) setFormErrors({...formErrors, phone: undefined}); }} error={!!formErrors.phone} helperText={formErrors.phone} />
                     <FormControl fullWidth margin="dense" error={!!formErrors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select value={editingUser.status} label="Status" onChange={(e) => { setEditingUser({...editingUser, status: e.target.value}); if(formErrors.status) setFormErrors({...formErrors, status: undefined}); }}>
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                        </Select>
                         {formErrors.status && <p style={{color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0'}}>{formErrors.status}</p>}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleUpdateUser}>Save Changes</Button>
                </DialogActions>
            </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            {userToDelete && (
                 <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to permanently delete the user: <strong>{userToDelete.name}</strong>?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={confirmDeleteUser} color="error">Delete</Button>
                    </DialogActions>
                </Dialog>
            )}

             {/* Show Credentials Dialog */}
             {newCredentials && (
                <Dialog open={showCredentialsDialog} onClose={() => setShowCredentialsDialog(false)}>
                    <DialogTitle>User Created Successfully!</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>Please deliver these credentials to the user.</Typography>
                        <TextField label="Username" value={newCredentials.username} fullWidth InputProps={{ readOnly: true }} variant="filled" sx={{ my: 1 }}/>
                        <TextField label="Password" value={newCredentials.password} fullWidth InputProps={{ readOnly: true }} variant="filled" sx={{ my: 1 }}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
                        <Button onClick={() => setShowCredentialsDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}

        </Box>
    );
}

export default UserManagement; 