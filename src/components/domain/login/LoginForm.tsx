import Button from '@/components/common/Button';
import AuthInput from '../auth/AuthInput';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLoginMutation } from '@/api/auth/login/loginHooks';
import Cookies from 'js-cookie';
import { useAuthStore } from '@store/useAuthStore'; // ⭐️ 1. useAuthStore 임포트
import { useToast } from '@/hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LogInFormInputs = z.infer<typeof loginSchema>;

const LogInForm = () => {
  const navigate = useNavigate();
  const { setLogin } = useAuthStore((state) => state.actions); // ⭐️ 2. setLogin 액션 가져오기
  const { showToast } = useToast();

  const { mutate, isPending } = useLoginMutation({
    onSuccess: (response) => {
      console.log('로그인 성공:', response);

      Cookies.set('access_token', response.access_token);
      Cookies.set('refresh_token', response.refresh_token);

      setLogin(); // ⭐️ 3. 로그인 성공 시 setLogin 호출

      if (response.first_login) {
        navigate('/language');
      } else {
        navigate('/first-region-search');
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      showToast('아이디 또는 비밀번호가 일치하지않습니다.', 'error');
    },
  });

  // ... (나머지 코드는 동일)
  const { t } = useTranslation();
  const [loginError, setLoginError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useForm<LogInFormInputs>({
    mode: 'onBlur',
  });

  const onSubmit = (data: LogInFormInputs) => {
    console.log('로그인 폼 데이터:', data);
    mutate(data);
  };

  const handleAuthInputClear = (name: string, value: string) => {
    setValue(name as keyof LogInFormInputs, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (loginError) {
      setLoginError('');
    }
  };

  const getErrorMessage = (error: string) => {
    const errorMap: Record<string, string> = {
      '올바른 이메일 형식이 아닙니다.': t('auth.invalid_email_format'),
      '비밀번호를 입력하세요.': t('auth.password_required'),
      '이메일을 입력하세요.': t('auth.email_required'),
    };
    return errorMap[error] || error;
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex w-full flex-col gap-4'
    >
      <div>
        <AuthInput
          label={t('auth.email')}
          placeholder='k@example.com'
          id='email'
          {...register('email', {
            required: t('auth.email_required'),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: t('auth.invalid_email_format'),
            },
          })}
          type='email'
          onClear={handleAuthInputClear}
        />
        {errors.email && (
          <p className='text-error-red my-2 text-sm'>
            {getErrorMessage(errors.email.message!)}
          </p>
        )}
      </div>

      <div>
        <div className='relative'>
          <AuthInput
            label={t('auth.password')}
            placeholder={t('auth.enter_password')}
            id='password'
            {...register('password', {
              required: t('auth.password_required'),
            })}
            type='password'
            onClear={handleAuthInputClear}
            className='flex-grow'
          />

          <Link
            to='/forgot-password'
            className='text-main-pink absolute -top-1 -right-0.5 mt-2 ml-4 text-sm whitespace-nowrap hover:underline'
          >
            {t('auth.forgot_password')}
          </Link>
        </div>
        {errors.password && (
          <p className='text-error-red mt-1 text-sm'>
            {errors.password.message}
          </p>
        )}
        {loginError && (
          <p className='text-error-red mt-1 text-sm'>{loginError}</p>
        )}
      </div>

      <Button
        type='submit'
        variant='active'
        className='mt-5'
        disabled={!isValid || isSubmitting}
      >
        {isPending ? '로그인 중...' : t('auth.login')}
      </Button>
    </form>
  );
};

export default LogInForm;
