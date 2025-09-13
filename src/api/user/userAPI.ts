// userAPI.ts
import axios from 'axios';
import {
  type UpdateUserRequest,
  type UserProfileResponse,
  type ApiResponse,
  type ChangePasswordRequest,
  type DeleteUserRequest,
} from './userType';
import axiosInstance from '../axiosInstance';

export const userAPI = {
  // 사용자 정보 조회
  getUserInfo: async (): Promise<UserProfileResponse> => {
    const response = await axiosInstance.get('/api/users/info', {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  // 사용자 정보 수정
  updateUserInfo: async (data: UpdateUserRequest): Promise<ApiResponse> => {
    const response = await axiosInstance.patch('/api/users/info', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 회원 탈퇴
  deleteUser: async (data: DeleteUserRequest): Promise<ApiResponse> => {
    const response = await axiosInstance.delete('/api/users/info', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data, // DELETE 요청에 body 데이터 포함
    });
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (data: ChangePasswordRequest) => {
    const response = await axiosInstance.post('/api/users/change-pwd', data, {
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
};
