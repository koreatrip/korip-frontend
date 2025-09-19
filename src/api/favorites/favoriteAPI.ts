import axiosInstance from '../axiosInstance';
import {
  type FavoritePlacesResponse,
  type FavoriteRegionsResponse,
  type ToggleFavoritePlaceRequest,
  type ToggleFavoriteRegionRequest,
  type ToggleFavoritePlaceResponse,
  type ToggleFavoriteRegionResponse,
  type GetFavoritePlacesParams,
  type GetFavoriteRegionsParams,
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

  // 즐겨찾기 지역 목록 조회 (GET)
  getFavoriteRegions: async (
    params: GetFavoriteRegionsParams = {}
  ): Promise<FavoriteRegionsResponse> => {
    const { lang = 'ko', page = 1 } = params;

    const response = await axiosInstance.get('/api/favorites/regions', {
      params: { lang, page },
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 즐겨찾기 장소 토글 (POST)
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

  // 즐겨찾기 지역 토글 (POST)
  toggleFavoriteRegion: async (
    data: ToggleFavoriteRegionRequest
  ): Promise<ToggleFavoriteRegionResponse> => {
    const response = await axiosInstance.post('/api/favorites/regions', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
