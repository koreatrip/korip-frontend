import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import {
  useFavoritePlacesInfiniteQuery,
  useToggleFavoritePlaceMutation,
} from '@/api/favorites/favoriteHooks';
import type { FavoritePlace } from '@/api/favorites/favoriteType';

const Places = () => {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // 무한스크롤 훅 사용
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFavoritePlacesInfiniteQuery({ lang: i18n.language || 'ko' });

  const toggleFavoritePlaceMutation = useToggleFavoritePlaceMutation();

  // intersection observer 설정
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // 뷰포트에 들어오면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const allFavoritePlaces: FavoritePlace[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.favorite_places) ?? [];
  }, [data]);

  const sortOptions: DropdownItem[] = [
    {
      value: SortOption.DATE_DESC,
      label: t('common.date_descending'),
      onClick: () => setSortOption(SortOption.DATE_DESC),
    },
    {
      value: SortOption.DATE_ASC,
      label: t('common.date_ascending'),
      onClick: () => setSortOption(SortOption.DATE_ASC),
    },
    {
      value: SortOption.NAME_ASC,
      label: t('common.name_ascending'),
      onClick: () => setSortOption(SortOption.NAME_ASC),
    },
    {
      value: SortOption.NAME_DESC,
      label: t('common.name_descending'),
      onClick: () => setSortOption(SortOption.NAME_DESC),
    },
  ];

  const filteredAndSortedData: FavoritePlace[] = useMemo(() => {
    let filtered = [...allFavoritePlaces];

    // 검색 필터링
    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      filtered = filtered.filter((place) =>
        [place.name, place.address, place.category?.name, place.description]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(lower))
      );
    }

    // 정렬
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case SortOption.DATE_DESC:
          return (
            new Date(b.favorited_at).getTime() -
            new Date(a.favorited_at).getTime()
          );
        case SortOption.DATE_ASC:
          return (
            new Date(a.favorited_at).getTime() -
            new Date(b.favorited_at).getTime()
          );
        case SortOption.NAME_ASC:
          return a.name.localeCompare(b.name);
        case SortOption.NAME_DESC:
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [allFavoritePlaces, searchValue, sortOption]);

  const handleSearch = (value: string): void => setSearchValue(value);

  const handleCardClick = (id: number): void =>
    setSelectedPlaceId((prev) => (prev === id ? null : id));

  const handleAddSchedule = (id: number): void => {
    const place = allFavoritePlaces.find((p) => p.id === id);
    alert(`"${place?.name}"이(가) 일정에 추가되었습니다.`);
  };

  const handleViewDetails = (id: number): void => {
    const place = allFavoritePlaces.find((p) => p.id === id);
    alert(`"${place?.name}" 상세 정보를 확인합니다.`);
  };

  const handleFavorite = async (id: number): Promise<void> => {
    try {
      await toggleFavoritePlaceMutation.mutateAsync({ place_id: id });
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className='max-w-screen-2xl py-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 w-1/3 rounded bg-gray-200'></div>
          <div className='h-12 rounded bg-gray-200'></div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-[200px] rounded bg-gray-200'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className='max-w-screen-2xl py-8'>
        <div className='py-16 text-center'>
          <p className='text-red-500'>
            즐겨찾기 장소를 불러오는데 실패했습니다.
          </p>
          <p className='mt-2 text-sm text-gray-400'>
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-screen-2xl py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>
        {t('places.favorite_places')}
      </h1>

      <div className='mb-6 flex gap-4'>
        <div className='flex-1'>
          <SearchBar
            className='!max-w-[932px]'
            placeholder={t('places.search_region_placeholder')}
            onSearch={handleSearch}
          />
        </div>
        <SortDropdown options={sortOptions} current={sortOption} />
      </div>

      {searchValue && (
        <div className='mb-4 text-sm text-gray-600'>
          {t('places.search_results', {
            searchValue,
            count: filteredAndSortedData.length,
          })}
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredAndSortedData.map((item) => (
          <InfoCard
            key={item.id}
            variant='interactive'
            title={item.name}
            description={item.description}
            details={item.address}
            imageUrl={item.image_url}
            isSelected={selectedPlaceId === item.id}
            id={item.id}
            onClick={() => handleCardClick(item.id)}
            onAddSchedule={() => handleAddSchedule(item.id)}
            onViewDetails={() => handleViewDetails(item.id)}
            onFavorite={() => handleFavorite(item)}
          />
        ))}
      </div>

      {/* 무한스크롤 트리거 */}
      {hasNextPage && (
        <div ref={loadMoreRef} className='mt-8 flex justify-center'>
          {isFetchingNextPage ? (
            <div className='flex items-center gap-2'>
              <div className='border-t-sub-green h-5 w-5 animate-spin rounded-full border-2 border-gray-300'></div>
              <span className='text-sm text-gray-500'>로딩중...</span>
            </div>
          ) : (
            <div className='h-10'></div> // 트리거 영역
          )}
        </div>
      )}

      {filteredAndSortedData.length === 0 && !isLoading && (
        <div className='py-16 text-center'>
          <div className='mb-4 flex w-full justify-center'>
            <HeartIcon className='text-sub-text-gray h-8 w-8' />
          </div>
          {searchValue ? (
            <>
              <p className='text-sub-text-gray'>
                {t('common.no_search_favorites')}
              </p>
              <p className='text-sub-text-gray mt-2 text-sm'>
                {t('common.try_other_keywords')}
              </p>
            </>
          ) : (
            <>
              <p className='text-gray-500'>{t('common.no_favorites_yet')}</p>
              <p className='mt-2 text-sm text-gray-400'>
                {t('common.explore_and_add_favorites')}
              </p>
            </>
          )}
        </div>
      )}

      <div className='mt-12 text-right text-sm text-gray-400'>
        {t('places.total_favorites', {
          count: allFavoritePlaces.length,
        })}
      </div>
    </div>
  );
};

export default Places;
