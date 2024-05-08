// src/components/ProtectedRoute.tsx

import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const location = useLocation();

    const token = localStorage.getItem('authToken');

    // isTokenExpired function
    const isTokenExpired = () => {
        if (!token) return true;

        try {
            // Use jwt-decode or a similar package to decode the token

            const decodedToken = jwtDecode<{ exp: number }>(token);

            // The exp is a NumericDate, representing the number of seconds
            // from 1970-01-01T00:00:00Z UTC until the expiration time.
            const currentTime = Date.now() / 1000; // convert milliseconds to seconds

            return decodedToken.exp < currentTime;
        } catch (error) {
            // In case of an error decoding the token, assume the token to be invalid
            return true;
        }
    };

    if (token && !isAuthenticated) {
        return <>{children}</>
    }

    if (!isAuthenticated || isTokenExpired()) {
        // Redirect to the login page if not authenticated or if the token has expired
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</> // If authenticated and token not expired, render the children
};

export default ProtectedRoute;