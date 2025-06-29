import HorizonLine from '@/components/common/HorizonLine';
import LoginForm from '@/components/domain/login/LoginForm';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SocialLoginButtons from '@/components/domain/login/SocialLoginButtons';
import Container from '@/components/common/Container';

const LogInPage = () => {
  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText='Welcome to Korip.'
          accountQuestionText="Don't have an account?"
          linkText='Sign Up'
          linkHref='/register'
        />
        <LoginForm />
        <HorizonLine text='Or continue with  ' />
        <SocialLoginButtons />
      </div>
    </Container>
  );
};

export default LogInPage;
