import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }

  // Primary live Render backend URL from Dashboard logs
  if (import.meta.env.PROD) {
    return 'https://tripvault-backend-wvx1.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 90000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tripvault_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
