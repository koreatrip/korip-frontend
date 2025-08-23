import { useQuery } from '@tanstack/react-query';
import { weatherQueries } from './weatherQueries';

export const useWeatherQuery = (
  regionId: number | null,
  subregionId?: number | null,
  options = {}
) => {
  return useQuery({
    ...weatherQueries.weather.byLocation(regionId!, subregionId!),
    enabled: !!regionId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};
