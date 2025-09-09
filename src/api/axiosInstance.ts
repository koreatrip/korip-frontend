import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@store/useAuthStore'; // 주스탠드 스토어를 가져옵니다.

const { VITE_BASE_URL } = import.meta.env;

// 토큰 쿠키 관련 함수들의 타입 정의
export const getAccessToken = (): string | undefined =>
  Cookies.get('access_token');
export const getRefreshToken = (): string | undefined =>
  Cookies.get('refresh_token');

export const setAccessToken = (token: string): void => {
  Cookies.set('access_token', token, {
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

export const setRefreshToken = (token: string): void => {
  Cookies.set('refresh_token', token, {
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

export const clearTokens = (): void => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

// 토큰 갱신 요청에 인터셉터가 적용되지 않도록 별도의 인스턴스 생성
const refreshTokenInstance = axios.create({
  baseURL: VITE_BASE_URL,
});

const axiosInstance = axios.create({
  baseURL: VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (타입 정의 추가)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const access_token = getAccessToken();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// 응답 인터셉터 (타입 정의 수정)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    }; // 401 에러이고, 재시도한 요청이 아닐 때

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = getRefreshToken();
      if (!refresh_token) {
        console.error('리프레시 토큰이 없습니다. 로그아웃 처리합니다.');
        return Promise.reject(error);
      }

      try {
        // 별도의 인스턴스를 사용하여 토큰 갱신 API 호출
        const { data } = await refreshTokenInstance.post(
          '/api/users/reissue-token',
          {
            refresh_token,
          }
        );
        const newAccessToken = data.access_token;
        setAccessToken(newAccessToken);

        // 원래 요청의 헤더를 새로운 토큰으로 업데이트
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // 원래 요청을 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신에 실패했습니다.', refreshError); // 토큰 갱신 실패 시 주스탠드 상태도 로그아웃으로 설정
        useAuthStore.getState().actions.setLogout();
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
