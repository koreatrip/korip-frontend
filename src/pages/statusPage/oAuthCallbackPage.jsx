import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { snsLoginAPI } from '@/api/auth/snsLogin/snsLoginAPI.ts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import Modal, { Body, Header } from '@/components/common/Modal';
import { PulseLoader } from 'react-spinners';

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
        showToast('환영합니다!', 'success');

        const redirectTo = response.first_login
          ? '/language'
          : '/first-region-search';
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
      showToast('로그인에 실패하였습니다.', 'error');
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <PulseLoader color='#5c5c5cff' />
    </div>
  );
};

export default OAuthCallbackPage;
