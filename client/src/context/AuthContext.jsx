import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('tripvault_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('tripvault_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('tripvault_token', response.data.token);
    setUser(response.data.user);
    setToast({ message: 'Login successful', type: 'success' });
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    setToast({ message: response.data.message, type: 'success' });
    return response.data;
  };

  const updateUser = (nextUser) => {
    setUser((currentUser) => ({ ...currentUser, ...nextUser }));
  };

  const logout = () => {
    localStorage.removeItem('tripvault_token');
    setUser(null);
    setToast({ message: 'You have been logged out', type: 'info' });
  };

  const clearToast = () => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToast(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    toast,
    login,
    register,
    updateUser,
    logout,
    clearToast,
  }), [user, loading, toast]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
