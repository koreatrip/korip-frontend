import HorizonLine from '@/components/common/HorizonLine';
import LoginForm from '@/components/domain/login/LoginForm';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SocialLoginButtons from '@/components/domain/login/SocialLoginButtons';
import Container from '@/components/common/Container';

const LoginPage = () => {
  return (
    <div className='w-full flex-col items-center justify-center p-8'>
      <Container>
        <WelcomeCard
          accountQuestionText="Don't have an account?"
          linkText='Sign Up'
          linkHref='/signup'
        />
        <LoginForm />
        <HorizonLine text='Or continue with  ' />
        <SocialLoginButtons />
      </Container>
    </div>
  );
};

export default LoginPage;
