// import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import AuthInput from '../auth/AuthInput'; // AuthInput 컴포넌트 경로 확인
import { useForm } from 'react-hook-form'; // useForm 임포트
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLoginMutation } from '@/api/auth/login/loginHooks';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LogInFormInputs = z.infer<typeof loginSchema>; // Zod 스키마로부터 타입 추론

const LogInForm = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동
  const { mutate, isPending } = useLoginMutation({
    onSuccess: (response) => {
      console.log('로그인 성공:', response);

      Cookies.set('access_token', response.access_token);
      Cookies.set('refresh_token', response.refresh_token);

      if (response.first_login) {
        // 첫 로그인인 경우
        navigate('/language');
      } else {
        navigate('/first-region-search');
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      // 로그인 실패 시 에러 메시지 설정
    },
  });

  const { t } = useTranslation();
  const [loginError, setLoginError] = useState<string>(''); // 나중에 api 연결했을때 이메일또는 비밀번호가 일치하지않다라는 메세지 받을때 사용하거나 아니면 다른걸로 대체해서 경고 텍스트 보여주세용
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, // isSubmitting 상태도 가져와 제출 중 UI 처리
    setValue, // AuthInput의 onClear를 위해 setValue 함수 가져오기
    // watch, // 비밀번호 확인 등 필요 시
  } = useForm<LogInFormInputs>({
    // resolver: zodResolver(loginSchema), // Zod Resolver 연동 (선택 사항)
    mode: 'onBlur',
  });

  const onSubmit = (data: LogInFormInputs) => {
    console.log('로그인 폼 데이터:', data);
    // useLoginMutation에서 반환된 mutate 함수를 호출하고, 폼 데이터를 인자로 전달합니다.
    mutate(data);
  };

  // AuthInput의 onClear prop에 연결할 함수 (react-hook-form의 setValue를 사용)
  const handleAuthInputClear = (name: string, value: string) => {
    // AuthInput에서 전달받은 name으로 해당 필드의 값을 초기화
    setValue(name as keyof LogInFormInputs, value, {
      shouldValidate: true, // 클리어 후 유효성 재검사 (선택 사항)
      shouldDirty: true,
      shouldTouch: true,
    });

    // 입력값이 변경되면 로그인 에러 초기화
    if (loginError) {
      setLoginError('');
    }
  };

  /**
   * 요거는 변경원이 만들었슈. 번역이슈로 만들었음
   * 에러 메세지 번역 매핑
   */
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
      onSubmit={handleSubmit(onSubmit)} // react-hook-form의 handleSubmit 사용
      className='flex w-full flex-col gap-4'
    >
      <div>
        <AuthInput
          label={t('auth.email')}
          placeholder='k@example.com'
          id='email' // AuthInput에 id prop 전달
          // react-hook-form의 register를 스프레드합니다.
          // register가 value, onChange, onBlur, ref 등을 AuthInput에 전달합니다.
          {...register('email', {
            required: t('auth.email_required'),
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: t('auth.invalid_email_format'),
            },
          })}
          type='email'
          onClear={handleAuthInputClear} // onClear prop을 연결
        />
        {errors.email && (
          <p className='text-error-red my-2 text-sm'>
            {getErrorMessage(errors.email.message!)}
          </p>
        )}
      </div>

      <div>
        <div className='relative'>
          {/* AuthInput이 label을 포함하므로, 이 label은 AuthInput 안으로 들어갑니다. */}
          <AuthInput
            label={t('auth.password')}
            placeholder={t('auth.enter_password')}
            id='password' // AuthInput에 id prop 전달
            {...register('password', {
              required: t('auth.password_required'),
              // minLength: {
              //   value: 6,
              //   message: '비밀번호는 최소 6자 이상이어야 합니다.',
              // },
            })}
            type='password'
            onClear={handleAuthInputClear} // onClear prop을 연결
            className='flex-grow' // Link와의 공간 분배를 위해 flex-grow 추가 (필요 시)
          />

          <Link
            to='/forgot-password'
            className='text-main-pink absolute -top-1 -right-0.5 mt-2 ml-4 text-sm whitespace-nowrap hover:underline' // ml-4 마진 추가, 줄바꿈 방지
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
        disabled={!isValid || isSubmitting} // 유효성 검사 통과 및 제출 중일 때 비활성화
      >
        {isPending ? '로그인 중...' : t('auth.login')}
      </Button>
    </form>
  );
};

export default LogInForm;
