import { create } from 'zustand';

// 모달 상태 타입
type ModalType = {
  isLoginPromptOpen: boolean;
  isAccountDeleteOpen: boolean;
  isPasswordChangeOpen: boolean;
  isIdolApplicationOpen: boolean;
  isCreateTripOpen: boolean;
  // 약관 관련 모달 추가
  isTermsOfServiceOpen: boolean;
  isPrivacyPolicyOpen: boolean;
  isLocationServiceOpen: boolean;
  // 확장 가능한 구조
};

// 모달 데이터 타입 (각 모달에 필요한 데이터)
type ModalData = {
  loginPrompt: null;
  accountDelete: null;
  passwordChange: null;
  idolApplication: {
    groupName?: string;
    memberName?: string;
  } | null;
  createTrip: null;
  // 약관 관련 데이터 추가
  termsOfService: null;
  privacyPolicy: null;
  locationService: null;
  // 다른 모달 데이터들...
};

// 전체 스토어의 상태 타입
type ModalState = {
  stack: ModalType;
  data: ModalData;
} & ModalActions;

// 액션들의 타입 정의
type ModalActions = {
  actions: {
    // 로그인 프롬프트 모달
    openLoginPrompt: () => void;
    closeLoginPrompt: () => void;

    // 계정 탈퇴 모달
    openAccountDelete: () => void;
    closeAccountDelete: () => void;

    // 비밀번호 변경 모달
    openPasswordChange: () => void;
    closePasswordChange: () => void;

    // 아이돌 신청 모달
    openIdolApplication: (data?: {
      groupName?: string;
      memberName?: string;
    }) => void;
    closeIdolApplication: () => void;

    // 여행 일정 생성 모달
    openCreateTrip: () => void;
    closeCreateTrip: () => void;

    // 약관 관련 모달들 추가
    openTermsOfService: () => void;
    closeTermsOfService: () => void;
    openPrivacyPolicy: () => void;
    closePrivacyPolicy: () => void;
    openLocationService: () => void;
    closeLocationService: () => void;

    // 유틸리티 액션들
    closeAllModals: () => void;
    resetModals: () => void;
  };
};

export const useModalStore = create<ModalState>((set) => ({
  // 초기 상태 정의
  stack: {
    isLoginPromptOpen: false,
    isAccountDeleteOpen: false,
    isPasswordChangeOpen: false,
    isIdolApplicationOpen: false,
    isCreateTripOpen: false,
    // 약관 모달 초기 상태 추가
    isTermsOfServiceOpen: false,
    isPrivacyPolicyOpen: false,
    isLocationServiceOpen: false, // 추가됨
  },

  // 모달 데이터 초기 상태
  data: {
    loginPrompt: null,
    accountDelete: null,
    passwordChange: null,
    idolApplication: null,
    createTrip: null,
    // 약관 데이터 초기 상태 추가
    termsOfService: null,
    privacyPolicy: null,
    locationService: null, // 추가됨
  },

  // 액션들
  actions: {
    // 기존 액션들...
    openLoginPrompt: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLoginPromptOpen: true,
        },
      })),

    closeLoginPrompt: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLoginPromptOpen: false,
        },
      })),

    openAccountDelete: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isAccountDeleteOpen: true,
        },
      })),

    closeAccountDelete: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isAccountDeleteOpen: false,
        },
      })),

    openPasswordChange: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isPasswordChangeOpen: true,
        },
      })),

    closePasswordChange: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isPasswordChangeOpen: false,
        },
      })),

    openIdolApplication: (data) =>
      set((state) => ({
        stack: {
          ...state.stack,
          isIdolApplicationOpen: true,
        },
        data: {
          ...state.data,
          idolApplication: data || null,
        },
      })),

    closeIdolApplication: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isIdolApplicationOpen: false,
        },
        data: {
          ...state.data,
          idolApplication: null,
        },
      })),

    openCreateTrip: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isCreateTripOpen: true,
        },
      })),

    closeCreateTrip: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isCreateTripOpen: false,
        },
      })),

    // 약관 관련 액션들 추가
    openTermsOfService: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isTermsOfServiceOpen: true,
        },
      })),

    closeTermsOfService: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isTermsOfServiceOpen: false,
        },
      })),

    openPrivacyPolicy: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isPrivacyPolicyOpen: true,
        },
      })),

    closePrivacyPolicy: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isPrivacyPolicyOpen: false,
        },
      })),

    // 위치 서비스 모달 액션들 추가
    openLocationService: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLocationServiceOpen: true,
        },
      })),

    closeLocationService: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLocationServiceOpen: false,
        },
      })),

    // 모든 모달 닫기 (약관 모달 포함)
    closeAllModals: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLoginPromptOpen: false,
          isAccountDeleteOpen: false,
          isPasswordChangeOpen: false,
          isIdolApplicationOpen: false,
          isCreateTripOpen: false,
          isTermsOfServiceOpen: false,
          isPrivacyPolicyOpen: false,
          isLocationServiceOpen: false, // 추가됨
        },
        data: {
          loginPrompt: null,
          accountDelete: null,
          passwordChange: null,
          idolApplication: null,
          createTrip: null,
          termsOfService: null,
          privacyPolicy: null,
          locationService: null, // 추가됨
        },
      })),

    // 모달 상태 초기화 (약관 모달 포함)
    resetModals: () =>
      set(() => ({
        stack: {
          isLoginPromptOpen: false,
          isAccountDeleteOpen: false,
          isPasswordChangeOpen: false,
          isIdolApplicationOpen: false,
          isCreateTripOpen: false,
          isTermsOfServiceOpen: false,
          isPrivacyPolicyOpen: false,
          isLocationServiceOpen: false, // 추가됨
        },
        data: {
          loginPrompt: null,
          accountDelete: null,
          passwordChange: null,
          idolApplication: null,
          createTrip: null,
          termsOfService: null,
          privacyPolicy: null,
          locationService: null, // 추가됨
        },
      })),
  },
}));
