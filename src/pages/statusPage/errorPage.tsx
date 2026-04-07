import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

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

  // 에러 메시지 결정
  const errorMessage = error?.message || t('common.error_generic_description');

  return (
    <div className='bg-bg-white flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-2xl text-center'>
        {/* 에러 아이콘 */}
        <div className='relative mb-8 flex justify-center'>
          <div className='relative'>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                duration: 0.6,
              }}
            >
              <ExclamationTriangleIcon className='text-error-red h-36 w-36 md:h-44 md:w-44' />
            </motion.div>
            <motion.div
              className='absolute inset-0 opacity-20 blur-3xl'
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
              style={{
                background:
                  'radial-gradient(circle, rgb(239, 68, 68) 0%, transparent 70%)',
              }}
            />
          </div>
        </div>

        {/* 메시지 */}
        <motion.div
          className='mb-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className='text-main-text-navy mb-4 text-2xl font-semibold md:text-3xl'>
            {t('common.error_generic_title')}
          </h2>
          <p className='text-sub-text-gray mx-auto max-w-md text-base md:text-lg'>
            {errorMessage}
          </p>
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          className='mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={handleGoHome}
            className='group flex min-w-[200px] items-center justify-center gap-2 rounded-xl px-6 py-3 shadow-md transition-all duration-300 hover:shadow-lg'
          >
            <HomeIcon className='h-5 w-5' />
            <span>{t('common.button')}</span>
          </Button>

          <Button
            onClick={handleTryAgain}
            className='group border-outline-gray hover:border-sub-green shadow-light text-sub-green bg-bg-white hover:bg-bg-section flex min-w-[200px] items-center justify-center gap-2 rounded-xl border px-6 py-3 transition-all duration-300'
          >
            <ArrowPathIcon className='h-5 w-5' />
            <span>{t('common.refresh_button')}</span>
          </Button>
        </motion.div>

        {/* 하단 에러 코드 */}
        <motion.div
          className='border-outline-gray mt-12 border-t pt-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <p className='text-ph-gray text-sm'>
            Error Code:{' '}
            <span className='text-error-red'>{displayErrorCode}</span>
          </p>
          <p className='text-ph-gray mt-2 text-sm'>
            {t('common.error_support_message')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
