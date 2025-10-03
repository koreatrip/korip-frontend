import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

type TPlannerDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
};

const PlannerDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: TPlannerDeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className='flex flex-col items-center justify-center gap-2'>
          <p className='text-2xl font-medium'>일정 삭제</p>
          <p className='text-sub-text-gray text-center'>
            정말로 이 일정을 삭제하시겠습니까? 삭제된 일정은 복구할 수 없습니다.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-14 flex w-full gap-x-2'>
          <Button variant='active' onClick={onConfirm} disabled={isPending}>
            {isPending ? '삭제 중...' : '삭제'}
          </Button>
          <Button variant='cancel' onClick={onClose}>
            취소
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PlannerDeleteModal;
