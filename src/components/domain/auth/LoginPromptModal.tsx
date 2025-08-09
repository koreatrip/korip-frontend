import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type TLoginPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const LoginPromptModal = ({ isOpen, onClose }: TLoginPromptModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    // '로그인 페이지로 이동'이라는 도메인 로직을 수행
    navigate('/login');
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className='flex flex-col items-center justify-center gap-2'>
          <p className='text-2xl font-medium'>{t('travel.plan_your_trip')}</p>
          <p className='text-sub-text-gray text-center'>
            {t('travel.login_required_for_custom_travel')}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-14 flex w-full flex-col gap-y-2'>
          <Button variant='active' onClick={handleLogin}>
            {t('common.login_and_start')}
          </Button>
          <Button variant='cancel' onClick={onClose}>
            {t('common.maybe_later')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginPromptModal;
