import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    CircularProgress, 
    Alert 
} from '@mui/material';

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        const token = localStorage.getItem('admin_token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.login(username, password);
            const { token, user } = response.data.data;
            onLoginSuccess(token, user);
            navigate('/'); // Redirect after successful login
        } catch (err) {
            setIsLoading(false);
            const errorMessage = err.response?.data?.error?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh' 
        }}>
            <Paper elevation={6} sx={{ p: 4, width: '100%', mt: -10 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
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
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'تسجيل الدخول'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
            <Box mt={5}>
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Powered by Your Company © '}
                    {new Date().getFullYear()}
                </Typography>
            </Box>
        </Container>
    );
}

export default LoginPage; 