import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';

type SecuritySectionProps = {
  onPasswordChange: () => void;
  onAccountDelete?: () => void;
};

const SecuritySection: React.FC<SecuritySectionProps> = ({
  onPasswordChange,
  onAccountDelete,
}) => {
  const { t } = useTranslation();

  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <h3 className='text-main-text-navy mb-4 text-lg font-bold'>
        보안 설정
      </h3>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-main-text-navy font-medium'>
            비밀번호
          </span>
          <span className='text-gray-400'>*********</span>
        </div>
        <hr className='border-outline-gray -mt-3 border-t' />

        <div className='flex items-center justify-between'>
          <span className='text-main-text-navy font-medium'>
            이메일 인증
          </span>
          <span
            className='flex w-auto items-center justify-center rounded-lg px-3 py-1 font-light text-white'
            style={{ backgroundColor: '#4A9B8E' }}
          >
            완료
          </span>
        </div>
        <hr className='border-outline-gray -mt-3 border-t' />

        <div className='flex justify-end gap-2 pt-4'>
          <Button
            variant='cancel'
            className='h-[52px] w-[164px]'
            onClick={onPasswordChange}
          >
            비밀번호 변경
          </Button>
          {onAccountDelete && (
            <Button
              variant='cancel'
              className='h-[52px] w-[164px]'
              onClick={onAccountDelete}
            >
              계정탈퇴
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
