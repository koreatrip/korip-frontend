import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import React, { useState } from 'react';

type PasswordChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => void;
};

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
      <div className='flex h-[631px] w-[512px] flex-col'>
        <Modal.Header>
          <h2 className='text-2xl font-semibold text-[#2C3E50]'>
            비밀번호 변경
          </h2>
        </Modal.Header>

        {/* 바디 */}
        <div className='space-y-6 px-10 pb-6'>
          {/* 현재 비밀번호 */}
          <div>
            <label className='text-md mb-3 block font-medium text-[#2C3E50]'>
              현재 비밀번호
            </label>
            <div className='relative'>
              <Input
                type='password'
                value={passwords.current}
                onChange={(e) => handleInputChange('current', e.target.value)}
                placeholder='현재 비밀번호를 입력하세요'
                autoComplete='off'
                className='w-full !rounded-lg !border !border-gray-200 !bg-white !px-4 !py-3 !pr-12 text-base transition-all duration-200 placeholder:text-gray-300 focus:!border-[#FF6B7A] focus:!ring-1 focus:!ring-[#FF6B7A] focus:!outline-none'
              />
              <button
                type='button'
                onClick={() => handleInputChange('current', '')}
                className='absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] text-gray-300 transition-colors'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            {errors.current && (
              <p className='mt-1 text-xs text-red-500'>{errors.current}</p>
            )}
          </div>

          {/* 새로운 비밀번호 */}
          <div>
            <label className='text-md mb-3 block font-medium text-[#2C3E50]'>
              새로운 비밀번호
            </label>
            <div className='relative'>
              <Input
                type='password'
                value={passwords.new}
                onChange={(e) => handleInputChange('new', e.target.value)}
                placeholder='새로운 비밀번호를 입력하세요'
                autoComplete='new-password'
                className='w-full !rounded-lg !border !border-gray-200 !bg-white !px-4 !py-3 !pr-12 text-base transition-all duration-200 placeholder:text-gray-300 focus:!border-[#FF6B7A] focus:!ring-1 focus:!ring-[#FF6B7A] focus:!outline-none'
              />
              <button
                type='button'
                onClick={() => handleInputChange('current', '')}
                className='absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] text-gray-300 transition-colors'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='mt-2 space-y-1'>
              <p className='text-xs text-gray-400'>• 8자 이상</p>
              <p className='text-xs text-gray-400'>
                • 영문, 숫자, 특수문자 포함
              </p>
            </div>
            {errors.new && (
              <p className='mt-1 text-xs text-red-500'>{errors.new}</p>
            )}
          </div>

          {/* 새로운 비밀번호 확인 */}
          <div>
            <label className='text-md mb-3 block font-medium text-[#2C3E50]'>
              새로운 비밀번호 확인
            </label>
            <div className='relative'>
              <Input
                type='password'
                value={passwords.confirm}
                onChange={(e) => handleInputChange('confirm', e.target.value)}
                placeholder='새로운 비밀번호를 다시 입력하세요'
                autoComplete='new-password'
                className='w-full !rounded-lg !border !border-gray-200 !bg-white !px-4 !py-3 !pr-12 text-base transition-all duration-200 placeholder:text-gray-300 focus:!border-[#FF6B7A] focus:!ring-1 focus:!ring-[#FF6B7A] focus:!outline-none'
              />
              <button
                type='button'
                onClick={() => handleInputChange('current', '')}
                className='absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-[#E2E8F0] text-gray-300 transition-colors'
              >
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            {errors.confirm && (
              <p className='mt-1 text-xs text-red-500'>{errors.confirm}</p>
            )}
          </div>

          {/* 버튼들 */}
          <div className='space-y-3 pt-4'>
            <Button
              onClick={handleClose}
              className='h-12 w-full rounded-lg border border-gray-200 bg-white font-medium text-gray-600 transition-colors hover:bg-gray-50'
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className='h-12 w-full rounded-lg bg-[#FF6B7A] font-medium text-white transition-colors hover:bg-[#ff5a6b]'
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
