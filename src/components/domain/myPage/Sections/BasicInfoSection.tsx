import { useProfileEditStore } from '@/stores/useProfileEditStore';
import Button from '@/components/common/Button';
import EditableField from '../Fields/EditableField';
import InterestsField from '../Fields/InterestsField';
import { useTranslation } from 'react-i18next';

type BasicInfoSectionProps = {
  onSave: () => void;
};

const BasicInfoSection = ({ onSave }: BasicInfoSectionProps) => {
  const { state, actions } = useProfileEditStore();
  const { isEditing, tempFormData } = state;
  const { setInputValue, toggleEdit } = actions;
  const { t } = useTranslation();

  if (!tempFormData) return null;

  return (
    <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-main-text-navy text-lg font-bold'>
          {t('user.basic_info')}
        </h3>
        {isEditing ? (
          <div className='flex items-center gap-x-2'>
            <Button
              variant='cancel'
              className='w-auto px-3 py-1'
              onClick={toggleEdit}
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
            onClick={toggleEdit}
          >
            {t('common.edit')}
          </Button>
        )}
      </div>

      <div className='space-y-4'>
        <EditableField
          label={t('auth.username')}
          value={tempFormData.name}
          isEditing={isEditing}
          onChange={(value) => setInputValue('name', value)}
        />
        <EditableField
          label={t('auth.email')}
          value={tempFormData.email}
          isEditing={false}
          disabled
        />
        <EditableField
          label={t('auth.phone_number')}
          value={tempFormData.phone_number}
          isEditing={isEditing}
          onChange={(value) => setInputValue('phone_number', value)}
        />
        <InterestsField />
      </div>
    </section>
  );
};

export default BasicInfoSection;
