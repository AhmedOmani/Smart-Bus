import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import api from '../api';
import { useBusTracking } from '../hooks/useBusTracking';

const SupervisorDashboard = () => {
    const [bus, setBus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { location, error, isBroadcasting, startBroadcasting, stopBroadcasting } = useBusTracking({ busId: bus?.id, role: 'SUPERVISOR' });

    useEffect(() => {
        const fetchBusData = async () => {
            console.log('=== SUPERVISOR DASHBOARD DEBUG ===');
            console.log('Starting to fetch bus data...');
            
            // Debug: Check authentication token
            const token = localStorage.getItem('admin_token');
            console.log('Auth token from localStorage:', token ? 'Present' : 'Missing');
            console.log('Token value:', token);
            
            // Debug: Check user data
            const userData = localStorage.getItem('user');
            console.log('User data from localStorage:', userData);
            if (userData) {
                const user = JSON.parse(userData);
                console.log('Parsed user object:', user);
                console.log('User ID:', user.id);
                console.log('User role:', user.role);
            }

            try {
                console.log('Making API request to getSupervisorBus...');
                const response = await api.getSupervisorBus();
                
                console.log('=== API RESPONSE SUCCESS ===');
                console.log('Full response object:', response);
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                console.log('Response data:', response.data);
                console.log('Bus data:', response.data.data.bus);  // Updated path
                
                setBus(response.data.data.bus);  // ✅ Fixed: correct path to bus data
                setIsLoading(false);
            } catch (err) {
                console.log('=== API RESPONSE ERROR ===');
                console.error('Full error object:', err);
                console.error('Error message:', err.message);
                console.error('Error response:', err.response);
                
                if (err.response) {
                    console.error('Error status:', err.response.status);
                    console.error('Error status text:', err.response.statusText);
                    console.error('Error data:', err.response.data);
                    console.error('Error headers:', err.response.headers);
                } else if (err.request) {
                    console.error('No response received. Request object:', err.request);
                } else {
                    console.error('Error setting up request:', err.message);
                }
                
                setIsLoading(false);
            }
            
            console.log('=== END DEBUG ===');
        };
        
        fetchBusData();
    }, []);

    useEffect(() => {
        if (location) {
            console.log('=== SAVING LOCATION DEBUG ===');
            console.log('Location data to save:', location);
            
            api.saveBusLocation(location)
                .then(response => {
                    console.log('Location save successful:', response);
                })
                .catch(err => {
                    console.error("Failed to save location:", err);
                    console.error("Save location error details:", err.response);
                });
        }
    }, [location]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Supervisor Dashboard</Typography>
            
           

            {isLoading ? <Typography>Loading...</Typography> : (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>My Bus</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    {bus ? (
                        <Box>
                            <Typography><strong>Bus Number:</strong> {bus.busNumber}</Typography>
                            <Typography><strong>License Plate:</strong> {bus.licensePlate}</Typography>
                            {location && (
                                <Typography>
                                    <strong>Current Location:</strong> {location.latitude}, {location.longitude}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2 }}>
                                {!isBroadcasting ? (
                                    <Button variant="contained" color="primary" onClick={startBroadcasting}>
                                        Start Broadcasting
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="secondary" onClick={stopBroadcasting}>
                                        Stop Broadcasting
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <Typography>Not assigned to any bus.</Typography>
                    )}
                </Paper>
            )}
        </Box>
    );
};

export default SupervisorDashboard; 