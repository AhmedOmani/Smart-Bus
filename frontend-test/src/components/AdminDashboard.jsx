import { useState } from 'react';
import { Typography, Button, Box, Paper, Tabs, Tab } from '@mui/material';
import UserManagement from './UserManagement';
import StudentManagement from './StudentManagement';
import BusManagement from './BusManagement';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function AdminDashboard({ user, onLogout }) {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Welcome Admin, {user.name}
                </Typography>
                <Button variant="contained" onClick={onLogout}>
                    Logout
                </Button>
            </Paper>
            
            <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="admin dashboard tabs">
                        <Tab label="User Management" />
                        <Tab label="Student Management" />
                        <Tab label="Bus Management" />
                    </Tabs>
                </Box>
                <TabPanel value={tabIndex} index={0}>
                    <UserManagement />
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <StudentManagement />
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <BusManagement />
                </TabPanel>
            </Paper>
        </Box>
    );
}

export default AdminDashboard; 