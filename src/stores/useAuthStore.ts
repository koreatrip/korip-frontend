import { create } from 'zustand';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/axiosInstance';
import type { UserProfileResponse } from '@/api/user/userType';

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
    initialize(): Promise<void>;
    setLogin: () => void;
    setLogout: () => void;
    setUser: (user: UserProfileResponse) => void;
  };
};

// 스토어 전체의 타입을 정의합니다.
type AuthStoreType = AuthState & AuthActions;

// useAuthStore 훅을 생성합니다.
export const useAuthStore = create<AuthStoreType>((set) => {
  // // 초기화 시점에 바로 쿠키 확인
  // const accessToken = Cookies.get('access_token');
  // const initialIsLogin = !!accessToken;

  return {
    auth: {
      isLogin: false,
      isInitialized: false, // 이미 초기화됨
    },
    actions: {
      initialize: async () => {
        // // 이미 초기화되었지만 다시 확인이 필요한 경우
        // const accessToken = Cookies.get('access_token');
        // set(() => ({
        //   auth: {
        //     isLogin: !!accessToken,
        //     isInitialized: true,
        //   },
        // }));
        const accessToken = Cookies.get('access_token');

        if (!accessToken) {
          set({ auth: { isLogin: false, isInitialized: true } });
          return;
        }

        //쿠키가 있으면 서버에 진짜 유효한지 확인
        try {
          await axiosInstance.get('api/users/info');
          set({ auth: { isLogin: true, isInitialized: true } });
        } catch {
          // 서버가 401 반환 = 토큰 만료 or 무효
          // axiosInstance 인터셉터가 리프레시 토큰 갱신 시도하고
          // 그것도 실패하면 여기 catch로 던져임
          set({ auth: { isLogin: false, isInitialized: true } });
        }
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
      setUser: (user: UserProfileResponse) =>
        set((state) => ({
          auth: { ...state.auth, user },
        })),
    },
  };
});
