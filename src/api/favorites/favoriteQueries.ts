import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { favoriteAPI } from './favoriteAPI';
import type {
  GetFavoritePlacesParams,
  GetFavoriteRegionsParams,
} from './favoriteType';

export const favoriteQueries = createQueryKeyStore({
  favorites: {
    places: (params: GetFavoritePlacesParams = {}) => ({
      queryKey: ['favorites', 'places', params],
      queryFn: () => favoriteAPI.getFavoritePlaces(params),
    }),
    regions: (params: GetFavoriteRegionsParams = {}) => ({
      queryKey: ['favorites', 'regions', params],
      queryFn: () => favoriteAPI.getFavoriteRegions(params),
    }),
  },
});
