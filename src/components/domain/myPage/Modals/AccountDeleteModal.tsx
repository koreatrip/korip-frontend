import Button from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import AuthInput from '@/components/domain/auth/AuthInput';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDeleteUserMutation } from '@/api/user/userHooks';
import { useToast } from '@/hooks/useToast';

// Zod 스키마 정의
const accountDeleteSchema = z.object({
  reason: z.string().min(1, 'user.select_deletion_reason_required'),
  password: z.string().min(1, 'auth.password_required'),
});

type AccountDeleteFormData = z.infer<typeof accountDeleteSchema>;

type AccountDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AccountDeleteModal: React.FC<AccountDeleteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const deleteUserMutation = useDeleteUserMutation();
  // const { actions } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AccountDeleteFormData>({
    resolver: zodResolver(accountDeleteSchema),
    mode: 'onChange',
    defaultValues: {
      reason: '',
      password: '',
    },
  });

  const watchedValues = watch();

  const deleteReasons = [
    { value: 'not_using_service', label: 'user.not_using_service' },
    {
      value: 'dissatisfied_with_service',
      label: 'user.dissatisfied_with_service',
    },
    { value: 'privacy_concerns', label: 'user.privacy_concerns' },
    { value: 'others', label: 'common.others' },
  ];

  const onSubmit = (data: AccountDeleteFormData) => {
    deleteUserMutation.mutate(
      { password: data.password },
      {
        onSuccess: () => {
          showToast(t('auth.account_deleted_success'), 'success');
          handleClose();
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message || t('auth.password_incorrect');
          showToast(message, 'error');
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleClear = (field: keyof AccountDeleteFormData) => {
    setValue(field, '', { shouldValidate: true });
  };

  const isLoading = deleteUserMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header>{t('user.delete_account')}</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <div className='space-y-4'>
            {/* 경고 메시지 */}
            <div className='text-main-text-navy bg-main-pink/10 rounded-lg border border-none p-3 text-sm'>
              <p>
                <Trans
                  i18nKey='user.account_deletion_warning'
                  components={{
                    WarningIcon: <span />,
                    Strong: <strong />,
                  }}
                />
              </p>
            </div>

            {/* 탈퇴 이유 선택 */}
            <fieldset>
              <legend className='text-main-text-navy mb-3 font-semibold'>
                {t('user.select_deletion_reason')}
              </legend>
              <div className='space-y-2'>
                {deleteReasons.map((reason, idx) => (
                  <label key={idx} className='flex cursor-pointer items-center'>
                    <input
                      type='radio'
                      value={reason.value}
                      {...register('reason')}
                      className='peer hidden'
                      disabled={isLoading}
                    />
                    <span className='relative mr-2 h-4 w-4 rounded-full border border-[#FF6B7A] transition peer-checked:border-[#FF6B7A] peer-checked:before:absolute peer-checked:before:top-1/2 peer-checked:before:left-1/2 peer-checked:before:h-2 peer-checked:before:w-2 peer-checked:before:-translate-x-1/2 peer-checked:before:-translate-y-1/2 peer-checked:before:rounded-full peer-checked:before:bg-[#FF6B7A] peer-checked:before:content-[""]'></span>
                    <span className='text-main-text-navy text-sm'>
                      {t(reason.label)}
                    </span>
                  </label>
                ))}
              </div>
              {errors.reason && (
                <p className='mt-1 text-xs text-red-500'>
                  {t(errors.reason.message as string)}
                </p>
              )}
            </fieldset>

            {/* 비밀번호 확인 */}
            <div>
              <label className='text-main-text-navy mb-2 block text-sm font-medium'>
                {t('auth.confirm_password')}
              </label>
              <AuthInput
                type='password'
                value={watchedValues.password}
                {...register('password')}
                onChange={(e) =>
                  setValue('password', e.target.value, { shouldValidate: true })
                }
                placeholder={t('user.enter_current_password')}
                autoComplete='current-password'
                onClear={() => handleClear('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className='mt-1 text-xs text-red-500'>
                  {t(errors.password.message as string)}
                </p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='mt-10 flex w-full flex-col gap-y-2'>
            <Button
              type='button'
              variant='cancel'
              onClick={handleClose}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='submit'
              variant='active'
              disabled={!isValid || isLoading}
              className='disabled:cursor-not-allowed disabled:bg-gray-300'
            >
              {/* {isLoading ? t('common.processing') : t('user.delete_account')} */}
              {t('user.delete_account')}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AccountDeleteModal;
