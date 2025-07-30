import Button from '@/components/common/Button';
import type { UserProfile } from '@/types/user';
import React from 'react';
import EditableField from '../Fields/EditableField';
import InterestsField from '../Fields/InterestsField';
import { useTranslation } from 'react-i18next';

type BasicInfoSectionProps = {
  formData: UserProfile;
  tempFormData: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onInputChange: (field: keyof UserProfile, value: string) => void;
  onInterestAdd: (interest: string) => void;
  onInterestRemove: (interest: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  tempFormData,
  isEditing,
  onToggleEdit,
  onInputChange,
  onInterestAdd,
  onInterestRemove,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-main-text-navy text-lg font-bold'>
          {t('user.basic_info')}
        </h3>
        <Button
          variant='active'
          className='w-auto px-3 py-1 text-sm'
          onClick={onToggleEdit}
        >
          {isEditing ? t('common.cancel') : t('common.delete')}
        </Button>
      </div>

      <div className='space-y-4'>
        <EditableField
          label={t('auth.username')}
          value={tempFormData.name}
          isEditing={isEditing}
          placeholder='아이디를 입력하세요'
          onChange={(value) => onInputChange('name', value)}
        />

        <EditableField
          label={t('auth.email')}
          value={tempFormData.email}
          isEditing={isEditing}
          type='email'
          placeholder='k@example.com'
          onChange={(value) => onInputChange('email', value)}
        />

        <EditableField
          label={t('auth.phone_number')}
          value={tempFormData.phone}
          isEditing={isEditing}
          type='tel'
          placeholder={t('auth.phone_number_placeholder')}
          onChange={(value) => onInputChange('phone', value)}
        />

        <InterestsField
          interests={isEditing ? tempFormData.interests : formData.interests}
          isEditing={isEditing}
          onAdd={onInterestAdd}
          onRemove={onInterestRemove}
        />
      </div>
    </section>
  );
};

export default BasicInfoSection;
