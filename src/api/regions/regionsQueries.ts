// locationQueries.ts
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { regionsAPI } from './regionsAPI';

export const regionsQueries = createQueryKeyStore({
  regions: {
    all: () => ({
      queryKey: ['regions', 'all'],
      queryFn: () => regionsAPI.getRegions(),
    }),

    detail: (regionId: number) => ({
      queryKey: ['regions', 'detail', regionId],
      queryFn: () => regionsAPI.getRegionDetail(regionId),
    }),
  },
});
