import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import api from '../api';
import { useBusTracking } from '../hooks/useBusTracking';
import MapView from './MapView';

const AdminBusTracking = () => {
    const [buses, setBuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { locations, error: trackingError } = useBusTracking({ role: 'ADMIN' });

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await api.getBuses();
                setBuses(response.data.data.buses);
            } catch (error) {
                console.error('Failed to fetch buses:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBuses();
    }, []);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Real-Time Fleet Monitoring</Typography>
            {isLoading ? (
                <Typography>Loading map...</Typography>
            ) : (
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey' }}>
                    <Typography variant="h6">Live Location Data:</Typography>
                    {trackingError && <Alert severity="error">{trackingError}</Alert>}
                    {Object.keys(locations).length > 0 ? (
                        <pre>{JSON.stringify(locations, null, 2)}</pre>
                    ) : (
                        <Typography>Waiting for location updates from buses...</Typography>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default AdminBusTracking; 