import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { placesAPI } from './placeAPI';

export const placesQueries = createQueryKeyStore({
  places: {
    list: (params: {
      region_id: number;
      subregion_id?: number;
      lang?: string;
    }) => ({
      queryKey: ['places', 'list', params],
      queryFn: () => placesAPI.getPlaces(params),
    }),
  },
});
