// useFindPassword.ts
import { useFindPasswordMutation } from '@/api/auth/account/accountHooks';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useFindPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useFindPasswordMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || '이메일 발송에 실패했습니다.');
    },
  });

  // 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(t('auth.please_enter_email'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.invalid_email_format'));
      return;
    }

    setError('');
    forgotPasswordMutation.mutate({ email });
  };

  // 입력값 변경 핸들러 (에러 초기화 포함)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  // 초기화 핸들러
  const handleReset = () => {
    setEmail('');
    setError('');
  };

  return {
    formState: { email, error, isSubmitted },
    handlers: { handleSubmit, handleEmailChange, handleReset }, // 수정된 핸들러들
    isLoading: forgotPasswordMutation.isPending,
  };
};
