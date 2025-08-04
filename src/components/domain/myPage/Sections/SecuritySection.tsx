import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';

type SecuritySectionProps = {
  onPasswordChange: () => void;
  onAccountDelete: () => void;
};

const SecuritySection: React.FC<SecuritySectionProps> = ({
  onPasswordChange,
  onAccountDelete,
}) => {
  const { t } = useTranslation();

  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
        {t('user.security_settings')}
      </h3>

      <div className='space-y-4 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-main-text-navy font-medium'>
            {t('auth.password')}
          </span>
          <span className='text-gray-400'>*********</span>
        </div>
        <hr className='border-outline-gray -mt-3 border-t' />

        <div className='flex items-center justify-between'>
          <span className='text-main-text-navy font-medium'>
            {t('auth.email_verification')}
          </span>
          <span
            className='flex w-auto items-center justify-center rounded-lg px-3 py-1 text-sm font-light text-white'
            style={{ backgroundColor: '#4A9B8E' }}
          >
            {t('common.complete')}
          </span>
        </div>
        <hr className='border-outline-gray -mt-3 border-t' />

        <div className='flex justify-end gap-2 pt-4'>
          <Button
            variant='cancel'
            className='h-10 w-auto' // 2. flex-1 제거 -> 버튼이 내용만큼만 너비를 갖도록
            onClick={onPasswordChange}
          >
            {t('user.change_password')}
          </Button>

          {/* 3. '계정 탈퇴'는 위험한 작업이므로 시각적으로 구분되는 variant 추천 */}
          <Button
            variant='cancel' // 예: 'destructive' variant (빨간색 텍스트 등)
            className='h-10 w-auto' // flex-1 제거
            onClick={onAccountDelete}
          >
            {t('user.delete_account')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
