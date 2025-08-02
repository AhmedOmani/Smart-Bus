import React, { useState, useEffect } from 'react';
import api from '../api';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import { useBusTracking } from '../hooks/useBusTracking';
import MapView from './MapView';

const ParentDashboard = () => {
    const [bus, setBus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { location, error: trackingError } = useBusTracking({ busId: bus?.id, role: 'PARENT' });

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const response = await api.getMyBus();
                setBus(response.data.data.bus);
            } catch (error) {
                console.error("Failed to fetch bus data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBus();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Parent Dashboard</Typography>
            {isLoading ? (
                <CircularProgress />
            ) : bus ? (
                <div>
                    <Typography variant="h6">Your Student's Bus:</Typography>
                    <Typography>Bus Number: {bus.busNumber}</Typography>
                    <Typography>Driver: {bus.driverName}</Typography>
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed grey' }}>
                        <Typography variant="h6">Live Location Data:</Typography>
                        {trackingError && <Alert severity="error">{trackingError}</Alert>}
                        {location ? (
                            <pre>{JSON.stringify(location, null, 2)}</pre>
                        ) : (
                            <Typography>Waiting for location update...</Typography>
                        )}
                    </Box>
                </div>
            ) : (
                <Typography>Your student is not currently assigned to a bus.</Typography>
            )}
        </Box>
    );
};

export default ParentDashboard; 