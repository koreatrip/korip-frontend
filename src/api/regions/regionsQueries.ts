import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { regionsAPI } from './regionsAPI';

// regionsQueries.ts
export const regionsQueries = createQueryKeyStore({
  regions: {
    all: (lang?: string) => ({
      queryKey: ['regions', lang],
      queryFn: () => regionsAPI.getRegions(lang),
    }),
    detail: (regionId: number, lang?: string) => ({
      queryKey: ['regions', regionId, lang],
      queryFn: () => regionsAPI.getRegionDetail(regionId, lang),
    }),
    major: (lang?: string) => ({
      queryKey: ['major', lang],
      queryFn: () => regionsAPI.getRegionsMajor(lang),
    }),
  },
});
