import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGN_UP } from '../graphql/mutations/signUp';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        // Process the registration using an auth service or context (not displayed here)
        try {
            const response = await signUp({ variables: { username, email, password } });
            if (response.data) {
                // Handle the response from the registration mutation,
                // e.g., store the token if one is returned, log the user in,
                // or save user data to state management/context.

                // Navigate the user to the login page or directly to the dashboard
                // if they're logged in automatically after registering.
                navigate('/login');
            }
        } catch (e) {
            // Handle errors, such as displaying a message to the user.
            console.error('Registration Error:', e);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Register</button>
            </form>
            <Link to="/login">Already have an account? Login</Link>
        </div>
    );
};

export default RegisterPage;
