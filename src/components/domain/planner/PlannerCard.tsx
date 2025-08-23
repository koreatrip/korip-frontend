import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
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
};

const PlannerCard = ({
  title,
  description,
  dateRange,
  imageUrl,
  isNew = false,
  onEdit,
  onDelete,
  onClick,
}: TPlannerCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className='h-[372px] w-[348px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg'
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div
        className='relative h-[200px]'
        style={{ backgroundColor: '#F8F9FA' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-[#F7FAFC]'>
            <span className='text-md text-gray-900'>
              {t('common.empty_schedule')}
            </span>
          </div>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className='flex h-[172px] flex-col justify-between p-4'>
        {/* 제목과 NEW 태그 */}
        <div className='mb-2'>
          <div className='mb-1 flex items-center gap-1'>
            <h3 className='text-main-text-navy truncate text-lg font-semibold'>
              {title}
            </h3>
            {isNew && (
              <span className='text-main-pink ml-1 text-sm font-medium'>
                NEW
              </span>
            )}
          </div>
          <p className='line-clamp-2 text-base text-gray-500'>{description}</p>
        </div>

        {/* 하단 영역: 날짜와 버튼들 */}
        <div className='flex items-center justify-between'>
          <span className='text-base text-gray-500'>{dateRange}</span>

          {/* 편집/삭제 버튼 */}
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
