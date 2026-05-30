import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    accessToken,
    isLoading,
    error,
    setUser,
    setTokens,
    setError,
    clearError,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!isAuthenticated && storedToken) {
      setTokens(storedToken, localStorage.getItem('refreshToken'));
    }
  }, []);

  return {
    user,
    isAuthenticated,
    accessToken,
    isLoading,
    error,
    setUser,
    setTokens,
    setError,
    clearError,
    logout,
  };
};

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated;
};

export default useAuth;
