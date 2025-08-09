import { create } from 'zustand';

// 모달 상태 타입
type ModalType = {
  isLoginPromptOpen: boolean;
  isAccountDeleteOpen: boolean;
  isPasswordChangeOpen: boolean;
  isIdolApplicationOpen: boolean;
  isCreateTripOpen: boolean;
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

    // 여행 일정 생성 모달 (추가)
    openCreateTrip: () => void;
    closeCreateTrip: () => void;

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
  },

  // 모달 데이터 초기 상태
  data: {
    loginPrompt: null,
    accountDelete: null,
    passwordChange: null,
    idolApplication: null,
    createTrip: null,
  },

  // 액션들
  actions: {
    // 로그인 프롬프트 모달
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

    // 계정 탈퇴 모달
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

    // 비밀번호 변경 모달
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

    // 아이돌 신청 모달 (데이터와 함께)
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

    // 여행 일정 생성 모달 (추가)
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

    // 모든 모달 닫기
    closeAllModals: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLoginPromptOpen: false,
          isAccountDeleteOpen: false,
          isPasswordChangeOpen: false,
          isIdolApplicationOpen: false,
          isCreateTripOpen: false,
        },
        data: {
          loginPrompt: null,
          accountDelete: null,
          passwordChange: null,
          idolApplication: null,
          createTrip: null,
        },
      })),

    // 모달 상태 초기화
    resetModals: () =>
      set(() => ({
        stack: {
          isLoginPromptOpen: false,
          isAccountDeleteOpen: false,
          isPasswordChangeOpen: false,
          isIdolApplicationOpen: false,
          isCreateTripOpen: false,
        },
        data: {
          loginPrompt: null,
          accountDelete: null,
          passwordChange: null,
          idolApplication: null,
          createTrip: null,
        },
      })),
  },
}));
