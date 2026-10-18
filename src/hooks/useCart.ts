import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { Cart } from '@/contracts/cart';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await apiClient.get<Cart>('/api/cart');
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nftId, quantity = 1 }: { nftId: string; quantity?: number }) => {
      const res = await apiClient.post<Cart>('/api/cart/items', { nftId, quantity });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
