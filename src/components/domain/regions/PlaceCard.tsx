import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useToast } from '@/hooks/useToast';
import { useModalStore } from '@/stores/useModalStore';
import { useToggleFavoritePlaceMutation } from '@/api/favorites/favoriteHooks';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

type PlaceCardProps = {
  data: {
    id: number;
    name: string;
    description: string | null;
    address: string;
    category: {
      id: number;
      name: string;
    };
    sub_category: {
      id: number;
      name: string;
    } | null;
    region: {
      id: number;
      name: string;
    };
    sub_region: {
      id: number;
      name: string;
    };
    favorite_count: number;
    is_favorite?: boolean; // 즐겨찾기 상태 추가
  };
  onClick?: () => void;
  onFavoriteChange?: (id: number, isFavorite: boolean) => void; // 외부 콜백
};

const PlaceCard = ({ data, onClick, onFavoriteChange }: PlaceCardProps) => {
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
  const toggleFavoritePlaceMutation = useToggleFavoritePlaceMutation();

  // 즐겨찾기 토글 핸들러
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 분리

    if (!isLoggedIn) {
      modalActions.openLoginPrompt();
      return;
    }

    try {
      console.log(
        '❤️ Toggle favorite place:',
        data.id,
        'Current state:',
        localIsFavorite
      );

      // 낙관적 업데이트 (즉시 UI 반영)
      setLocalIsFavorite(!localIsFavorite);

      // API 호출
      await toggleFavoritePlaceMutation.mutateAsync({ place_id: data.id });

      // 성공 토스트
      const message = !localIsFavorite
        ? '즐겨찾기에 추가되었습니다.'
        : '즐겨찾기에서 제거되었습니다.';
      showToast(message, 'success');

      console.log('✅ Favorite place toggled successfully');

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
        <p className='text-sub-text-gray text-sm'>{data.address}</p>
      </div>

      <div className='bg-bg-section mt-2 mb-4 flex flex-col gap-y-1 rounded-lg p-2'>
        <p className='text-sub-text-gray text-sm font-medium'>특징</p>
        <p className='text-sm'>{data.description || '설명이 없습니다.'}</p>
      </div>

      <div className='flex flex-wrap gap-x-1.5'>
        <span className='bg-sub-green/15 text-sub-green rounded-lg px-2 py-1.5 text-sm'>
          {data.category?.name}
        </span>
        {data.sub_category?.name && (
          <span className='bg-sub-green/15 text-sub-green rounded-lg px-2 py-1.5 text-sm'>
            {data.sub_category.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
