// InfoCard.tsx
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useToast } from '@/hooks/useToast';
import { useModalStore } from '@/stores/useModalStore';
import { useHeaderStore } from '@/stores/useHeaderStore';
import {
  usePlansQuery,
  useAddPlaceToPlanMutation,
} from '@/api/planner/plannerHooks';
import {
  useToggleFavoritePlaceMutation,
  useToggleFavoriteRegionMutation,
} from '@/api/favorites/favoriteHooks';
import Dropdown, {
  type TDropdownItem,
} from '@/components/common/dropdown/Dropdown';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

type TCard = {
  variant?: 'interactive' | 'selectable';
  title?: string;
  description?: string;
  details?: string | null;
  imageUrl?: string | null;
  isSelected?: boolean;
  isFavorite?: boolean;
  id?: number;
  type?: 'place' | 'region';
  onClick?: () => void;
  onAddSchedule?: () => void;
  onViewDetails?: () => void;
  onFavorite?: () => void;
  onAddToSchedule?: (planId: string, planName: string) => void;
};

const InfoCard = ({
  variant = 'interactive',
  title = '제목 없음',
  description = '설명 없음',
  details = null,
  imageUrl = null,
  isSelected = false,
  isFavorite = false,
  id,
  type = 'place',
  onClick = () => {},
  onAddSchedule,
  onViewDetails = () => {},
  onFavorite,
  onAddToSchedule,
}: TCard) => {
  const { actions: modalActions } = useModalStore();
  const { stack, actions } = useHeaderStore();
  const { isLoggedIn } = useAuthCheck();
  const { showToast } = useToast();

  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: plansData, isLoading, error } = usePlansQuery();
  const toggleFavoritePlaceMutation = useToggleFavoritePlaceMutation();
  const toggleFavoriteRegionMutation = useToggleFavoriteRegionMutation();

  // 일정에 장소 추가 mutation
  const addPlaceToPlanMutation = useAddPlaceToPlanMutation({
    onSuccess: (data) => {
      console.log('장소가 일정에 추가되었습니다:', data);
    },
    onError: (error) => {
      console.error('장소 추가 실패:', error);
      showToast('일정에 장소를 추가하는데 실패했습니다.', 'error');
    },
  });

  const isDropdownOpen =
    stack.isScheduleDropdownOpen && stack.scheduleDropdownCardId === String(id);

  const handleAddSchedule = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (onAddSchedule) {
      onAddSchedule();
    } else if (isLoggedIn) {
      actions.toggleScheduleDropdown(String(id));
    } else {
      modalActions.openLoginPrompt();
    }
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewDetails();
  };

  const handleFavorite = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!isLoggedIn) {
      modalActions.openLoginPrompt();
      return;
    }

    if (!id) {
      console.error('ID is required for favorite toggle');
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

      if (onFavorite) {
        onFavorite();
      }
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      setLocalIsFavorite(previousIsFavorite);
      showToast('즐겨찾기 처리에 실패했습니다.', 'error');
    }
  };

  const handleSelectPlan = async (planId: string, planName: string) => {
    if (!id) {
      console.error('Place ID is required');
      showToast('장소 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    try {
      // API 호출: 일정에 장소 추가
      await addPlaceToPlanMutation.mutateAsync({
        planId: planId,
        placeData: { place_id: id },
      });

      // 드롭다운 닫기
      actions.closeScheduleDropdown();

      // 성공 토스트 메시지
      showToast(`"${planName}" 일정에 추가되었습니다.`, 'success');

      // 부모 컴포넌트의 콜백이 있다면 실행
      if (onAddToSchedule) {
        onAddToSchedule(planId, planName);
      }
    } catch (error) {
      console.error('일정에 장소 추가 실패:', error);
      // 에러는 mutation의 onError에서 처리됨
    }
  };

  const createDropdownItems = (): TDropdownItem[] => {
    const plans = plansData?.plans;
    if (isLoading) return [{ value: 'loading', label: '일정 불러오는 중...' }];
    if (error || !plans || !Array.isArray(plans) || plans.length === 0) {
      return [{ value: 'empty', label: '생성된 일정이 없습니다' }];
    }
    return plans.map((plan) => ({
      value: String(plan.id),
      label: plan.title || `일정 ${plan.id}`,
      onClick: () =>
        handleSelectPlan(String(plan.id), plan.title || `일정 ${plan.id}`),
    }));
  };

  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        actions.closeScheduleDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen, actions]);

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
        <h3 className='text-main-text-navy text-lg font-semibold'>{title}</h3>
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
              ref={buttonRef}
              onClick={handleAddSchedule}
              className={`bg-main-text-navy hover:bg-main-text-navy/70 cursor-pointer rounded-full px-5 py-2 font-medium text-white transition-colors ${
                isDropdownOpen ? 'bg-main-text-navy/70' : ''
              }`}
              disabled={addPlaceToPlanMutation.isPending}
            >
              {addPlaceToPlanMutation.isPending ? '추가 중...' : '일정 추가'}
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className='absolute top-full left-1/2 mt-2 -translate-x-1/2 transform'
                style={{
                  minWidth: '200px',
                  zIndex: 9999,
                }}
              >
                <Dropdown
                  isOpen={true}
                  items={createDropdownItems()}
                  onClose={() => actions.closeScheduleDropdown()}
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
