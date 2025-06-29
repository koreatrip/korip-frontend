// import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import AuthInput from '../auth/AuthInput'; // AuthInput 컴포넌트 경로 확인
import { useForm } from 'react-hook-form'; // useForm 임포트
import { z } from 'zod';
import { Link } from 'react-router';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

type LogInFormInputs = z.infer<typeof loginSchema>; // Zod 스키마로부터 타입 추론

const LogInForm = () => {
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

  const onSubmit = async (data: LogInFormInputs) => {
    console.log('로그인 폼 데이터:', data);
    // 실제 로그인 API 호출 로직
    // try {
    //   await loginApiCall(data);
    //   // 로그인 성공 처리
    // } catch (error) {
    //   // 로그인 실패 처리
    // }
  };

  // AuthInput의 onClear prop에 연결할 함수 (react-hook-form의 setValue를 사용)
  const handleAuthInputClear = (name: string, value: string) => {
    // AuthInput에서 전달받은 name으로 해당 필드의 값을 초기화
    setValue(name as keyof LogInFormInputs, value, {
      shouldValidate: true, // 클리어 후 유효성 재검사 (선택 사항)
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex w-full flex-col gap-4'
    >
      <div>
        <AuthInput
          label='Email'
          placeholder='k@example.com'
          id='email' // AuthInput에 id prop 전달
          // react-hook-form의 register를 스프레드합니다.
          // register가 value, onChange, onBlur, ref 등을 AuthInput에 전달합니다.
          {...register('email', {
            required: '이메일은 필수 입력입니다.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: '올바른 이메일 형식이 아닙니다.',
            },
          })}
          type='email'
          onClear={handleAuthInputClear} // onClear prop을 연결
        />
        {errors.email && (
          <p className='my-2 text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className='relative'>
          {/* AuthInput이 label을 포함하므로, 이 label은 AuthInput 안으로 들어갑니다. */}
          <AuthInput
            label='Password'
            placeholder='비밀번호를 입력해주세요.'
            id='password' // AuthInput에 id prop 전달
            {...register('password', {
              required: '비밀번호는 필수 입력입니다.',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 이상이어야 합니다.',
              },
            })}
            type='password'
            onClear={handleAuthInputClear} // onClear prop을 연결
            className='flex-grow' // Link와의 공간 분배를 위해 flex-grow 추가 (필요 시)
          />

          <Link
            to='/forgot-password'
            className='text-main-pink absolute -top-1 -right-0.5 mt-2 ml-4 text-sm whitespace-nowrap hover:underline' // ml-4 마진 추가, 줄바꿈 방지
          >
            Forgot Password?
          </Link>
        </div>
        {errors.password && (
          <p className='mt-1 text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>

      <Button
        type='submit'
        variant='active'
        className='mt-5'
        disabled={!isValid || isSubmitting} // 유효성 검사 통과 및 제출 중일 때 비활성화
      >
        Login
      </Button>
    </form>
  );
};

export default LogInForm;
