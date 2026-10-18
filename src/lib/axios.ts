import axios, { type InternalAxiosRequestConfig } from 'axios';

function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_URL;
  if (typeof window !== 'undefined') {
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // Se estiver em produção (ex: Vercel) e a URL do env for localhost ou vazia, use caminhos relativos
    if (!envUrl || (!isLocalHost && envUrl.includes('localhost'))) {
      return '';
    }
  }
  return envUrl || '';
}

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
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
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('__kurio_auth_token__');
        localStorage.removeItem('__kurio_user_id__');
      } catch {
        // Ignora erro de localStorage
      }

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);
