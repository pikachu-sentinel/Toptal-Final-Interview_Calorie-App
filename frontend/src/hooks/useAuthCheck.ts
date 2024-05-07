// src/hooks/useAuthCheck.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useAuthCheck = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // In a real-world scenario, you should also check if the token
      // (if used) is expired and then update the isAuthenticated state accordingly.
      navigate('/login');
    }
    // Potentially, add logic here to validate the token and expiry.
  }, [isAuthenticated, navigate]);
};

export default useAuthCheck;