// EmptyCard.tsx
import {
  MapPinIcon,
  BuildingOfficeIcon,
  CameraIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

// 타입 정의
type EmptyCardVariant = 'selectable' | 'interactive';

type EmptyCardType =
  | 'default'
  | 'subregions'
  | 'attractions'
  | 'accommodations'
  | 'user-recommended';

type EmptyCardProps = {
  variant?: EmptyCardVariant;
  type?: EmptyCardType;
  title?: string;
  description?: string;
  actionButton?: ReactNode;
  onActionClick?: () => void;
};

type EmptyStateConfig = {
  icon: ReactNode;
  defaultTitle: string;
  defaultDescription: string;
};

const EmptyCard: React.FC<EmptyCardProps> = ({
  variant = 'selectable',
  type = 'default',
  title,
  description,
  actionButton,
  onActionClick,
}) => {
  // 타입별 아이콘과 기본 메시지 설정
  const getEmptyStateConfig = (): EmptyStateConfig => {
    switch (type) {
      case 'subregions':
        return {
          icon: <MapPinIcon className='h-8 w-8 text-gray-400' />,
          defaultTitle: '준비 중',
          defaultDescription: '인기 지역 정보를 업데이트하고 있어요',
        };
      case 'attractions':
        return {
          icon: <CameraIcon className='h-8 w-8 text-gray-400' />,
          defaultTitle: '준비 중',
          defaultDescription: '멋진 관광지 정보를 찾고 있어요',
        };
      case 'accommodations':
        return {
          icon: <HomeIcon className='h-8 w-8 text-gray-400' />,
          defaultTitle: '준비 중',
          defaultDescription: '추천 숙박 시설을 준비하고 있어요',
        };
      case 'user-recommended':
        return {
          icon: <BuildingOfficeIcon className='h-8 w-8 text-gray-400' />,
          defaultTitle: '맞춤 추천 준비 중',
          defaultDescription: '관심사에 맞는 장소를 찾고 있어요',
        };
      default:
        return {
          icon: <MapPinIcon className='h-8 w-8 text-gray-400' />,
          defaultTitle: '준비 중',
          defaultDescription: '정보를 업데이트하고 있어요',
        };
    }
  };

  const config = getEmptyStateConfig();

  /**
   * InfoCard와 동일한 기본 스타일
   */
  const baseCardClasses =
    'relative group rounded-2xl bg-white shadow-medium overflow-hidden transition-all duration-300 h-[350px]';

  /**
   * InfoCard와 동일한 variant 스타일
   */
  const variantClasses: Record<EmptyCardVariant, string> = {
    interactive: 'hover:shadow-xl',
    selectable: 'cursor-pointer border-transparent',
  };

  const handleClick = (): void => {
    if (variant === 'selectable' && onActionClick) {
      onActionClick();
    }
  };

  const handleActionButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick();
    }
  };

  return (
    <div
      className={`${baseCardClasses} ${variantClasses[variant]}`}
      onClick={variant === 'selectable' ? handleClick : undefined}
    >
      {/* --- 상단 이미지/배경 영역 (InfoCard와 동일) --- */}
      <div className='bg-bg-section relative flex h-[223px] w-full items-center justify-center bg-gray-50'>
        {/* 아이콘과 점선 표시 */}
        <div className='flex flex-col items-center space-y-3'>
          {config.icon}
          <div className='flex space-x-1'>
            <div className='h-2 w-2 rounded-full bg-gray-300'></div>
            <div className='h-2 w-2 rounded-full bg-gray-300'></div>
            <div className='h-2 w-2 rounded-full bg-gray-300'></div>
          </div>
        </div>
      </div>

      {/* --- 하단 텍스트 영역 (InfoCard와 동일) --- */}
      <div className='p-5'>
        <h3 className='text-main-text-navy text-lg font-semibold'>
          {title || config.defaultTitle}
        </h3>

        {/* InfoCard와 동일한 description 스타일 */}
        <p
          className='text-sub-text-gray mt-1 leading-relaxed font-normal'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2, // 최대 2줄까지 표시
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description || config.defaultDescription}
        </p>

        {/* 액션 버튼이 있을 때만 표시 */}
        {actionButton && (
          <div className='text-sub-text-gray mt-2 flex items-center'>
            {actionButton}
          </div>
        )}
      </div>

      {/* --- 호버 시 나타나는 액션 버튼 (interactive 타입일 때만) --- */}
      {variant === 'interactive' && onActionClick && (
        <div className='bg-main-text-navy/50 absolute inset-0 flex items-center justify-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <button
            onClick={handleActionButtonClick}
            className='bg-main-text-navy hover:bg-main-text-navy/70 cursor-pointer rounded-full px-5 py-2 font-medium text-white'
          >
            다른 지역 보기
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyCard;
