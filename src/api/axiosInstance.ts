import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import Cookies from 'js-cookie';

const { VITE_BASE_URL } = import.meta.env;

// 토큰을 저장하고 가져오는 함수
const getAccessToken = (): string | undefined => Cookies.get('access_token');
const getRefreshToken = (): string | undefined => Cookies.get('refresh_token');

// 액세스 토큰 설정
export const setAccessToken = (token: string) => {
  Cookies.set('access_token', token, {
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

// 리프레시 토큰 설정
export const setRefreshToken = (token: string) => {
  Cookies.set('refresh_token', token, {
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

// 토큰을 제거하는 함수
export const clearTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

const axiosInstance = axios.create({
  baseURL: VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access_token = getAccessToken();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신 및 재시도 로직
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고, 재시도한 요청이 아닐 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 토큰 갱신이 이미 진행 중이면, 이 요청은 큐에 추가합니다.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest); // 갱신된 토큰으로 원래 요청을 다시 보냅니다.
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh_token = getRefreshToken();
      if (!refresh_token) {
        console.error('리프레시 토큰이 없습니다. 로그아웃 처리합니다.');
        clearTokens();
        window.location.href = '/login'; // 로그인 페이지로 리디렉션
        return Promise.reject(error);
      }

      try {
        // 토큰 갱신 API 호출 (이 API는 인증 인터셉터를 타지 않도록 기본 axios를 사용할 수 있습니다)
        const { data } = await axios.post('/api/auth/refresh', {
          refresh_token,
        });
        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신에 실패했습니다.', refreshError);
        clearTokens();
        if (refreshError instanceof Error) {
          processQueue(refreshError, null);
        } else {
          processQueue(new Error('Unknown error during token refresh'), null);
        }
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
