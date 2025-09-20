// store/profileEditStore.ts (새로 만들 파일)

import { create } from 'zustand';
import type { UserProfileResponse } from '@/api/user/userType';

// handleInterestAdd에 필요한 타입
type Subcategory = { id: number; name: string };

// 스토어의 state 타입
type ProfileEditState = {
  isEditing: boolean;
  formData: UserProfileResponse | null; // 원본 데이터 (취소 시 복구용)
  tempFormData: UserProfileResponse | null; // 수정 중인 임시 데이터
};

// 스토어의 actions 타입
type ProfileEditActions = {
  actions: {
    initializeForm: (data: UserProfileResponse) => void;
    toggleEdit: () => void;
    setInputValue: (field: 'name' | 'phone_number', value: string) => void;
    addInterest: (interest: Subcategory) => void;
    removeInterest: (interestName: string) => void;
    commitChanges: () => void;
  };
};

// 최종 스토어 타입
type ProfileEditStore = {
  state: ProfileEditState;
} & ProfileEditActions;

export const useProfileEditStore = create<ProfileEditStore>((set) => ({
  // 초기 상태
  state: {
    isEditing: false,
    formData: null,
    tempFormData: null,
  },
  // 액션들
  actions: {
    // 폼 데이터 초기화 (페이지 첫 로드 시)
    initializeForm: (data) =>
      set({
        state: {
          isEditing: false,
          formData: data,
          tempFormData: data,
        },
      }),

    // 수정 모드 토글 (수정 시작 또는 취소)
    toggleEdit: () =>
      set((store) => ({
        state: {
          ...store.state,
          isEditing: !store.state.isEditing,
          // 취소 시에는 원본 데이터로 복구
          tempFormData: store.state.formData,
        },
      })),

    // input 값 변경 (이름, 전화번호)
    setInputValue: (field, value) =>
      set((store) => ({
        state: {
          ...store.state,
          tempFormData: store.state.tempFormData
            ? { ...store.state.tempFormData, [field]: value }
            : null,
        },
      })),

    // 관심사 추가
    addInterest: (interest) =>
      set((store) => {
        if (!store.state.tempFormData) return store;
        const newPreferences = [
          ...store.state.tempFormData.preferences_display,
          interest,
        ];
        return {
          state: {
            ...store.state,
            tempFormData: {
              ...store.state.tempFormData,
              preferences_display: newPreferences,
            },
          },
        };
      }),

    // 관심사 제거
    removeInterest: (interestName) =>
      set((store) => {
        if (!store.state.tempFormData) return store;
        const newPreferences =
          store.state.tempFormData.preferences_display.filter(
            (p) => p.name !== interestName
          );
        return {
          state: {
            ...store.state,
            tempFormData: {
              ...store.state.tempFormData,
              preferences_display: newPreferences,
            },
          },
        };
      }),

    // 변경사항 저장 성공 시
    commitChanges: () =>
      set((store) => ({
        state: {
          ...store.state,
          // 임시 데이터를 원본 데이터에 반영
          formData: store.state.tempFormData,
          isEditing: false,
        },
      })),
  },
}));
