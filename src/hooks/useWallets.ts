import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { Wallet, CreateWalletRequest, UpdateWalletRequest } from '@/contracts/wallet';

export function useWallets() {
  const queryClient = useQueryClient();

  const walletsQuery = useQuery<Wallet[]>({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Wallet[] }>('/api/wallets');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const createWalletMutation = useMutation<Wallet, Error, CreateWalletRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<Wallet>('/api/wallets', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  const updateWalletMutation = useMutation<
    Wallet,
    Error,
    { id: string; payload: UpdateWalletRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.patch<Wallet>(`/api/wallets/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });

  return {
    wallets: walletsQuery.data ?? [],
    isLoading: walletsQuery.isLoading,
    isError: walletsQuery.isError,
    error: walletsQuery.error,
    refetch: walletsQuery.refetch,
    createWallet: createWalletMutation.mutateAsync,
    isCreating: createWalletMutation.isPending,
    createError: createWalletMutation.error,
    updateWallet: updateWalletMutation.mutateAsync,
    isUpdating: updateWalletMutation.isPending,
  };
}
