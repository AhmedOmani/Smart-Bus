import { useState } from 'react';
import { api } from '../api';
import { 
    Container, 
    Box, 
    TextField, 
    Button, 
    Typography, 
    CircularProgress, 
    Alert,
    Paper,
    Link
} from '@mui/material';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data.data;

      // No need to check role here, App.jsx will handle routing
      onLoginSuccess(token, user);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (e.g., 401, 404, 500)
        setError(err.response.data?.error?.message || 'An unexpected server error occurred.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Login failed. The server could not be reached.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred during login.');
      }
    }
  };

  return (
    <Box 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default'
        }}
    >
        <Container component="main" maxWidth="xs">
            <Paper 
                elevation={6}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 2
                }}
            >
                <img src="/logo.png" alt="School Logo" style={{ width: '150px', marginBottom: '20px' }} />
                <Typography component="h1" variant="h5">
                تسجيل الدخول
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="اسم المستخدم"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="كلمة المرور"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'تسجيل الدخول'}
                </Button>
                </Box>
            </Paper>
        </Container>
         <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Modern Era Private School
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    </Box>
  );
}

export default LoginPage; 