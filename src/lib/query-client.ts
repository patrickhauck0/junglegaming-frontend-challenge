import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 segundos
      gcTime: 1000 * 60 * 5, // 5 minutos
      retry: (failureCount, error: any) => {
        // Não tentar novamente em erros 4xx (exceto 408 Timeout)
        if (error?.response?.status && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 408) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export function clearPrivateUserCache(client: QueryClient = queryClient): void {
  const privateQueryKeys = ['favorites', 'cart', 'profile', 'wallets', 'orders'];
  privateQueryKeys.forEach((key) => {
    client.removeQueries({ queryKey: [key] });
  });
}
