// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../graphql/mutations/signUp';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Paper, Box, Typography, Link as MuiLink } from '@mui/material';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [signUp, { loading, error }] = useMutation(SIGN_UP);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await signUp({ variables: { username, email, password } });
            if (response.data) {
                navigate('/login');
            }
        } catch (e) {
            console.error('Registration Error:', e);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3
            }}
        >
            <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 360 }}>
                <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 2 }}>
                    Register
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleRegister}
                    sx={{ display: 'flex', flexDirection: 'column' }}
                    noValidate
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            Error: {error.message}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <MuiLink component={RouterLink} to="/login" variant="body2">
                        Already have an account? Login
                    </MuiLink>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegisterPage;
