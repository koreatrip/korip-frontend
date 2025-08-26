// userType.ts
export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  profileImage?: string;
  joinDate: string;
  stats: {
    travelPlans: number;
    favorites: number;
    visitedPlaces: number;
  };
};

export type UpdateUserProfileRequest = {
  name?: string;
  email?: string;
  phone?: string;
  interests?: string[];
  profileImage?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type FindPasswordRequest = {
  email: string;
  phone?: string;
};

export type UpdatePreferencesRequest = {
  interests: string[];
};

// 여행 일정 관련 타입
export type TravelPlan = {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
};

// 즐겨찾기 장소 관련 타입
export type FavoritePlace = {
  id: number;
  type: string;
  title: string;
  description: string;
  details: string;
  location: string;
  imageUrl: string | null;
  isFavorite: boolean;
  createdAt: string;
};

// 즐겨찾기 지역 관련 타입
export type FavoriteRegion = {
  id: number;
  type: string;
  title: string;
  description: string;
  details: string | null;
  location: string;
  imageUrl: string | null;
  isFavorite: boolean;
  createdAt: string;
};

// API 응답 타입들
export type TravelPlansResponse = {
  success: boolean;
  data: TravelPlan[];
  message?: string;
};

export type FavoritePlacesResponse = {
  success: boolean;
  data: FavoritePlace[];
  message?: string;
};

export type FavoriteRegionsResponse = {
  success: boolean;
  data: FavoriteRegion[];
  message?: string;
};

// 토큰 갱신 관련 타입
export type ReissueTokenRequest = {
  refreshToken: string;
};

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type ReissueTokenResponse = {
  success: boolean;
  data: TokenData;
  message?: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// userType.ts
export type UserPreference = {
  id: number;
  name: string;
};

export type UserProfileResponse = {
  id: number;
  email: string;
  name: string;
  phone_number: string;
  login_type: string;
  is_social: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  preferences_display: UserPreference[];
};

// API 요청/응답 타입들
export type UpdateUserRequest = {
  name?: string;
  phone_number?: string;
};

// export type UpdateUserResponse = {
//   user: User;
// };
