import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useToast } from '@/hooks/useToast';
import { useModalStore } from '@/stores/useModalStore';
import { useHeaderStore } from '@/stores/useHeaderStore';
import { usePlansQuery } from '@/api/planner/plannerHooks';
import { useToggleFavoritePlaceMutation } from '@/api/favorites/favoriteHooks';
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
  isFavorite?: boolean; // 즐겨찾기 상태 추가
  id?: number;
  onClick?: () => void;
  onAddSchedule?: () => void;
  onViewDetails?: () => void;
  onFavorite?: () => void; // 외부에서 추가 로직이 필요할 때 사용 (선택사항)
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
  onClick = () => {},
  onAddSchedule,
  onViewDetails = () => {},
  onFavorite, // 외부 콜백 (선택사항)
  onAddToSchedule,
}: TCard) => {
  const { actions: modalActions } = useModalStore();
  const { stack, actions } = useHeaderStore();
  const { isLoggedIn } = useAuthCheck();
  const { showToast } = useToast();

  // 내부 즐겨찾기 상태 관리
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 일정 데이터 가져오기
  const { data: plansData, isLoading, error } = usePlansQuery();

  // 즐겨찾기 토글 mutation
  const toggleFavoritePlaceMutation = useToggleFavoritePlaceMutation();

  console.log('Plans Data:', plansData);

  // 현재 카드의 드롭다운이 열려있는지 확인
  const isDropdownOpen =
    stack.isScheduleDropdownOpen && stack.scheduleDropdownCardId === String(id);

  console.log('Dropdown State:', {
    isScheduleDropdownOpen: stack.isScheduleDropdownOpen,
    scheduleDropdownCardId: stack.scheduleDropdownCardId,
    currentCardId: String(id),
    isDropdownOpen,
  });

  // 일정 추가 버튼 클릭 핸들러
  const handleAddSchedule = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    console.log('Add Schedule clicked', { id, isLoggedIn });

    if (onAddSchedule) {
      onAddSchedule();
    } else if (isLoggedIn) {
      // 로그인된 상태: 드롭다운 토글
      console.log('Toggling dropdown for card:', String(id));
      actions.toggleScheduleDropdown(String(id));
    } else {
      // 비로그인 상태: 로그인 프롬프트 모달 열기
      modalActions.openLoginPrompt();
    }
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewDetails();
  };

  // 즐겨찾기 토글 핸들러 (내장 로직)
  const handleFavorite = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (!isLoggedIn) {
      modalActions.openLoginPrompt();
      return;
    }

    if (!id) {
      console.error('Place ID is required for favorite toggle');
      return;
    }

    try {
      console.log('❤️ Toggle favorite:', id, 'Current state:', localIsFavorite);

      // 낙관적 업데이트 (즉시 UI 반영)
      setLocalIsFavorite(!localIsFavorite);

      // API 호출
      await toggleFavoritePlaceMutation.mutateAsync({ place_id: id });

      // 성공 토스트
      const message = !localIsFavorite
        ? '즐겨찾기에 추가되었습니다.'
        : '즐겨찾기에서 제거되었습니다.';
      showToast(message, 'success');

      console.log('✅ Favorite toggled successfully');

      // 외부 콜백이 있으면 실행 (추가 로직이 필요한 경우)
      if (onFavorite) {
        onFavorite();
      }
    } catch (error) {
      console.error('❌ 즐겨찾기 토글 실패:', error);

      // 에러 발생 시 상태 롤백
      setLocalIsFavorite(localIsFavorite);

      showToast('즐겨찾기 처리에 실패했습니다.', 'error');
    }
  };

  // 특정 일정에 추가하는 핸들러
  const handleSelectPlan = (planId: string, planName: string) => {
    if (onAddToSchedule) {
      onAddToSchedule(planId, planName);
    }
    actions.closeScheduleDropdown();
    showToast(`"${planName}" 일정에 추가되었습니다.`, 'success');
  };

  // 드롭다운 아이템 생성
  const createDropdownItems = (): TDropdownItem[] => {
    const plans = plansData?.plans;

    if (isLoading) {
      return [{ value: 'loading', label: '일정 불러오는 중...' }];
    }

    // 데이터가 없거나, 에러가 발생한 경우 '생성된 일정이 없습니다'만 표시
    if (error || !plans || !Array.isArray(plans) || plans.length === 0) {
      return [{ value: 'empty', label: '생성된 일정이 없습니다' }];
    }

    // 데이터가 있는 경우, plans 배열만 map으로 변환하여 반환
    return plans.map((plan) => ({
      value: String(plan.id),
      label: plan.title || `일정 ${plan.id}`,
      onClick: () =>
        handleSelectPlan(String(plan.id), plan.title || `일정 ${plan.id}`),
    }));
  };

  // props가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 드롭다운이나 버튼 영역 외부 클릭 시 닫기
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
    interactive: 'hover:shadow-xl overflow-visible', // 카드 자체는 overflow-visible
    selectable: `cursor-pointer overflow-hidden ${isSelected ? 'border-sub-green border' : 'border-transparent'}`,
  };

  return (
    <div
      className={`${baseCardClasses} ${variantClasses[variant]}`}
      onClick={variant === 'selectable' ? onClick : undefined}
    >
      {/* 상단 이미지/배경 영역 */}
      <div
        className='bg-bg-section relative h-[223px] w-full overflow-hidden rounded-t-2xl bg-cover bg-center'
        style={{
          backgroundImage: `url(${imageUrl || '이미지가 없습니다'})`,
        }}
      >
        {/* 즐겨찾기(별) 버튼 */}
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

      {/* 하단 텍스트 영역 */}
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

      {/* 호버 시 나타나는 액션 버튼 (interactive 타입일 때만) */}
      {variant === 'interactive' && (
        <div className='bg-main-text-navy/50 absolute inset-0 flex items-center justify-center space-x-4 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          {/* 일정 추가 버튼 */}
          <div className='relative'>
            <button
              ref={buttonRef}
              onClick={handleAddSchedule}
              className={`bg-main-text-navy hover:bg-main-text-navy/70 cursor-pointer rounded-full px-5 py-2 font-medium text-white transition-colors ${
                isDropdownOpen ? 'bg-main-text-navy/70' : ''
              }`}
            >
              일정 추가
            </button>

            {/* 드롭다운 - 버튼 바로 아래에 위치 */}
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
