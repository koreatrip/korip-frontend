import HorizonLine from '@/components/common/HorizonLine';
import LogInForm from '@/components/login/LogInForm';
import WelcomeCard from '@/components/login/WelcomeCard';
import SocialLoginButtons from '@/components/login/SocialLoginButtons';

const LogInPage = () => {
  return (
    <div className='m-auto max-w-[500px] flex-col items-center justify-center px-8'>
      <WelcomeCard
        mainText='Welcome to Korip.'
        accountQuestionText="Don't have an account?"
        linkText='Sign Up'
        linkHref='/signup'
      />
      <LogInForm />
      <HorizonLine text='Or continue with  ' />
      <SocialLoginButtons />
    </div>
  );
};

export default LogInPage;
