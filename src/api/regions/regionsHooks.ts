// locationHooks.ts
import { useQuery } from '@tanstack/react-query';
import { regionsQueries } from './regionsQueries';

// 새로 추가된 regions hooks
export const useRegionsQuery = (options = {}) => {
  return useQuery({
    ...regionsQueries.regions.all(),
    ...options,
  });
};

export const useRegionDetailQuery = (regionId: number | null, options = {}) => {
  return useQuery({
    ...regionsQueries.regions.detail(regionId!),
    enabled: !!regionId,
    ...options,
  });
};
