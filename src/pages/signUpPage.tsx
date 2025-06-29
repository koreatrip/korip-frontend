import WelcomeCard from '@/components/login/WelcomeCard';
import HorizonLine from '@/components/common/HorizonLine';
import SocialLoginButtons from '@/components/login/SocialLoginButtons';
import ToastMessage from '@/components/common/ToastMessage';

const SignUpPage = () => {
  return (
    <div className='m-auto max-w-[500px] flex-col items-center justify-center px-8'>
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
      <HorizonLine text='Or continue with  ' />
      <SocialLoginButtons />

      <ToastMessage
        message='이미 있는 회원입니다.'
        type='error'
        duration={3000}
        onClose={() => console.log('Toast closed')}
      />
    </div>
  );
};

export default SignUpPage;
