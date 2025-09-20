// regionsHooks.ts
import { useQuery } from '@tanstack/react-query';
import { regionsQueries } from './regionsQueries';

export const useRegionsQuery = (lang?: string, options = {}) => {
  return useQuery({
    ...regionsQueries.regions.all(lang), // lang 파라미터 전달
    ...options,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useRegionDetailQuery = (
  regionId: number | null,
  lang?: string,
  options = {}
) => {
  return useQuery({
    ...regionsQueries.regions.detail(regionId!, lang), // lang 파라미터 전달
    enabled: !!regionId,
    ...options,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useRegionMajorQuery = (lang?: string) => {
  return useQuery({
    ...regionsQueries.regions.major(lang),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
