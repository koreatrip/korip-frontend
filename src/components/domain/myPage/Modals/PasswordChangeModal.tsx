import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AuthInput from '../../auth/AuthInput';
import type { ChangePasswordRequest } from '@/api/user/userType';
import { useChangePasswordMutation } from '@/api/user/userHooks';
import { useToast } from '@/hooks/useToast'; // 👈 (추가) useToast 훅 import

// Zod 스키마 정의 (변경 없음)
const passwordChangeSchema = z
  .object({
    current: z.string().min(1, 'auth.password_required'),
    new: z
      .string()
      .min(8, 'auth.password_min_length')
      .max(20, 'auth.password_max_length')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'auth.letter_number_special_combo'
      ),
    confirm: z.string().min(1, 'auth.password_required'),
  })
  .refine((data) => data.new === data.confirm, {
    message: 'auth.password_mismatch',
    path: ['confirm'],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

type PasswordChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast(); // 👈 (추가) showToast 함수 가져오기

  // 👈 1. 컴포넌트 최상단에서 mutation 훅 호출
  const { mutate: changePassword, isPending } = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onChange',
    defaultValues: {
      current: '',
      new: '',
      confirm: '',
    },
  });

  const watchedValues = watch();

  // 👈 2. onSubmit 함수에서 위에서 선언한 changePassword 함수 사용
  const onSubmit = async (data: PasswordChangeFormData) => {
    const passwordChangeData: ChangePasswordRequest = {
      current_password: data.current,
      new_password: data.new,
    };

    changePassword(passwordChangeData, {
      onSuccess: () => {
        showToast(t('auth.password_changed_success'), 'success');
        handleClose();
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.error_message ||
          t('auth.password_change_failed');
        showToast(message, 'error');
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleClear = (field: keyof PasswordChangeFormData) => {
    setValue(field, '', { shouldValidate: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className='flex w-[512px] flex-col'>
        <Modal.Header>
          <h2 className='text-main-text-navy text-2xl font-semibold'>
            {t('user.change_password')}
          </h2>
        </Modal.Header>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 바디 (변경 없음) */}
          <div className='space-y-6 px-10 pb-6'>
            {/* 현재 비밀번호 */}
            <div>
              <label className='text-md text-main-text-navy mb-3 block font-medium'>
                {t('user.current_password')}
              </label>
              <AuthInput
                type='password'
                value={watchedValues.current}
                {...register('current')}
                onChange={(e) =>
                  setValue('current', e.target.value, { shouldValidate: true })
                }
                placeholder={t('user.enter_current_password')}
                autoComplete='current-password'
                onClear={() => handleClear('current')}
              />
              {errors.current && (
                <p className='mt-1 text-xs text-red-500'>
                  {t(errors.current.message as string)}
                </p>
              )}
            </div>

            {/* 새로운 비밀번호 */}
            <div>
              <label className='text-md text-main-text-navy mb-3 block font-medium'>
                {t('user.new_password')}
              </label>
              <AuthInput
                type='password'
                value={watchedValues.new}
                {...register('new')}
                onChange={(e) =>
                  setValue('new', e.target.value, { shouldValidate: true })
                }
                placeholder={t('user.enter_new_password')}
                autoComplete='new-password'
                onClear={() => handleClear('new')}
              />
              <div className='mt-2 space-y-1'>
                <p className='text-sub-text-gray text-xs'>
                  • {t('auth.password_length_8_20')}
                </p>
                <p className='text-sub-text-gray text-xs'>
                  • {t('auth.letter_number_special_combo')}
                </p>
              </div>
              {errors.new && (
                <p className='text-error-red mt-1 text-xs'>
                  {t(errors.new.message as string)}
                </p>
              )}
            </div>

            {/* 새로운 비밀번호 확인 */}
            <div>
              <label className='text-md text-main-text-navy mb-3 block font-medium'>
                {t('user.confirm_new_password')}
              </label>
              <AuthInput
                type='password'
                value={watchedValues.confirm}
                {...register('confirm')}
                onChange={(e) =>
                  setValue('confirm', e.target.value, { shouldValidate: true })
                }
                placeholder={t('user.confirm_new_password')}
                autoComplete='new-password'
                onClear={() => handleClear('confirm')}
              />
              {errors.confirm && (
                <p className='text-error-red mt-1 text-xs'>
                  {t(errors.confirm.message as string)}
                </p>
              )}
            </div>

            {/* 버튼들 */}
            <div className='space-y-3 pt-4'>
              <Button
                type='button'
                onClick={handleClose}
                className='border-outline-gray hover:bg-hover-gray bg-bg-white h-12 w-full rounded-lg border font-medium text-gray-600 transition-colors'
              >
                {t('common.cancel')}
              </Button>
              <Button
                type='submit'
                disabled={!isValid || isPending}
                className='text-bg-white h-12 w-full rounded-lg bg-[#FF6B7A] font-medium transition-colors hover:bg-[#ff5a6b] disabled:cursor-not-allowed disabled:bg-gray-300'
              >
                {t('common.confirm')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
