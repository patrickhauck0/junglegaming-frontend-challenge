import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { Nft, NftFilterParams } from '@/contracts/nft';
import type { PaginatedResponseSchema } from '@/contracts/common';
import { z } from 'zod';

export type NftsResponse = z.infer<ReturnType<typeof PaginatedResponseSchema<typeof import('@/contracts/nft').NftSchema>>>;

export function useNfts(params: NftFilterParams) {
  return useQuery({
    queryKey: ['nfts', params],
    queryFn: async ({ signal }) => {
      const response = await apiClient.get<NftsResponse>('/api/nfts', {
        params: {
          search: params.search || undefined,
          collections: params.collections,
          networks: params.networks,
          minPrice: params.minPrice || undefined,
          maxPrice: params.maxPrice || undefined,
          tab: params.tab || 'all',
          sortBy: params.sortBy || 'recent',
          page: params.page || 1,
          limit: params.limit || 9,
        },
        signal,
      });
      return response.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nftId, isFavorited }: { nftId: string; isFavorited: boolean }) => {
      if (isFavorited) {
        const res = await apiClient.delete(`/api/favorites/${nftId}`);
        return res.data;
      } else {
        const res = await apiClient.post(`/api/favorites/${nftId}`);
        return res.data;
      }
    },
    onMutate: async ({ nftId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: ['nfts'] });

      // Snapshot prévio do cache para rollback
      const previousNfts = queryClient.getQueriesData({ queryKey: ['nfts'] });

      queryClient.setQueriesData({ queryKey: ['nfts'] }, (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((nft: Nft) => {
            if (nft.id === nftId) {
              return {
                ...nft,
                isFavorited: !isFavorited,
                likesCount: isFavorited ? Math.max(0, nft.likesCount - 1) : nft.likesCount + 1,
              };
            }
            return nft;
          }),
        };
      });

      return { previousNfts };
    },
    onError: (_err, _variables, context) => {
      // Rollback imediato no cache
      if (context?.previousNfts) {
        context.previousNfts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Anúncio acessível de erro na região aria-live
      const announcementEl = document.getElementById('a11y-announcements');
      if (announcementEl) {
        announcementEl.textContent = 'Erro ao atualizar favoritos. Ação revertida.';
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
