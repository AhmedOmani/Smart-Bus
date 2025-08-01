import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children, user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Welcome, {user.name}
                </Typography>
                {location.pathname !== '/' && (
                     <Button variant="outlined" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                )}
                <Button variant="contained" onClick={onLogout}>
                    Logout
                </Button>
            </Paper>
            <main>
                {children}
            </main>
        </Box>
    );
};

export default Layout; 