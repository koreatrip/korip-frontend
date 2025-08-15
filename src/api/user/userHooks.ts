// userHooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI } from './userAPI';
import type {
  UpdateUserProfileRequest,
  ChangePasswordRequest,
  FindPasswordRequest,
  UpdatePreferencesRequest,
  ReissueTokenRequest,
} from './userType';

// 사용자 정보 조회 Hook
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userAPI.getUserInfo,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1, // API 실패 시 1회만 재시도
    retryDelay: 1000, // 1초 후 재시도
  });
};

// 사용자 정보 수정 Hook
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => userAPI.updateUserInfo(data),
    onSuccess: () => {
      // 사용자 정보 쿼리 무효화하여 재조회
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

// 비밀번호 변경 Hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => userAPI.changePassword(data),
  });
};

// 비밀번호 찾기 Hook
export const useFindPassword = () => {
  return useMutation({
    mutationFn: (data: FindPasswordRequest) => userAPI.findPassword(data),
  });
};

// 사용자 관심사 업데이트 Hook
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdatePreferencesRequest }) => 
      userAPI.updatePreferences(userId, data),
    onSuccess: () => {
      // 사용자 정보 쿼리 무효화하여 재조회
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};

// 사용자 여행 일정 조회 Hook
export const useTravelPlans = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'travel-plans'],
    queryFn: () => userAPI.getTravelPlans(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 사용자 즐겨찾기 장소 조회 Hook
export const useFavoritePlaces = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'favorite-places'],
    queryFn: () => userAPI.getFavoritePlaces(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 사용자 즐겨찾기 지역 조회 Hook
export const useFavoriteRegions = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId, 'favorite-regions'],
    queryFn: () => userAPI.getFavoriteRegions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 즐겨찾기 장소 토글 Hook
export const useToggleFavoritePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, placeId }: { userId: number; placeId: number }) => 
      userAPI.toggleFavoritePlace(userId, placeId),
    onSuccess: (_, { userId }) => {
      // 즐겨찾기 장소 목록 재조회
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'favorite-places'] });
    },
  });
};

// 즐겨찾기 지역 토글 Hook
export const useToggleFavoriteRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, regionId }: { userId: number; regionId: number }) => 
      userAPI.toggleFavoriteRegion(userId, regionId),
    onSuccess: (_, { userId }) => {
      // 즐겨찾기 지역 목록 재조회
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'favorite-regions'] });
    },
  });
};

// 토큰 갱신 Hook
export const useReissueToken = () => {
  return useMutation({
    mutationFn: (data: ReissueTokenRequest) => userAPI.reissueToken(data),
  });
};

