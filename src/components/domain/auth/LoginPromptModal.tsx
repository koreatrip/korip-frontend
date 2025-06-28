import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { useNavigate } from 'react-router';

type TLoginPromptModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const LoginPromptModal = ({ isOpen, onClose }: TLoginPromptModalProps) => {
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
          <p className='text-2xl font-medium'>나만의 여행을 계획해보세요!</p>
          <p className='text-sub-text-gray'>
            나만의 여행 일정을 만들고 저장하려면 로그인이 필요해요.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-14 flex w-full flex-col gap-y-2'>
          <Button variant='active' onClick={handleLogin}>
            로그인하고 시작하기
          </Button>
          <Button variant='cancel' onClick={onClose}>
            나중에 할게요.
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginPromptModal;
