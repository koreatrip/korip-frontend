import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      <div className='flex w-[512px] flex-col'>
        <Modal.Header>
          <h2 className='text-2xl font-semibold text-[#2C3E50]'>
            {t('user.change_password')}
          </h2>
        </Modal.Header>

        {/* 바디 */}
        <div className='space-y-6 px-10 pb-6'>
          {/* 현재 비밀번호 */}
          <div>
            <label className='text-md mb-3 block font-medium text-[#2C3E50]'>
              {t('user.current_password')}
            </label>
            <Input
              type='password'
              value={passwords.current}
              onChange={(e) => handleInputChange('current', e.target.value)}
              placeholder={t('user.enter_current_password')}
              autoComplete='off'
              onClear={() => handleInputChange('current', '')}
            />
            {errors.current && (
              <p className='mt-1 text-xs text-red-500'>{errors.current}</p>
            )}
          </div>

          {/* 새로운 비밀번호 */}
          <div>
            <label className='text-md mb-3 block font-medium text-[#2C3E50]'>
              {t('user.new_password')}
            </label>
            <Input
              type='password'
              value={passwords.new}
              onChange={(e) => handleInputChange('new', e.target.value)}
              placeholder={t('user.enter_new_password')}
              autoComplete='new-password'
              onClear={() => handleInputChange('new', '')}
            />
            <div className='mt-2 space-y-1'>
              <p className='text-xs text-gray-400'>
                • {t('auth.password_length_8_20')}
              </p>
              <p className='text-xs text-gray-400'>
                • {t('auth.letter_number_special_combo')}
              </p>
            </div>
            {errors.new && (
              <p className='text-error-red mt-1 text-xs'>{errors.new}</p>
            )}
          </div>

          {/* 새로운 비밀번호 확인 */}
          <div>
            <label className='text-md mb-3 block font-medium text-[#2C3E50]'>
              {t('user.confirm_new_password')}
            </label>
            <Input
              type='password'
              value={passwords.confirm}
              onChange={(e) => handleInputChange('confirm', e.target.value)}
              placeholder={t('user.confirm_new_password')}
              autoComplete='new-password'
              onClear={() => handleInputChange('confirm', '')}
            />
            {errors.confirm && (
              <p className='text-error-red mt-1 text-xs'>{errors.confirm}</p>
            )}
          </div>

          {/* 버튼들 */}
          <div className='space-y-3 pt-4'>
            <Button
              onClick={handleClose}
              className='border-outline-gray hover:bg-hover-gray h-12 w-full rounded-lg border bg-white font-medium text-gray-600 transition-colors'
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              className='h-12 w-full rounded-lg bg-[#FF6B7A] font-medium text-white transition-colors hover:bg-[#ff5a6b]'
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
