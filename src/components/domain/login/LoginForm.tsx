import Button from '@/components/common/Button';
import AuthInput from '../auth/AuthInput';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '@/api/auth/login/loginHooks';
import Cookies from 'js-cookie';
import { useAuthStore } from '@store/useAuthStore';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LogInFormInputs = z.infer<typeof loginSchema>;

const LogInForm = () => {
  const navigate = useNavigate();
  const { setLogin } = useAuthStore((state) => state.actions);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const { mutate, isPending } = useLoginMutation({
    onSuccess: (response) => {
      Cookies.set('access_token', response.access_token);
      Cookies.set('refresh_token', response.refresh_token);
      setLogin();
      navigate(response.first_login ? '/language' : '/first-region-search');
    },
    onError: () => {
      showToast('아이디 또는 비밀번호가 일치하지않습니다.', 'error');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<LogInFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LogInFormInputs) => {
    mutate(data);
  };

  const getErrorMessage = (error: string) => {
    const errorMap: Record<string, string> = {
      '올바른 이메일 형식이 아닙니다.': t('auth.invalid_email_format'),
      '비밀번호를 입력해주세요.': t('auth.password_required'),
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
          type='email'
          {...register('email')}
          onClear={() => setValue('email', '')}
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
            type='password'
            {...register('password')}
            onClear={() => setValue('password', '')}
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
      </div>

      <Button
        type='submit'
        variant='active'
        className='mt-5'
        disabled={!isValid || isPending}
      >
        {isPending ? '로그인 중...' : t('auth.login')}
      </Button>
    </form>
  );
};

export default LogInForm;
