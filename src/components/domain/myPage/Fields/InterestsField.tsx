import { useProfileEditStore } from '@/stores/useProfileEditStore';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAllCategoriesQuery } from '@/api/category/categoryHooks';
import Spinner from '@/components/common/Spinner';
import SubcategoryGroup from './SubcategoryGroup';

const InterestsField: React.FC = () => {
  const { state, actions } = useProfileEditStore();
  const { isEditing, tempFormData } = state;
  const { removeInterest } = actions;

  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'ko';

  const {
    data: categoryData,
    isLoading,
    isError,
  } = useAllCategoriesQuery(lang);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const interests = tempFormData?.preferences_display.map((p) => p.name) || [];
  // const selectedInterestsSet = useMemo(() => new Set(interests), [interests]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isEditing) {
    return (
      <div className='flex min-h-10 items-start justify-between'>
        <span className='text-main-text-navy w-20 pt-2 font-medium'>
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
    );
  }

  return (
    <div className='relative' ref={containerRef}>
      <div className='focus-within:border-main-pink focus-within:ring-main-pink bg-bg-white border-outline-gray flex min-h-10 items-center rounded-lg border px-4 focus-within:ring-1'>
        <div className='flex w-full items-center justify-between'>
          <span className='text-main-text-navy w-20 flex-shrink-0 font-medium'>
            {t('user.interests')}
          </span>
          <div className='ml-4 flex-1'>
            <div className='flex flex-wrap items-center justify-end gap-2'>
              {interests.map((interest) => (
                <span
                  key={interest}
                  className='inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-800'
                >
                  <span># {interest}</span>
                  <button
                    onClick={() => removeInterest(interest)}
                    className='-mr-0.5 rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                  >
                    <XMarkIcon className='h-4 w-4' />
                  </button>
                </span>
              ))}
              <button
                type='button'
                onClick={() => setIsSuggestionsOpen((prev) => !prev)}
                className='hover:text-main-pink text-ph-gray transition'
              >
                <PlusCircleIcon className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isSuggestionsOpen && (
        <div className='bg-bg-section shadow-medium absolute top-full z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 p-2'>
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div>Error</div>
          ) : (
            <div className='space-y-4'>
              {categoryData?.categories.map((mainCategory) => (
                <div key={mainCategory.id}>
                  <p className='text-sub-text-gray mb-2 px-1 text-sm font-semibold'>
                    {mainCategory.name}
                  </p>
                  <SubcategoryGroup categoryId={mainCategory.id} lang={lang} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterestsField;
