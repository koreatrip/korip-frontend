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

// 비밀번호 변경 요청 타입
export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

// 회원 탈퇴 요청 타입
export type DeleteUserRequest = {
  password: string;
};

export type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};
