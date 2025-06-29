import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import React, { useState } from 'react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      current: '',
      new: '',
      confirm: '',
    };

    if (!passwords.current.trim()) {
      newErrors.current = '현재 비밀번호를 입력해주세요.';
    }

    if (!passwords.new.trim()) {
      newErrors.new = '새 비밀번호를 입력해주세요.';
    } else if (passwords.new.length < 8) {
      newErrors.new = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!passwords.confirm.trim()) {
      newErrors.confirm = '새 비밀번호 확인을 입력해주세요.';
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = '새 비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(passwords);
      handleClose();
    }
  };

  const handleClose = () => {
    setPasswords({
      current: '',
      new: '',
      confirm: '',
    });
    setErrors({
      current: '',
      new: '',
      confirm: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='space-y-6'>
        {/* 현재 비밀번호 */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            현재 비밀번호
          </label>
          <Input
            type='password'
            value={passwords.current}
            onChange={(e) => handleInputChange('current', e.target.value)}
            placeholder='현재 비밀번호를 입력하세요'
            className='focus:!border-main-pink focus:!ring-main-pink !border !border-gray-300 !py-3 focus:!ring-2'
            onClear={() => handleInputChange('current', '')}
          />
          {errors.current && (
            <p className='mt-1 text-xs text-red-500'>{errors.current}</p>
          )}
        </div>

        {/* 새로운 비밀번호 */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            새로운 비밀번호
          </label>
          <Input
            type='password'
            value={passwords.new}
            onChange={(e) => handleInputChange('new', e.target.value)}
            placeholder='새로운 비밀번호를 입력하세요'
            className='focus:!border-main-pink focus:!ring-main-pink !border !border-gray-300 !py-3 focus:!ring-2'
            onClear={() => handleInputChange('new', '')}
          />
          <div className='mt-2 space-y-1'>
            <p className='text-xs text-gray-500'>• 8자 이상</p>
            <p className='text-xs text-gray-500'>• 영문, 숫자, 특수문자 포함</p>
          </div>
          {errors.new && (
            <p className='mt-1 text-xs text-red-500'>{errors.new}</p>
          )}
        </div>

        {/* 새로운 비밀번호 확인 */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            새로운 비밀번호 확인
          </label>
          <Input
            type='password'
            value={passwords.confirm}
            onChange={(e) => handleInputChange('confirm', e.target.value)}
            placeholder='새로운 비밀번호를 다시 입력하세요'
            className='focus:!border-main-pink focus:!ring-main-pink !border !border-gray-300 !py-3 focus:!ring-2'
            onClear={() => handleInputChange('confirm', '')}
          />
          {errors.confirm && (
            <p className='mt-1 text-xs text-red-500'>{errors.confirm}</p>
          )}
        </div>

        {/* 버튼들 */}
        <div className='flex gap-3 pt-6'>
          <Button
            variant='cancel'
            onClick={handleClose}
            className='h-12 flex-1'
          >
            취소
          </Button>
          <Button variant='active' onClick={handleSave} className='h-12 flex-1'>
            변경
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
