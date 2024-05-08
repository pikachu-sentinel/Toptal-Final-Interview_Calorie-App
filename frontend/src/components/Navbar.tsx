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
              {role === 'admin' && (
                <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
                  Admin Dashboard
                </Typography>
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
