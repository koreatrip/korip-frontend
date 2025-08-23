// userAPI.ts
import axios from 'axios';
import {
  type UserProfile,
  type UpdateUserProfileRequest,
  type ChangePasswordRequest,
  type FindPasswordRequest,
  type UpdatePreferencesRequest,
  type TravelPlansResponse,
  type FavoritePlacesResponse,
  type FavoriteRegionsResponse,
  type UserProfileResponse,
  type ApiResponse,
  type ReissueTokenRequest,
  type ReissueTokenResponse,
} from './userType';

export const userAPI = {
  // 사용자 정보 조회
  getUserInfo: async (): Promise<UserProfileResponse> => {
    const response = await axios.get('/api/users/info?lang=ko', {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 사용자 정보 수정
  updateUserInfo: async (
    data: UpdateUserProfileRequest
  ): Promise<ApiResponse> => {
    const response = await axios.put('/api/users/info', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    const response = await axios.post('/api/users/change-pwd', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 비밀번호 찾기
  findPassword: async (data: FindPasswordRequest): Promise<ApiResponse> => {
    const response = await axios.post('/api/users/find-pwd', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 사용자 관심사 등록/수정
  updatePreferences: async (
    userId: number,
    data: UpdatePreferencesRequest
  ): Promise<ApiResponse> => {
    const response = await axios.post(
      `/api/users/${userId}/preferences`,
      data,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // 사용자 여행 일정 조회
  getTravelPlans: async (userId: number): Promise<TravelPlansResponse> => {
    const response = await axios.get(`/api/users/${userId}/travel-plans`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 사용자 즐겨찾기 장소 조회
  getFavoritePlaces: async (
    userId: number
  ): Promise<FavoritePlacesResponse> => {
    const response = await axios.get(`/api/users/${userId}/favorite-places`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 사용자 즐겨찾기 지역 조회
  getFavoriteRegions: async (
    userId: number
  ): Promise<FavoriteRegionsResponse> => {
    const response = await axios.get(`/api/users/${userId}/favorite-regions`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 즐겨찾기 장소 토글
  toggleFavoritePlace: async (
    userId: number,
    placeId: number
  ): Promise<ApiResponse> => {
    const response = await axios.post(
      `/api/users/${userId}/favorite-places/${placeId}/toggle`,
      {},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // 즐겨찾기 지역 토글
  toggleFavoriteRegion: async (
    userId: number,
    regionId: number
  ): Promise<ApiResponse> => {
    const response = await axios.post(
      `/api/users/${userId}/favorite-regions/${regionId}/toggle`,
      {},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  // 토큰 갱신
  reissueToken: async (
    data: ReissueTokenRequest
  ): Promise<ReissueTokenResponse> => {
    const response = await axios.post('/api/users/reissue-token', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
