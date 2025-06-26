import HorizonLine from '@/components/common/HorizonLine';
import LoginForm from '@/components/login/LoginForm';
import WelcomeCard from '@/components/login/WelcomeCard';
import SocialLoginButtons from '@/components/login/SocialLoginButtons';

const LoginPage = () => {
  return (
    <div className='w-full flex-col items-center justify-center p-8'>
      <WelcomeCard
        accountQuestionText="Don't have an account?"
        linkText='Sign Up'
        linkHref='/signup'
      />
      <LoginForm />
      <HorizonLine text='Or continue with  ' />
      <SocialLoginButtons />
    </div>
  );
};

export default LoginPage;
