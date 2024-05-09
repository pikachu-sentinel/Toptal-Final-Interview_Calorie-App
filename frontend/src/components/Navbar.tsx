import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, role } = useAuth(); // include role in the usage of the AuthContext

  const handleLogout = () => {
    logout();
    navigate('/'); // You may want to navigate to a login page or public page after logout
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calorie App
          </Typography>
          <Button color="inherit" onClick={() => navigate('/home')}>
                  Dashboard
                </Button>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          ) : (
            <>
              {role === 'user' && (
                <Button color="inherit" onClick={() => navigate('/progress')}>
                  Progress
                </Button>
              )}
              {role === 'admin' && (
                <Button color="inherit" onClick={() => navigate('/report')}>
                  Report
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
