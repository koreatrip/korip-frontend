// src/api/planner/plannerQueries.ts

import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { plannerAPI } from './plannerAPI';

export const plannerQueries = createQueryKeyStore({
  plans: {
    all: (lang: string = 'ko') => ({
      queryKey: ['plans', 'all', lang],
      queryFn: () => plannerAPI.getAllPlans({ lang }),
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
    }),
    detail: (planId: string, lang: string = 'ko') => ({
      queryKey: ['plans', 'detail', planId, lang],
      queryFn: () => plannerAPI.getPlanById({ planId, lang }),
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
    }),
  },
});
