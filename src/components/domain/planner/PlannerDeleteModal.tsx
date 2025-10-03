import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { t } from 'i18next';

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
          <p className='text-2xl font-medium'>{t('common.delete_schedule')}</p>
          <p className='text-sub-text-gray text-center'>
            {t('common.delete_schedule_confirm')}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-14 flex w-full gap-x-2'>
          <Button variant='active' onClick={onConfirm} disabled={isPending}>
            {isPending ? t('common.deleting') : t('common.delete')}
          </Button>
          <Button variant='cancel' onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PlannerDeleteModal;
