import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import AuthInput from '@/components/domain/auth/AuthInput';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type AccountDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedReasons: string[], customReason?: string) => void;
};

const AccountDeleteModal: React.FC<AccountDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');

  const { t } = useTranslation();

  const deleteReasons = [
    'user.not_using_service',
    'user.dissatisfied_with_service',
    'user.privacy_concerns',
    'common.others',
  ];

  const handleConfirm = () => {
    onConfirm(selectedReasons, customReason);
    handleClose();
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setCustomReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header>{t('user.delete_account')}</Modal.Header>
      <Modal.Body>
        <div className='space-y-4'>
          <div className='text-main-text-navy rounded-lg border border-none bg-[#F7F0E8] p-3 text-sm'>
            <p>
              <Trans
                i18nKey='user.account_deletion_warning'
                components={{
                  WarningIcon: <span style={{ filter: 'grayscale(100%)' }} />,
                  Strong: <strong />,
                }}
              />
            </p>
          </div>
          <fieldset>
            <legend className='font-semibold text-gray-700'>
              {t('user.select_deletion_reason')}
            </legend>
            <div className='mt-2 space-y-2'>
              {deleteReasons.map((reason, idx) => (
                <label key={idx} className='flex cursor-pointer items-center'>
                  <input
                    type='radio'
                    name='reason'
                    value={reason}
                    className='peer hidden'
                  />
                  <span className='relative mr-2 h-4 w-4 rounded-full border border-[#FF6B7A] transition peer-checked:border-[#FF6B7A] peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:h-2 peer-checked:before:w-2 peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 peer-checked:before:rounded-full peer-checked:before:bg-[#FF6B7A] peer-checked:before:content-[""]'></span>
                  {t(reason)}
                </label>
              ))}
            </div>
          </fieldset>
          <AuthInput
            type='password'
            label={t('auth.confirm_password')}
            placeholder={t('user.current_password')}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-10 flex w-full flex-col gap-y-2'>
          <Button variant='cancel' onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button variant='active' onClick={handleConfirm}>
            {t('user.delete_account')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountDeleteModal;
