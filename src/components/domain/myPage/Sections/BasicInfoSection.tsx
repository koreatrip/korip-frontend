import Button from '@/components/common/Button';
import EditableField from '../Fields/EditableField';
import InterestsField from '../Fields/InterestsField';
import { useTranslation } from 'react-i18next';

type FormData = {
  name: string;
  email: string;
  phone_number: string;
  preferences_display: { id: number; name: string }[];
  profileImage?: string;
};

type BasicInfoSectionProps = {
  formData: FormData;
  tempFormData: FormData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onInputChange: (field: keyof FormData, value: string) => void;
  onInterestAdd: (interest: string) => void;
  onInterestRemove: (interest: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const BasicInfoSection = ({
  formData,
  tempFormData,
  isEditing,
  onToggleEdit,
  onInputChange,
  onInterestAdd,
  onInterestRemove,
  onSave,
  onCancel,
}: BasicInfoSectionProps) => {
  const { t } = useTranslation();

  const getInterestsArray = (data: FormData): string[] => {
    return data.preferences_display?.map((p) => p.name) || [];
  };

  const currentInterests = getInterestsArray(
    isEditing ? tempFormData : formData
  );

  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-main-text-navy text-lg font-bold'>
          {t('user.basic_info')}
        </h3>

        {/* 'isEditing' 상태에 따라 다른 버튼을 렌더링합니다. */}
        {isEditing ? (
          <div className='flex items-center gap-x-2'>
            <Button
              variant='cancel' // '취소' 버튼은 다른 스타일로
              className='w-auto px-3 py-1'
              onClick={onCancel}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant='active'
              className='w-auto px-3 py-1'
              onClick={onSave}
            >
              {t('common.save')}
            </Button>
          </div>
        ) : (
          <Button
            variant='active'
            className='w-auto px-3 py-1'
            onClick={onToggleEdit}
          >
            {t('common.edit')}
          </Button>
        )}
      </div>

      <div className='space-y-4'>
        {/* 이름 필드 활성화 */}
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
          isEditing={false}
          type='email'
          placeholder='k@example.com'
          onChange={() => {}}
          disabled
        />

        <EditableField
          label={t('auth.phone_number')}
          value={tempFormData.phone_number}
          isEditing={isEditing}
          type='tel'
          placeholder={t('auth.phone_number_placeholder')}
          onChange={(value) => onInputChange('phone_number', value)}
        />

        <InterestsField
          interests={currentInterests}
          isEditing={isEditing}
          onAdd={onInterestAdd}
          onRemove={onInterestRemove}
        />
      </div>
    </section>
  );
};

export default BasicInfoSection;
