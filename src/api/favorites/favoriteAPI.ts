// favoriteAPI.ts
import axiosInstance from '../axiosInstance';
import {
  type FavoritePlacesResponse,
  type ToggleFavoritePlaceRequest,
  type ToggleFavoritePlaceResponse,
  type GetFavoritePlacesParams,
} from './favoriteType';

export const favoriteAPI = {
  // 즐겨찾기 장소 목록 조회 (GET)
  getFavoritePlaces: async (
    params: GetFavoritePlacesParams = {}
  ): Promise<FavoritePlacesResponse> => {
    const { lang = 'ko', page = 1 } = params;

    const response = await axiosInstance.get('/api/favorites/places', {
      params: { lang, page },
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 즐겨찾기 토글 (POST)
  toggleFavoritePlace: async (
    data: ToggleFavoritePlaceRequest
  ): Promise<ToggleFavoritePlaceResponse> => {
    const response = await axiosInstance.post('/api/favorites/places', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
