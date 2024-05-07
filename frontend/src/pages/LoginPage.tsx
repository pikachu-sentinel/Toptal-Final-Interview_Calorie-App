// src/components/SignIn.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_IN } from '../graphql/mutations/signIn'; // Adjust this import to the location of your queries.
import { useAuth } from '../context/AuthContext';
import { SignInResponse, SignInVariables } from '../types/graphql'; // Adjust this import to the location of your types.

const SignIn: React.FC = () => {
    const [signIn, { data, loading, error }] = useMutation<SignInResponse, SignInVariables>(SIGN_IN);

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const response = await signIn({ variables: { username, password } });
            if (response.data) {
                // Handle the response, e.g., store the token, navigate to another page, etc.
                login();
                localStorage.setItem('authToken', response.data.signIn.value);
                navigate('/home');
            }
        } catch (e) {
            // Handle errors, such as displaying a message to the user
            console.error('Sign-In Error:', e);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>An error occurred: {error.message}</p>;

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    );
};

export default SignIn;
