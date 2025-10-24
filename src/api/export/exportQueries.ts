import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { exportAPI } from './exportAPI';

export const exportQueries = createQueryKeyStore({
  exports: {
    planPdfData: (planId: string, lang: string = 'ko') => ({
      queryKey: ['exports', 'plans', planId, 'pdf', lang],
      queryFn: () => exportAPI.exportPlanPdfData({ plan_id: planId, lang }),
    }),
  },
});
