import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

type TPlannerCardProps = {
  title: string;
  description: string;
  dateRange: string;
  imageUrl?: string;
  isNew?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
  hasSchedule?: boolean;
};

const PlannerCard = ({
  title,
  description,
  dateRange,
  onEdit,
  onDelete,
  onClick,
  hasSchedule = false,
}: TPlannerCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className='w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg'
      onClick={onClick}
    >
      <div className='px-4 pt-4'>
        <div className='flex items-center'>
          {hasSchedule ? (
            <>
              <div className='bg-main-pink mr-1.5 h-2 w-2 flex-shrink-0 rounded-full'></div>
              <span className='text-xs text-gray-900'>생성된 일정</span>
            </>
          ) : (
            <>
              <div className='bg-main-text-navy mr-1.5 h-2 w-2 flex-shrink-0 rounded-full'></div>
              <span className='text-xs text-gray-900'>
                {t('common.empty_schedule')}
              </span>
            </>
          )}
        </div>
      </div>

      <div className='flex h-[172px] flex-col justify-between p-4'>
        <div className='mb-2'>
          <div className='mb-1 flex items-center gap-1'>
            <h3 className='text-main-text-navy truncate text-lg font-semibold'>
              {title}
            </h3>
          </div>
          <p className='line-clamp-2 text-base text-gray-500'>{description}</p>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-base text-gray-500'>{dateRange}</span>

          <div className='flex items-center gap-2'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className='flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-500 transition-colors hover:text-gray-700'
              aria-label='편집'
            >
              <PencilIcon className='h-5 w-5 stroke-2' />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className='flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-500 transition-colors hover:text-gray-700'
              aria-label='삭제'
            >
              <TrashIcon className='h-5 w-5 stroke-2' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerCard;
