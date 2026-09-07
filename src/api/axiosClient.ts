import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token to every request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lectura_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for API responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on Unauthorized response
      localStorage.removeItem('lectura_access_token');
      localStorage.removeItem('lectura_refresh_token');
    }
    return Promise.reject(error);
  }
);
