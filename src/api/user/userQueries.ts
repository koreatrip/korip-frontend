// userQueries.ts
import { queryOptions } from '@tanstack/react-query';
import { userAPI } from './userAPI';

export const userQueries = {
  all: () => ['user'] as const,
  profile: () =>
    queryOptions({
      queryKey: [...userQueries.all(), 'profile'] as const,
      queryFn: userAPI.getUserInfo,
      staleTime: 5 * 60 * 1000, // 5분
    }),
};
