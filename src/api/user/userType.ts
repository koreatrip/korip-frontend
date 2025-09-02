// userType.ts

// 사용자 선호도 타입
export type UserPreference = {
  id: number;
  name: string;
};

// 실제 API 응답에 맞춘 사용자 프로필 타입
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

// API 요청 타입
export type UpdateUserRequest = {
  name?: string;
  phone_number?: string;
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
