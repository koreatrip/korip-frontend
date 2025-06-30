import Button from '@/components/common/Button';
import type { UserProfile } from '@/types/user';
import React from 'react';
import EditableField from '../Fields/EditableField';
import InterestsField from '../Fields/InterestsField';

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
  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-main-text-navy text-lg font-bold'>기본정보</h3>
        <Button
          variant='active'
          className='h-2 w-14 text-sm'
          onClick={onToggleEdit}
        >
          {isEditing ? '취소' : '수정'}
        </Button>
      </div>

      <div className='space-y-4'>
        <EditableField
          label='아이디'
          value={tempFormData.name}
          isEditing={isEditing}
          placeholder='아이디를 입력하세요'
          onChange={(value) => onInputChange('name', value)}
        />

        <EditableField
          label='이메일'
          value={tempFormData.email}
          isEditing={isEditing}
          type='email'
          placeholder='이메일을 입력하세요'
          onChange={(value) => onInputChange('email', value)}
        />

        <EditableField
          label='연락처'
          value={tempFormData.phone}
          isEditing={isEditing}
          type='tel'
          placeholder='연락처를 입력하세요'
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
