import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { Order } from '@/contracts/order';

export function useOrder(orderId?: string) {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }
      const response = await apiClient.get<Order>(`/api/orders/${orderId}`);
      return response.data;
    },
    enabled: Boolean(orderId),
    staleTime: 1000 * 60,
    retry: 1,
  });
}
