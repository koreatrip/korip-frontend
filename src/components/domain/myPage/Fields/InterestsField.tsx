import { useTranslation } from 'react-i18next';

type InterestsFieldProps = {
  interests: string[];
  isEditing: boolean;
  onAdd: (interest: string) => void;
  onRemove: (interest: string) => void;
};

const InterestsField: React.FC<InterestsFieldProps> = ({
  interests,
  isEditing,
  onAdd,
  onRemove,
}) => {
  const { t } = useTranslation();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      onAdd(target.value);
      target.value = '';
    }
  };

  if (isEditing) {
    return (
      <div className='focus-within:border-main-pink focus-within:ring-main-pink flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 focus-within:ring-2'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-main-text-navy w-20 text-sm font-medium'>
            {t('user.interests')}
          </span>
          <div className='ml-4 flex-1'>
            <div className='flex h-6 flex-wrap items-center justify-end gap-2'>
              {interests.map((interest) => (
                <span
                  key={interest}
                  className='bg-main-pink text-bg-white inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm'
                >
                  #{interest}
                  <button
                    type='button'
                    onClick={() => onRemove(interest)}
                    className='hover:text-main-hover-pink'
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type='text'
                placeholder='+'
                className='w-16 flex-shrink-0 border-none bg-transparent text-right text-sm text-gray-800 outline-none placeholder:text-gray-400'
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex min-h-10 items-start justify-between'>
        <span className='text-main-text-navy w-20 pt-2 text-sm font-medium'>
          {t('user.interests')}
        </span>
        <div className='ml-4 flex-1'>
          <div className='flex flex-wrap justify-end gap-2'>
            {interests.map((interest) => (
              <span
                key={interest}
                className='bg-main-pink text-bg-white rounded-full px-3 py-1 text-sm'
              >
                #{interest}
              </span>
            ))}
          </div>
        </div>
      </div>
      <hr className='border-outline-gray -mt-4 border-t' />
    </>
  );
};

export default InterestsField;
