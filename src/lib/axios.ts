import axios, { type InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('__kurio_auth_token__');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Falha ao acessar localStorage tratada silenciosamente
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
