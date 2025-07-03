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
        {/* Body 안에는 이렇게 복잡한 폼이나 다른 컴포넌트가 자유롭게 들어갈 수 있습니다. */}
        <div className='space-y-4'>
          <div className='border-point-gold text-main-text-navy rounded-lg border bg-[#F7F0E8] p-3 text-sm'>
            <p>
              <strong>⚠️ 주의:</strong> 계정을 탈퇴하면 모든 여행 계획,
              즐겨찾기, 개인정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수
              없습니다.
            </p>
          </div>
          <fieldset>
            <legend className='font-semibold text-gray-700'>
              탈퇴 사유를 선택해주세요
            </legend>
            <div className='mt-2 space-y-2'>
              {/* 라디오 버튼 등 자유롭게 구성 */}
              <label className='flex items-center'>
                <input type='radio' name='reason' className='mr-2' /> 서비스
                미사용
              </label>
              <label className='flex items-center'>
                <input type='radio' name='reason' className='mr-2' /> 개인정보
                보호 우려
              </label>
            </div>
          </fieldset>
          <AuthInput type='password' label='비밀번호 확인' />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='mt-10 flex w-full flex-col gap-y-2'>
          <Button variant='cancel' onClick={handleClose}>
            취소
          </Button>
          <Button variant='active'>탈퇴</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountDeleteModal;
