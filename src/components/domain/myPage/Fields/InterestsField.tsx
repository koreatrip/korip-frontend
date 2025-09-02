import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/solid';

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
      <div className='focus-within:border-main-pink focus-within:ring-main-pink bg-bg-white border-outline-gray flex h-10 items-center rounded-lg border px-4 focus-within:ring-2'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-main-text-navy w-20 font-medium'>
            {t('user.interests')}
          </span>
          <div className='ml-4 flex-1'>
            <div className='flex h-6 flex-wrap items-center justify-end gap-2'>
              {interests.map((interest) => (
                <span
                  key={interest}
                  className='inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-800'
                >
                  <span># {interest}</span>
                  <button
                    onClick={() => onRemove(interest)}
                    className='-mr-0.5 rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  >
                    <XMarkIcon className='h-4 w-4' />
                  </button>
                </span>
              ))}
              <input
                type='text'
                placeholder='+'
                className='placeholder:text-ph-gray w-16 flex-shrink-0 border-none bg-transparent text-right text-sm text-gray-800 outline-none'
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
