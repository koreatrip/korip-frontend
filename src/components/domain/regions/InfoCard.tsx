import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useToast } from '@/hooks/useToast';
import { useModalStore } from '@/stores/useModalStore';
import {
  useToggleFavoritePlaceMutation,
  useToggleFavoriteRegionMutation,
} from '@/api/favorites/favoriteHooks';
import Dropdown, {
  type TDropdownItem,
} from '@/components/common/dropdown/Dropdown';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useEffect, useState, type RefObject } from 'react';

type TCardProps = {
  id: number;
  variant?: 'interactive' | 'selectable';
  title?: string;
  description?: string;
  details?: string | null;
  imageUrl?: string | null;
  isSelected?: boolean;
  isFavorite?: boolean;
  type?: 'place' | 'region';
  onClick?: () => void;
  onViewDetails?: () => void;
  onFavorite?: () => void;
  isDropdownOpen?: boolean;
  onToggleDropdown?: () => void;
  dropdownItems?: TDropdownItem[];
  isAddingToSchedule?: boolean;
  dropdownButtonRef?: RefObject<HTMLButtonElement | null>;
  dropdownContentRef?: RefObject<HTMLDivElement | null>;
};

const InfoCard = ({
  id,
  variant = 'interactive',
  title = '제목 없음',
  description = '설명 없음',
  details = null,
  imageUrl = null,
  isSelected = false,
  isFavorite = false,
  type = 'place',
  onClick = () => {},
  onViewDetails = () => {},
  onFavorite,
  isDropdownOpen = false,
  onToggleDropdown = () => {},
  dropdownItems = [],
  isAddingToSchedule = false,
  dropdownButtonRef,
  dropdownContentRef,
}: TCardProps) => {
  const { actions: modalActions } = useModalStore();
  const { isLoggedIn } = useAuthCheck();
  const { showToast } = useToast();

  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

  const toggleFavoritePlaceMutation = useToggleFavoritePlaceMutation();
  const toggleFavoriteRegionMutation = useToggleFavoriteRegionMutation();

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavorite = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!isLoggedIn) {
      modalActions.openLoginPrompt();
      return;
    }

    const previousIsFavorite = localIsFavorite;
    setLocalIsFavorite(!previousIsFavorite);

    try {
      if (type === 'region') {
        await toggleFavoriteRegionMutation.mutateAsync({ sub_region_id: id });
      } else {
        await toggleFavoritePlaceMutation.mutateAsync({ place_id: id });
      }
      const itemType = type === 'region' ? '지역이' : '장소가';
      const message = !previousIsFavorite
        ? `즐겨찾기에 추가되었습니다.`
        : `즐겨찾기에서 제거되었습니다.`;
      showToast(`${itemType} ${message}`, 'success');

      onFavorite?.();
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      setLocalIsFavorite(previousIsFavorite);
      showToast('즐겨찾기 처리에 실패했습니다.', 'error');
    }
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewDetails();
  };

  const baseCardClasses =
    'relative group rounded-2xl bg-white shadow-medium transition-all duration-300 h-[350px]';
  const variantClasses = {
    interactive: 'hover:shadow-xl overflow-visible',
    selectable: `cursor-pointer overflow-hidden ${isSelected ? 'border-sub-green border' : 'border-transparent'}`,
  };

  return (
    <div
      className={`${baseCardClasses} ${variantClasses[variant]}`}
      onClick={variant === 'selectable' ? onClick : undefined}
    >
      <div
        className='bg-bg-section relative h-[223px] w-full overflow-hidden rounded-t-2xl bg-cover bg-center'
        style={{
          backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/300x200'})`,
        }}
      >
        <button
          onClick={handleFavorite}
          className='absolute top-3 right-3 z-10 cursor-pointer'
        >
          <div className='border-outline-gray flex h-16 w-16 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:shadow-md'>
            {localIsFavorite ? (
              <StarSolid className='h-8 w-8 text-yellow-400 hover:text-yellow-500' />
            ) : (
              <StarOutline className='text-outline-gray h-8 w-8 hover:text-yellow-400' />
            )}
          </div>
        </button>
      </div>

      <div className='overflow-hidden p-5'>
        <h3 className='text-main-text-navy truncate text-lg font-semibold'>
          {title}
        </h3>
        <p
          className='text-sub-text-gray mt-1 leading-relaxed font-normal'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </p>
        {details && (
          <div className='text-sub-text-gray flex items-center'>
            <span className='truncate'>{details}</span>
          </div>
        )}
      </div>

      {variant === 'interactive' && (
        <div className='bg-main-text-navy/50 absolute inset-0 flex items-center justify-center space-x-4 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <div className='relative'>
            <button
              ref={dropdownButtonRef}
              onClick={onToggleDropdown}
              disabled={isAddingToSchedule}
              className={`bg-main-text-navy hover:bg-main-text-navy/70 cursor-pointer rounded-full px-5 py-2 font-medium text-white transition-colors`}
            >
              {isAddingToSchedule ? '추가 중...' : '일정 추가'}
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownContentRef}
                className='absolute top-full left-1/2 mt-2 -translate-x-1/2 transform'
                style={{
                  minWidth: '200px',
                  zIndex: 9999,
                }}
              >
                <Dropdown
                  isOpen={true}
                  items={dropdownItems} // map 제거
                  onClose={onToggleDropdown}
                  position='center'
                  width='w-48'
                />
              </div>
            )}
          </div>
          <button
            onClick={handleViewDetails}
            className='text-main-text-navy bg-bg-white cursor-pointer rounded-full px-5 py-2 font-medium hover:bg-gray-200'
          >
            상세보기
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
