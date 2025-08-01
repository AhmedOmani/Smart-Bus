import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Button, Typography, CircularProgress, Box } from '@mui/material';

const ParentDashboard = () => {
    const [bus, setBus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleTrackBus = () => {
        if (bus) {
            navigate(`/track/${bus.id}`);
        }
    };

    return (
        <Box>
            {isLoading ? (
                <CircularProgress />
            ) : bus ? (
                <div>
                    <Typography variant="h6">Your Student's Bus:</Typography>
                    <Typography>Bus Number: {bus.busNumber}</Typography>
                    <Typography>Driver: {bus.driverName}</Typography>
                    <Button variant="contained" sx={{mt: 2}} onClick={handleTrackBus}>Track Bus</Button>
                </div>
            ) : (
                <Typography>Your student is not currently assigned to a bus.</Typography>
            )}
        </Box>
    );
};

export default ParentDashboard; 