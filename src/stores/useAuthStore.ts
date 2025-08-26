import { create } from 'zustand';
import Cookies from 'js-cookie';

// 로그인 상태만 포함하는 타입을 정의합니다.
export type LoginCheck = {
  isLogin: boolean;
  isInitialized: boolean;
};

// 스토어의 '상태' 부분에 대한 타입을 정의합니다.
type AuthState = {
  auth: LoginCheck;
};

// 스토어의 '액션' 부분에 대한 타입을 정의합니다.
type AuthActions = {
  actions: {
    initialize(): unknown;
    setLogin: () => void;
    setLogout: () => void;
  };
};

// 스토어 전체의 타입을 정의합니다.
type AuthStoreType = AuthState & AuthActions;

// useAuthStore 훅을 생성합니다.
export const useAuthStore = create<AuthStoreType>((set, get) => {
  // 초기화 시점에 바로 쿠키 확인
  const accessToken = Cookies.get('access_token');
  const initialIsLogin = !!accessToken;

  return {
    auth: {
      isLogin: initialIsLogin,
      isInitialized: true, // 이미 초기화됨
    },
    actions: {
      initialize: () => {
        // 이미 초기화되었지만 다시 확인이 필요한 경우
        const accessToken = Cookies.get('access_token');
        set(() => ({
          auth: {
            isLogin: !!accessToken,
            isInitialized: true,
          },
        }));
      },
      setLogin: () =>
        set(() => ({
          auth: {
            isLogin: true,
            isInitialized: true,
          },
        })),
      setLogout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set(() => ({
          auth: {
            isLogin: false,
            isInitialized: true,
          },
        }));
      },
    },
  };
});
