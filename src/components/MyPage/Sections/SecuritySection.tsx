import Button from '@/components/common/Button';

interface SecuritySectionProps {
  onPasswordChange: () => void;
  onAccountDelete: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  onPasswordChange,
  onAccountDelete,
}) => {
  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <h3 className='text-main-text-navy mb-4 text-lg font-bold'>보안 설정</h3>

      <div className='space-y-4 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-main-text-navy font-medium'>비밀번호</span>
          <span className='text-gray-400'>*********</span>
        </div>
        <hr className='border-outline-gray -mt-3 border-t' />

        <div className='flex items-center justify-between'>
          <span className='text-main-text-navy font-medium'>이메일 인증</span>
          <span
            className='flex h-[25px] w-[51px] items-center justify-center rounded-lg px-3 py-1 text-sm font-light text-white'
            style={{ backgroundColor: '#4A9B8E' }}
          >
            완료
          </span>
        </div>
        <hr className='border-outline-gray -mt-3 border-t' />

        <div className='flex items-center justify-end gap-2 pt-4'>
          <Button
            variant='cancel'
            className='h-10 w-32'
            onClick={onPasswordChange}
          >
            비밀번호 변경
          </Button>
          <Button
            variant='cancel'
            className='h-10 w-32'
            onClick={onAccountDelete}
          >
            계정탈퇴
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
