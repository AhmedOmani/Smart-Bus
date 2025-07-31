import { Typography, Button } from '@mui/material';

function SupervisorDashboard({ user, onLogout }) {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        أهلاً بك يا مشرف, {user.name}
      </Typography>
      <Button variant="contained" onClick={onLogout}>
        تسجيل الخروج
      </Button>
      <hr />
      <p>Supervisor dashboard will be built here.</p>
    </div>
  );
}

export default SupervisorDashboard; 