import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { plannerAPI } from './plannerAPI';

export const plannerQueries = createQueryKeyStore({
  plans: {
    // GET 쿼리만
    all: () => ({
      queryKey: ['plans', 'all'],
      queryFn: () => plannerAPI.getAllPlans(),
    }),
  },
});
