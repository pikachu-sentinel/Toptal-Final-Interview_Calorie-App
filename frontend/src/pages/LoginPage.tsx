// src/components/SignIn.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, TextField, CircularProgress, Box, Typography, Link as MuiLink } from '@mui/material';

import { SIGN_IN } from '../graphql/mutations/signIn';
import { useAuth } from '../context/AuthContext';
import { SignInResponse, SignInVariables } from '../types/graphql';

const SignIn: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const [signIn, { loading, error }] = useMutation<SignInResponse, SignInVariables>(SIGN_IN, {
        variables: { username, password },
        onCompleted: (data) => {
            localStorage.setItem('authToken', data.signIn.value);
            login();
            navigate('/home');
        },
        onError: (error) => {
            console.error('Sign-In Error:', error);
        }
    });

    const handleSignIn = async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault(); // Prevent default form submission behavior
        }
        await signIn();
    };

    return (
        <Box sx={{ width: 300, margin: 'auto', display: 'flex', flexDirection: 'column', mt: 10 }}>
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 2 }}>
                Sign In
            </Typography>
            <form onSubmit={handleSignIn} noValidate autoComplete="off" > {/* Add a form element */}
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    type="submit" // Set type to submit for the button
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
                {error && (
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        Error: {error.message}
                    </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" textAlign="center">
                        Don't have an account?
                        {' '}
                        <MuiLink component={Link} to="/register" underline="hover">
                            Register here
                        </MuiLink>
                    </Typography>
                </Box>
            </form>
        </Box>
    );
};

export default SignIn;
