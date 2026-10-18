import { useQuery } from '@tanstack/react-query';
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
