import HorizonLine from '@/components/common/HorizonLine';
import LoginForm from '@/components/domain/login/LoginForm';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SocialLoginButtons from '@/components/domain/login/SocialLoginButtons';
import Container from '@/components/common/Container';
import { useTranslation } from 'react-i18next';

const LogInPage = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText={t('auth.welcome_message_title')}
          accountQuestionText={t('auth.welcome_message_content')}
          linkText={t('auth.signup')}
          linkHref='/register'
        />
        <LoginForm />
        <HorizonLine text={t('auth.or_continue_with')} />
        <SocialLoginButtons />
      </div>
    </Container>
  );
};

export default LogInPage;
