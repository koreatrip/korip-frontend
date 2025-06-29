import Container from '@/components/common/Container';
import HorizonLine from '@/components/common/HorizonLine';
import ToastMessage from '@/components/common/ToastMessage';
import AuthInput from '@/components/domain/auth/AuthInput';
import SocialLoginButtons from '@/components/domain/login/SocialLoginButtons';
import WelcomeCard from '@/components/domain/login/WelcomeCard';

import { useForm } from "react-hook-form"

  type SignUpFormInputs = {
  email: string;
  verificationCode: number; // 비밀번호 필드를 추가할 경우
  name:string;
  phoneNumber:string;
  password:string;
  confirmPassword:string;
  // 다른 필드들...
};

const SignUpPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, // errors 객체를 가져와 유효성 검사 메시지 표시
  } = useForm<SignUpFormInputs>({
    mode: 'onBlur', // 또는 'onChange', 'onSubmit' 등 유효성 검사 트리거 설정
  
  });

const onSubmit = (data: SignUpFormInputs) => {
    console.log('폼 데이터:', data);
    alert(`회원가입 시도: ${data.email}`);
  };


  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
      <WelcomeCard
        mainText='Create an account.'
        accountQuestionText={
          <>
            Enter your email below to create your account.
            <br />
            Or if you already have an account
          </>
        }
        linkHref='login'
        linkText='Log in'
      />


      {/* 회원가입 폼 */}
    <form onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            // register 함수를 스프레드 연산자로 AuthInput에 전달합니다.
            {...register('email', {
              required: '올바른 이메일 형식이 아닙니다.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
            type='email'
            label='Email' // label prop 추가
            placeholder='k@example.com'
            id='email' // id prop 추가 (label과 연결)
          />
          {errors.email && (
            <p className='text-red-500 text-sm my-2'>{errors.email.message}</p>
          )}

          <AuthInput
            {...register('password', {
              required: '비밀번호는 필수 입력입니다.',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 이상이어야 합니다.',
              },
            })}
            type='password'
            label='비밀번호'
            placeholder='비밀번호를 입력해주세요.'
            id='password'
            className='mt-4' // Tailwind CSS margin-top 추가 예시
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.password.message}
            </p>
          )}

          {/* 폼 제출 버튼 */}
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-3 rounded-lg mt-6 hover:bg-blue-600 transition-colors duration-200'
            disabled={!isValid} // 유효성 검사를 통과해야 버튼 활성화 (선택 사항)
          >
            계정 생성
          </button>
        </form>

      {/* 회원가입 폼 끝 */}
      <HorizonLine text='Or continue with  ' />
      <SocialLoginButtons />

      <ToastMessage
        message='이미 있는 회원입니다.'
        type='error'
        duration={3000}
        onClose={() => console.log('Toast closed')}
      />
    </div>
    </Container>
  );
};

export default SignUpPage;
