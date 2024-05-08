// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import client from '../graphql/client';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);



export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true); // You would add real login logic here
  const logout = () => {
    window.localStorage.removeItem('authToken');
    client.cache.reset();
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
