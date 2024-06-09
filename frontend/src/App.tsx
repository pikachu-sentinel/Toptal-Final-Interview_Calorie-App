// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminReport from './pages/AdminReport';
import ProgressPage from './pages/ProgressPage';
import AdminManagementPage from './pages/ManageFoodEntries';
import RegisterFriendPage from './pages/RegisgerFriend';

//React 18.0
const theme = createTheme({
  // Theme customization with sample style
});

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/registerfriend" element={<RegisterFriendPage />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <AdminReport />
              </ProtectedRoute>
            } />
            <Route path="/manage" element={
              <ProtectedRoute>
                <AdminManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate replace to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
