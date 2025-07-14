import { useQuery } from '@tanstack/react-query';
import { locationQueries } from './locationQueries';

export const useSearchLocationQuery = (query: string, options?: any) => {
  return useQuery({
    ...locationQueries.locations.search(query),
    enabled: !!query.trim(),
    ...options,
  });
};

export const useLocationSuggestionsQuery = (query: string, options?: any) => {
  return useQuery({
    ...locationQueries.locations.suggestions(query),
    enabled: !!query.trim(),
    ...options,
  });
};

export const useAllLocationNamesQuery = (options?: any) => {
  return useQuery({
    ...locationQueries.locations.all(),
    ...options,
  });
};
