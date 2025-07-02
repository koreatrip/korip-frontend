import { useState } from 'react';
import Container from '@/components/common/Container';
import HorizonLine from '@/components/common/HorizonLine';
import ToastMessage from '@/components/common/ToastMessage';
import SocialLoginButtons from '@/components/domain/login/SocialLoginButtons';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SignUpForm from '@/components/domain/login/SignUpForm';

// Zod 스키마 정의 (유효성 검사를 강화하고 SignUpFormInputs 타입을 정의합니다)

const SignUpPage = () => {
  // ToastMessage 상태 관리
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'info'
  );

  return (
    <Container>
      <div className='m-auto flex max-w-[540px] flex-col items-center justify-center p-8'>
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
<SignUpForm />
        <HorizonLine text='Or continue with' className='my-8' />{' '}
        {/* 마진 추가 */}
        <SocialLoginButtons className={'w-full'} />
        {/* ToastMessage 조건부 렌더링 */}
        {showToast && (
          <ToastMessage
            message={toastMessage}
            type={toastType}
            duration={3000}
            onClose={() => setShowToast(false)} // 토스트 닫힐 때 상태 초기화
          />
        )}
      </div>
    </Container>
  );
};

export default SignUpPage;
