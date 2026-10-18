import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { socketClient } from '@/lib/socket-client';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/contracts/auth';

const TOKEN_KEY = '__kurio_auth_token__';
const USER_ID_KEY = '__kurio_user_id__';

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery<User | null>({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;
      try {
        const response = await apiClient.get<{ user: User }>('/api/auth/session');
        return response.data.user;
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_ID_KEY, data.user.id);
      queryClient.setQueryData(['auth', 'session'], data.user);

      // Preserva itens de visitante mesclando com o carrinho do usuário
      try {
        await apiClient.post('/api/cart/merge');
      } catch {
        // Ignora falha de merge silenciosa
      }

      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['quote'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', payload);
      return response.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_ID_KEY, data.user.id);
      queryClient.setQueryData(['auth', 'session'], data.user);

      // Preserva itens de visitante mesclando com o carrinho do usuário
      try {
        await apiClient.post('/api/cart/merge');
      } catch {
        // Ignora falha de merge silenciosa
      }

      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['quote'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        await apiClient.post('/api/auth/logout');
      } finally {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
      }
    },
    onSuccess: () => {
      // Limpeza estrita de estado privado e reconexão do socket
      queryClient.clear();
      socketClient.disconnect();
      socketClient.connect();
    },
  });

  return {
    user: sessionQuery.data ?? null,
    isLoading: sessionQuery.isLoading,
    isAuthenticated: Boolean(sessionQuery.data),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
