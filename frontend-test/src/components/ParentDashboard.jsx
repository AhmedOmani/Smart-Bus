import { useState, useEffect } from 'react';
import { api } from '../api';
import {
    Typography, Button, Box, Paper, CircularProgress, Alert, Card, CardContent, Grid
} from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

function ParentDashboard({ user, onLogout }) {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyStudents = async () => {
            setIsLoading(true);
            try {
                // This endpoint is secured by middleware to only return the logged-in parent's students
                const response = await api.get('/parent/students');
                setStudents(response.data.data.students.students);
            } catch (err) {
                setError(err.response?.data?.error?.message || 'Failed to fetch your children\'s data.');
            }
            setIsLoading(false);
        };

        fetchMyStudents();
    }, []);

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Welcome, {user.name}
                </Typography>
                <Button variant="contained" onClick={onLogout}>
                    Logout
                </Button>
            </Paper>

            <Typography variant="h6" gutterBottom>My Children</Typography>

            {isLoading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            
            <Grid container spacing={3}>
                {students.map((student) => (
                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <ChildCareIcon /> {student.name}
                                </Typography>
                                <Typography color="text.secondary">
                                    Grade: {student.grade}
                                </Typography>
                                <Typography color="text.secondary">
                                    Status: {student.status}
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 2}}>
                                    <DirectionsBusIcon /> 
                                    <Typography variant="body1">
                                        Bus: {student.bus ? student.bus.busNumber : 'Not Assigned'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ParentDashboard; 