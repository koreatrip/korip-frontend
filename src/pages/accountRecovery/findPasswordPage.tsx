import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useFindPasswordMutation } from '@/api/auth/account/accountHooks';
import { logo_sm } from '@/assets/assets';
import AuthInput from '@/components/domain/auth/AuthInput';

import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { Trans, useTranslation } from 'react-i18next';

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useFindPasswordMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      setError('');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || '이메일 발송에 실패했습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError(t('auth.please_enter_email'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.invalid_email_format'));
      return;
    }

    setError('');
    forgotPasswordMutation.mutate({ email });
  };

  return (
    <div className='flex min-h-screen items-center justify-center sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <img src={logo_sm} alt='KORIP Logo' className='mx-auto mb-4 h-8' />
        </div>

        {isSubmitted ? (
          <div className='w-full text-center'>
            {/* <div className='flex justify-center'>
              <CheckBadgeIcon className='text-sub-green h-12 w-12' />
            </div> */}

            <h2 className='text-main-text-navy mt-6 text-2xl font-semibold'>
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
              <h2 className='text-main-text-navy text-3xl font-bold'>
                {t('auth.forgot_password')}
              </h2>
              <p className='text-sub-text-gray mt-2'>
                {t('auth.enter_signup_email')}
              </p>
            </div>

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
              <div>
                <AuthInput
                  type='email'
                  placeholder='k@example.com'
                  label={t('auth.email')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onClear={() => {
                    setEmail('');
                    setError('');
                  }}
                />
                {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
              </div>

              <Button type='submit' disabled={forgotPasswordMutation.isPending}>
                {forgotPasswordMutation.isPending ? (
                  <Spinner />
                ) : (
                  t('auth.receive_reset_email')
                )}
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
