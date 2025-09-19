import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useToast } from '@/hooks/useToast';
import { useModalStore } from '@/stores/useModalStore';
import { useToggleFavoriteRegionMutation } from '@/api/favorites/favoriteHooks';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

type DistrictCardProps = {
  data: {
    id: number;
    name: string;
    description: string;
    feature: string;
    favorite_count?: number;
    attractions_count?: number;
    subregions_count?: number;
    is_favorite?: boolean; // 즐겨찾기 상태 추가
  };
  type: 'region' | 'subregion';
  onClick?: () => void;
  onFavoriteChange?: (id: number, isFavorite: boolean) => void; // 외부 콜백
};

const DistrictCard = ({
  data,
  type,
  onClick,
  onFavoriteChange,
}: DistrictCardProps) => {
  const { t } = useTranslation();
  const { actions: modalActions } = useModalStore();
  const { isLoggedIn } = useAuthCheck();
  const { showToast } = useToast();

  // 내부 즐겨찾기 상태 관리
  const [localIsFavorite, setLocalIsFavorite] = useState(
    data.is_favorite || false
  );

  // props가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setLocalIsFavorite(data.is_favorite || false);
  }, [data.is_favorite]);

  // 즐겨찾기 토글 mutation
  const toggleFavoriteRegionMutation = useToggleFavoriteRegionMutation();

  // attractions 수 결정
  const getAttractionsCount = () => {
    if (type === 'subregion') {
      return data.attractions_count || 0;
    } else {
      return data.subregions_count || 0;
    }
  };

  const attractionsCount = getAttractionsCount();

  // 즐겨찾기 토글 핸들러
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 분리

    if (!isLoggedIn) {
      modalActions.openLoginPrompt();
      return;
    }

    try {
      console.log(
        '❤️ Toggle favorite region:',
        data.id,
        'Current state:',
        localIsFavorite
      );

      // 낙관적 업데이트 (즉시 UI 반영)
      setLocalIsFavorite(!localIsFavorite);

      // API 호출
      await toggleFavoriteRegionMutation.mutateAsync({
        sub_region_id: data.id,
      });

      // 성공 토스트
      const message = !localIsFavorite
        ? '즐겨찾기에 추가되었습니다.'
        : '즐겨찾기에서 제거되었습니다.';
      showToast(message, 'success');

      console.log('✅ Favorite region toggled successfully');

      // 외부 콜백이 있으면 실행
      if (onFavoriteChange) {
        onFavoriteChange(data.id, !localIsFavorite);
      }
    } catch (error) {
      console.error('❌ 즐겨찾기 토글 실패:', error);

      // 에러 발생 시 상태 롤백
      setLocalIsFavorite(localIsFavorite);

      showToast('즐겨찾기 처리에 실패했습니다.', 'error');
    }
  };

  return (
    <div
      className='bg-bg-white border-outline-gray shadow-light hover:shadow-medium relative cursor-pointer rounded-2xl border p-4 transition-shadow'
      onClick={onClick}
    >
      <h3 className='text-lg font-medium'>{data.name}</h3>

      {/* 즐겨찾기 버튼 */}
      <button
        onClick={handleFavorite}
        className='absolute top-3 right-3 z-10 cursor-pointer'
      >
        <div className='border-outline-gray flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 hover:shadow-md'>
          {localIsFavorite ? (
            <StarSolid className='h-6 w-6 text-yellow-400 hover:text-yellow-500' />
          ) : (
            <StarOutline className='text-outline-gray h-6 w-6 hover:text-yellow-400' />
          )}
        </div>
      </button>

      <div className='text-sub-text-gray mt-1 flex items-center gap-x-1'>
        <MapPinIcon className='h-4 w-4' />
        <p>
          {t('places.45_attractions', { attractions_count: attractionsCount })}
        </p>
      </div>

      <p className='mt-2 text-sm text-gray-600'>{data.description}</p>

      <div className='bg-bg-section mt-3 flex flex-col gap-y-1 rounded-lg p-3'>
        <p className='text-sub-text-gray text-sm font-medium'>특징</p>
        <p className='text-sm'>{data.feature}</p>
      </div>
    </div>
  );
};

export default DistrictCard;
