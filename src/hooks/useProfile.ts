import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { User, ChangePasswordRequest } from '@/contracts/auth';

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get<User>('/api/profile');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const updateProfileMutation = useMutation<User, Error, UpdateProfileRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.put<User>('/api/profile', payload);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser);
      queryClient.setQueryData(['auth', 'session'], updatedUser);
    },
  });

  const changePasswordMutation = useMutation<
    { message?: string },
    Error,
    Omit<ChangePasswordRequest, 'confirmPassword'>
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<{ message?: string }>(
        '/api/profile/change-password',
        payload
      );
      return response.data;
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
  };
}
