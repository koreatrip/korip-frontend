import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { snsLoginAPI } from '@/api/auth/snsLogin/snsLoginAPI.ts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { PulseLoader } from 'react-spinners';

const OAuthCallbackPage = () => {
  const { actions } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth 인증 실패: ${error}`);
        }

        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        const loginData = {
          code: code,
          phone_number: '010-0000-0000',
          provider: 'google',
        };

        const response = await snsLoginAPI(loginData);

        Cookies.set('access_token', response.access_token, { expires: 7 });
        Cookies.set('refresh_token', response.refresh_token, { expires: 30 });
        actions.setLogin();

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        showToast('환영합니다!', 'success');

        const redirectTo = response.first_login ? '/language' : '/';
        navigate(redirectTo);
      } catch (err: unknown) {
        // ✅ 사용자 친화적인 에러 메시지 생성
        let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';

        if (err instanceof AxiosError) {
          const status = err.response?.status;

          // 백엔드에서 제공하는 사용자 친화적 메시지가 있으면 사용
          const backendMessage = err.response?.data?.message;

          if (
            backendMessage &&
            !backendMessage.includes('500') &&
            !backendMessage.includes('error')
          ) {
            errorMessage = backendMessage;
          } else if (status === 400) {
            errorMessage = '잘못된 요청입니다. 다시 시도해주세요.';
          } else if (status === 401) {
            errorMessage = '인증에 실패했습니다. 다시 로그인해주세요.';
          } else if (status === 403) {
            errorMessage = '접근 권한이 없습니다.';
          } else if (status === 404) {
            errorMessage = '요청한 정보를 찾을 수 없습니다.';
          } else if (status && status >= 500) {
            errorMessage =
              '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else if (err.message === 'Network Error') {
            errorMessage = '네트워크 연결을 확인해주세요.';
          }
        } else if (err instanceof Error) {
          // OAuth 관련 특정 에러만 표시
          if (err.message.includes('OAuth 인증 실패')) {
            errorMessage = '로그인 인증에 실패했습니다. 다시 시도해주세요.';
          } else if (err.message.includes('인증 코드가 없습니다')) {
            errorMessage = '로그인 정보가 올바르지 않습니다.';
          }
        }

        showToast(errorMessage, 'error');

        console.error('로그인 에러:', err); // 개발자용 로그

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    processOAuthCallback();
  }, [actions, navigate, showToast]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <PulseLoader color='#5c5c5cff' />
    </div>
  );
};

export default OAuthCallbackPage;
