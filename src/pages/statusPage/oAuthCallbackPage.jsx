import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { snsLoginAPI } from '@/api/auth/snsLogin/snsLoginAPI.ts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';

const OAuthCallbackPage = () => {
  const [status, setStatus] = useState('processing');
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
        showToast('로그인 성공 !', 'success');

        const redirectTo = response.first_login ? '/first-region-search' : '/';
        navigate(redirectTo);
      } catch (error) {
        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : error.message || '로그인을 실패하였습니다.';

        showToast(errorMessage, 'error');

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        setStatus('error');
      }
    };

    processOAuthCallback();
  }, [actions, navigate, showToast]);

  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        navigate('/');
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <>
      <p className='p-6 text-center text-lg font-medium'>
        {status === 'processing' && '로그인 중...'}
        {status === 'error' &&
          '로그인에 실패했습니다. 잠시 후 메인 페이지로 이동합니다.'}
      </p>
      {/* {status === 'processing' && <p>로그인 중</p>}
      {status === 'error' && (
        <>
          <p>로그인 실패</p>
          <button
            onClick={() => navigate('/')}
          >
            메인 페이지로 이동
          </button>
        </>
      )} */}
    </>
  );
};

export default OAuthCallbackPage;
