import { create } from 'zustand';

// 드롭다운 아이템 타입
export type DropdownItem = {
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
};

// 헤더 상태 타입
type HeaderType = {
  isMenuOpen: boolean;
  isLangDropdownOpen: boolean;
  isTravelDropdownOpen: boolean;
  isScheduleDropdownOpen: boolean; // 일정 추가 드롭다운 상태 추가
  scheduleDropdownCardId: string | null; // 어떤 카드의 드롭다운인지 추적
};

// 전체 스토어의 상태 타입
type HeaderState = {
  stack: HeaderType;
} & HeaderActions;

// 액션들의 타입 정의
type HeaderActions = {
  actions: {
    toggleMenu: () => void;
    closeMenu: () => void;
    toggleLangDropdown: () => void;
    closeLangDropdown: () => void;
    toggleTravelDropdown: () => void;
    closeTravelDropdown: () => void;
    toggleScheduleDropdown: (cardId?: string) => void; // 일정 드롭다운 토글
    closeScheduleDropdown: () => void; // 일정 드롭다운 닫기
    closeAllDropdowns: () => void;
    resetHeader: () => void;
  };
};

export const useHeaderStore = create<HeaderState>((set) => ({
  // 초기 상태 정의
  stack: {
    isMenuOpen: false,
    isLangDropdownOpen: false,
    isTravelDropdownOpen: false,
    isScheduleDropdownOpen: false,
    scheduleDropdownCardId: null,
  },
  // 액션들
  actions: {
    // 모바일 메뉴 토글
    toggleMenu: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isMenuOpen: !state.stack.isMenuOpen,
          // 메뉴 열릴 때 모든 드롭다운들 닫기
          isLangDropdownOpen: false,
          isTravelDropdownOpen: false,
          isScheduleDropdownOpen: false,
          scheduleDropdownCardId: null,
        },
      })),

    // 모바일 메뉴 닫기
    closeMenu: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isMenuOpen: false,
        },
      })),

    // 언어 드롭다운 토글
    toggleLangDropdown: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLangDropdownOpen: !state.stack.isLangDropdownOpen,
          // 다른 드롭다운 닫기
          isTravelDropdownOpen: false,
          isScheduleDropdownOpen: false,
          scheduleDropdownCardId: null,
        },
      })),

    // 언어 드롭다운 닫기
    closeLangDropdown: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLangDropdownOpen: false,
        },
      })),

    // 여행 드롭다운 토글
    toggleTravelDropdown: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isTravelDropdownOpen: !state.stack.isTravelDropdownOpen,
          // 다른 드롭다운 닫기
          isLangDropdownOpen: false,
          isScheduleDropdownOpen: false,
          scheduleDropdownCardId: null,
        },
      })),

    // 여행 드롭다운 닫기
    closeTravelDropdown: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isTravelDropdownOpen: false,
        },
      })),

    // 일정 드롭다운 토글
    toggleScheduleDropdown: (cardId?: string) =>
      set((state) => {
        const isSameCard = state.stack.scheduleDropdownCardId === cardId;
        const shouldOpen = !state.stack.isScheduleDropdownOpen || !isSameCard;

        return {
          stack: {
            ...state.stack,
            isScheduleDropdownOpen: shouldOpen,
            scheduleDropdownCardId: shouldOpen ? cardId || null : null,
            // 다른 드롭다운 닫기
            isLangDropdownOpen: false,
            isTravelDropdownOpen: false,
          },
        };
      }),

    // 일정 드롭다운 닫기
    closeScheduleDropdown: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isScheduleDropdownOpen: false,
          scheduleDropdownCardId: null,
        },
      })),

    // 모든 드롭다운 닫기
    closeAllDropdowns: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isLangDropdownOpen: false,
          isTravelDropdownOpen: false,
          isScheduleDropdownOpen: false,
          scheduleDropdownCardId: null,
        },
      })),

    // 헤더 상태 초기화
    resetHeader: () =>
      set((state) => ({
        stack: {
          ...state.stack,
          isMenuOpen: false,
          isLangDropdownOpen: false,
          isTravelDropdownOpen: false,
          isScheduleDropdownOpen: false,
          scheduleDropdownCardId: null,
        },
      })),
  },
}));
