import { Link, useNavigate } from 'react-router-dom';
import { logo_sm } from '@/assets/assets';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { useTranslation } from 'react-i18next';
import PhoneInput from '@/components/domain/auth/PhoneInput';
import { useFindAccount } from './useFindAccount';

const FindAccountPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formState, handlers, isLoading } = useFindAccount();
  const { phoneNumber, error, foundAccounts } = formState;

  return (
    <div className='flex min-h-screen items-center justify-center sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 px-8 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <img src={logo_sm} alt='KORIP Logo' className='mx-auto mb-4 h-8' />
        </div>

        {foundAccounts.length > 0 ? (
          <div className='w-full'>
            <h2 className='text-main-text-navy mb-4 text-center text-xl font-semibold md:text-2xl lg:text-3xl'>
              {t('auth.forgot_email')}
            </h2>

            <div className='space-y-3'>
              {foundAccounts.map((account) => (
                <div
                  key={account.id}
                  className='border-outline-gray rounded-lg border p-4'
                >
                  <p className='text-main-text-navy font-medium'>
                    {account.email}
                  </p>
                  <p className='text-sub-text-gray text-sm'>
                    {t('auth.login_type')}: {account.login_type}
                  </p>
                </div>
              ))}
            </div>

            <Button className='mt-6 w-full' onClick={() => navigate('/login')}>
              {t('common.back_to_login')}
            </Button>
          </div>
        ) : (
          <div className='w-full'>
            <div className='text-center'>
              <h2 className='text-main-text-navy mb-4 text-center text-xl font-semibold md:text-2xl lg:text-3xl'>
                {t('auth.forgot_email')}
              </h2>
              <p className='text-sub-text-gray mt-2'>
                {t('auth.enter_signup_phone')}
              </p>
            </div>

            <form className='mt-8 space-y-6' onSubmit={handlers.handleSubmit}>
              <div>
                <PhoneInput
                  label={t('auth.phone_number')}
                  value={phoneNumber}
                  onChange={handlers.handlePhoneChange}
                  onClear={handlers.handleReset}
                  defaultCountry='KR'
                />
                {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
              </div>

              <Button type='submit' disabled={isLoading} className='w-full'>
                {isLoading ? <Spinner /> : t('auth.find_email')}
              </Button>
            </form>

            <div className='mt-6 text-center text-sm'>
              <Link
                to='/login'
                className='font-medium text-gray-600 hover:text-gray-900'
              >
                {t('common.back_to_login')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindAccountPage;
