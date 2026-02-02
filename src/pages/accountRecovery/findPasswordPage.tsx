import { Link, useNavigate } from 'react-router-dom';
import { logo_sm } from '@/assets/assets';
import AuthInput from '@/components/domain/auth/AuthInput';

import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import { useFindPassword } from './useFindPassword';

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formState, handlers, isLoading } = useFindPassword();

  const { email, error, isSubmitted } = formState;

  return (
    <div className='flex min-h-screen items-center justify-center sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 px-8 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <img src={logo_sm} alt='KORIP Logo' className='mx-auto mb-4 h-8' />
        </div>

        {isSubmitted ? (
          <div className='w-full text-center'>
            {/* <div className='flex justify-center'>
              <CheckBadgeIcon className='text-sub-green h-12 w-12' />
            </div> */}

            <h2 className='text-main-text-navy mb-4 text-center text-xl font-semibold md:text-2xl lg:text-3xl'>
              {t('auth.forgot_password')}
            </h2>

            <div className='text-sub-text-gray mt-4 space-y-2'>
              <p>
                <Trans
                  i18nKey='common.temp_password_sent'
                  values={{ email }}
                  components={{
                    Email: <strong className='text-main-text-navy' />,
                  }}
                />
              </p>
              <p className='text-sm'>{t('common.check_spam_or_retry')}</p>
            </div>

            <Button className='mt-6' onClick={() => navigate('/login')}>
              {t('common.back_to_login')}
            </Button>
          </div>
        ) : (
          <div className='w-full'>
            <div className='text-center'>
              <h2 className='text-main-text-navy mb-4 text-center text-xl font-semibold md:text-2xl lg:text-3xl'>
                {t('auth.forgot_password')}
              </h2>
              <p className='text-sub-text-gray mt-2'>
                {t('auth.enter_signup_email')}
              </p>
            </div>

            <form className='mt-8 space-y-6' onSubmit={handlers.handleSubmit}>
              <div>
                <AuthInput
                  type='email'
                  placeholder='k@example.com'
                  label={t('auth.email')}
                  value={email}
                  onChange={handlers.handleEmailChange}
                  onClear={handlers.handleReset}
                />
                {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
              </div>

              <Button type='submit' disabled={isLoading} className='w-full'>
                {isLoading ? <Spinner /> : t('auth.receive_reset_email')}
              </Button>
            </form>

            <div className='mt-6 flex items-center justify-center gap-x-2.5 text-sm'>
              <Link to='/login' className='text-main-text-navy font-medium'>
                {t('common.back_to_login')}
              </Link>
              <span className='text-main-text-navy'>/</span>
              <Link
                to='/find-account'
                className='text-main-text-navy font-medium'
              >
                {t('auth.find_email')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPasswordPage;
