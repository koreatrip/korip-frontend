import Container from '@/components/common/Container';
import HorizonLine from '@/components/common/HorizonLine';
import SocialLoginButtons from '@/components/domain/login/SocialLoginButtons';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SignUpForm from '@/components/domain/login/SignUpForm';
import { useTranslation } from 'react-i18next';

// Zod 스키마 정의 (유효성 검사를 강화하고 SignUpFormInputs 타입을 정의합니다)

const SignUpPage = () => {
  const { t } = useTranslation();

  //to. 혜민
  // 토스트 메세지는 이미 만들어둔걸로 사용하십시오
  // ToastMessage 상태 관리
  // const [showToast, setShowToast] = useState(false); // <- x
  // const { showToast } = useToast(); // <- O
  /* 사용예
  showToast('메세지','알림 타입(info,warning,error,success') 
  */
  // const [toastMessage, setToastMessage] = useState('');
  // const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
  //   'info'
  // );

  return (
    <Container>
      <div className='m-auto flex max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText={t('auth.create_account')}
          accountQuestionText={
            <>
              {t('auth.enter_email_to_create_account')}
              <br />
              {t('auth.already_have_account')}
            </>
          }
          linkHref='login'
          linkText={t('auth.login')}
        />
        <SignUpForm />
        <HorizonLine text={t('auth.or_continue_with')} className='my-8' />{' '}
        {/* 마진 추가 */}
        <SocialLoginButtons className={'w-full'} />
        {/* ToastMessage 조건부 렌더링 */}
        {/* {showToast && (
          <ToastMessage
            message={toastMessage}
            type={toastType}
            duration={3000}
            onClose={() => setShowToast(false)} // 토스트 닫힐 때 상태 초기화
          />
        )} */}
      </div>
    </Container>
  );
};

export default SignUpPage;
