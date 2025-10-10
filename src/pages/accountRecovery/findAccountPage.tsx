import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFindAccountMutation } from '@/api/auth/account/accountHooks';
import { logo_sm } from '@/assets/assets';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { useTranslation } from 'react-i18next';
import PhoneInput from '@/components/domain/auth/PhoneInput';

const FindAccountPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullPhoneNumber, setFullPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [foundAccounts, setFoundAccounts] = useState<any[]>([]);

  const findAccountMutation = useFindAccountMutation({
    onSuccess: (data) => {
      if (data.accounts.length > 0) {
        setFoundAccounts(data.accounts);
        setError('');
      } else {
        setError('등록된 계정이 없습니다.');
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || '계정 찾기에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError(t('auth.please_enter_phone'));
      return;
    }

    setError('');
    findAccountMutation.mutate({ phone_number: fullPhoneNumber });
  };

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

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
              <div>
                <PhoneInput
                  label={t('auth.phone_number')}
                  placeholder={t('auth.phone_number_placeholder')}
                  value={phoneNumber}
                  onChange={(cleanValue, fullNumber) => {
                    setPhoneNumber(cleanValue);
                    setFullPhoneNumber(fullNumber);
                    setError('');
                  }}
                  onClear={() => {
                    setPhoneNumber('');
                    setFullPhoneNumber('');
                    setError('');
                  }}
                  defaultCountry='KR'
                />
                {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
              </div>

              <Button
                type='submit'
                disabled={findAccountMutation.isPending}
                className='w-full'
              >
                {findAccountMutation.isPending ? (
                  <Spinner />
                ) : (
                  t('auth.find_email')
                )}
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
