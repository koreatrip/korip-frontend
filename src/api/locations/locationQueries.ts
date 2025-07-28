import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { locationAPI } from './locationAPI';

export const locationQueries = createQueryKeyStore({
  locations: {
    search: (query: string) => ({
      queryKey: ['locations', 'search', query],
      queryFn: () => locationAPI.searchLocation(query),
    }),

    suggestions: (query: string) => ({
      queryKey: ['locations', 'suggestions', query],
      queryFn: () => locationAPI.getLocationSuggestions(query),
    }),

    all: () => ({
      queryKey: ['locations', 'all'],
      queryFn: () => locationAPI.getAllLocationNames(),
    }),
  },
});
