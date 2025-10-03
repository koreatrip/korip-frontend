import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { plannerAPI } from './plannerAPI';

export const plannerQueries = createQueryKeyStore({
  plans: {
    // GET 쿼리만
    all: () => ({
      queryKey: ['plans', 'all'],
      queryFn: () => plannerAPI.getAllPlans(),
      staleTime: 0, // 항상 최신 데이터
      gcTime: 1000 * 60 * 5, // 5분
    }),
    detail: (planId: string) => ({
      queryKey: ['plans', 'detail', planId],
      queryFn: () => plannerAPI.getPlanById(planId),
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
    }),
  },
});
