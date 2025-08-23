import { create } from 'zustand';
import Cookies from 'js-cookie';

// 로그인 상태만 포함하는 타입을 정의합니다.
export type LoginCheck = {
  isLogin: boolean;
};

// 스토어의 '상태' 부분에 대한 타입을 정의합니다.
type AuthState = {
  auth: LoginCheck;
};

// 스토어의 '액션' 부분에 대한 타입을 정의합니다.
type AuthActions = {
  actions: {
    setLogin: () => void;
    setLogout: () => void;
  };
};

// 스토어 전체의 타입을 정의합니다.
type AuthStoreType = AuthState & AuthActions;

// useAuthStore 훅을 생성합니다.
export const useAuthStore = create<AuthStoreType>((set) => {
  // ⭐️ 스토어 초기화 시 쿠키에서 액세스 토큰을 확인합니다.
  const accessToken = Cookies.get('access_token');
  const initialIsLogin = !!accessToken; // 토큰이 존재하면 true, 없으면 false

  return {
    // 초기 상태를 설정합니다. isLogin 값을 쿠키 유무에 따라 결정합니다.
    auth: {
      isLogin: initialIsLogin,
    },
    // 액션 함수들을 정의합니다.
    actions: {
      setLogin: () =>
        set(() => ({
          auth: {
            isLogin: true,
          },
        })),
      // ⭐️ 로그아웃 시 스토어 상태 변경과 함께 쿠키를 삭제합니다.
      setLogout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set(() => ({
          auth: {
            isLogin: false,
          },
        }));
      },
    },
  };
});
