import { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import UserManagement from './UserManagement';
import StudentManagement from './StudentManagement';
import BusManagement from './BusManagement';
import BusTracking from './BusTracking';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Paper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="admin dashboard tabs">
                    <Tab label="Bus Tracking" />
                    <Tab label="User Management" />
                    <Tab label="Student Management" />
                    <Tab label="Bus Management" />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                <BusTracking role="ADMIN" />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <UserManagement />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <StudentManagement />
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                <BusManagement />
            </TabPanel>
        </Paper>
    );
}

export default AdminDashboard; 