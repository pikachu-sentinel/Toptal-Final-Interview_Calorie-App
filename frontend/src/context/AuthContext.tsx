import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import client from '../graphql/client';

interface DecodedToken {
  user: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const login = () => {
    // This function would be called after you've set the auth token in localStorage
    const token = window.localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setRole(decoded.role);
        setIsAuthenticated(true);
      } catch (error) {
        // Handling error if the token is invalid
        logout(); // This will reset the auth state
      }
    }
  };

  const logout = () => {
    window.localStorage.removeItem('authToken');
    client.cache.reset();
    setIsAuthenticated(false);
    setRole(null);
  };

  useEffect(() => {
    login(); // Call login to check for the token and establish initial state
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
