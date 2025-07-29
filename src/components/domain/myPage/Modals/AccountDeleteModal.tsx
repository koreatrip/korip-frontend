import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import AuthInput from '@/components/domain/auth/AuthInput';
import React, { useState } from 'react';

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

  const deleteReasons = [
    '서비스를 사용하지 않음',
    '서비스에 불만족',
    '개인정보 보호 우려',
    '기타',
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
      <Modal.Header>계정 탈퇴</Modal.Header>
      <Modal.Body>
        <div className='space-y-4'>
          <div className='text-main-text-navy rounded-lg border border-none bg-[#F7F0E8] p-3 text-sm'>
            <p>
              <strong>
                <span style={{ filter: 'grayscale(100%)' }}>⚠️</span> 주의:
              </strong>{' '}
              계정을 탈퇴하면 모든 여행 계획, 즐겨찾기, 개인정보가 영구적으로
              삭제됩니다. 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <fieldset>
            <legend className='font-semibold text-gray-700'>
              탈퇴 사유를 선택해주세요
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
                  {reason}
                </label>
              ))}
            </div>
          </fieldset>
          <AuthInput
            type='password'
            label='비밀번호 확인'
            placeholder='현재 비밀번호를 입력하세요'
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-10 flex w-full flex-col gap-y-2'>
          <Button variant='cancel' onClick={handleClose}>
            취소
          </Button>
          <Button variant='active' onClick={handleConfirm}>
            탈퇴
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountDeleteModal;
