import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface ErrorPageProps {
  error?: Error;
  errorCode?: string;
  resetError?: () => void;
}

const ErrorPage = ({ error, errorCode, resetError }: ErrorPageProps = {}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    if (resetError) resetError();
    navigate('/');
  };

  const handleTryAgain = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  // 에러 코드 결정 (props로 받거나 기본값)
  const displayErrorCode = errorCode || 'KR-500-TRAVEL';

  return (
    <div className='bg-bg-white flex min-h-screen flex-col items-center justify-center px-4 text-center font-sans'>
      <div className='flex w-full max-w-xl flex-col items-center'>
        <h1 className='text-main-pink mb-4 text-8xl font-bold'>Error</h1>
        <h2 className='text-main-text-navy mb-4 text-2xl font-semibold'>
          {t('common.error_generic_title')}
        </h2>
        <p className='text-sub-text-gray mb-8'>
          {t('common.error_generic_description')}
        </p>

        <div className='flex w-full gap-3'>
          <Button onClick={handleTryAgain}>{t('common.refresh_button')}</Button>
          <Button onClick={handleGoHome}>{t('common.button')}</Button>
        </div>
      </div>

      <div className='text-sub-text-gray absolute bottom-10 text-center text-xs'>
        <p className='mb-1'>Error Code: {displayErrorCode}</p>
        <p>
          If the problem persists, please share this code with our support team
          along with what you were trying to do.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
