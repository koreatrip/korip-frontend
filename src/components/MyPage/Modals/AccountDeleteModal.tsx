import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import React, { useState } from 'react';

interface AccountDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedReasons: string[], customReason?: string) => void;
}

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

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reason)) {
        return prev.filter((r) => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='계정 탈퇴'
      maxWidth='lg'
    >
      <div className='space-y-6'>
        {/* 안내 문구 */}
        <div className='rounded-2xl border-2 border-orange-200 bg-orange-50 p-2 px-4 text-lg leading-relaxed font-medium text-gray-600'>
          <p className='mb-2'>
            <span className='font-medium text-gray-950'>⚠ 주의:</span> 계정을
            삭제하면 모든 여행 계획, 즐겨찾기,
          </p>
          <p>개인정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
        </div>

        {/* 탈퇴 사유 선택 */}
        <div>
          <h4 className='mb-3 text-lg font-medium text-gray-700'>
            탈퇴 사유를 선택해주세요
          </h4>
          <div className='space-y-3'>
            {deleteReasons.map((reason) => (
              <label key={reason} className='flex cursor-pointer items-center'>
                <input
                  type='checkbox'
                  checked={selectedReasons.includes(reason)}
                  onChange={() => handleReasonToggle(reason)}
                  className='text-main-pink focus:ring-main-pink h-4 w-4 rounded focus:ring-2'
                />
                <span className='ml-3 text-sm text-gray-700'>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className='gap-3 pt-4'>
          <Button variant='cancel' onClick={handleClose} className='flex-1'>
            취소
          </Button>
          <Button
            variant='active'
            onClick={handleConfirm}
            className='!hover:bg-red-600 h-10 flex-1 !bg-red-400'
            disabled={selectedReasons.length === 0}
          >
            탈퇴
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AccountDeleteModal;
