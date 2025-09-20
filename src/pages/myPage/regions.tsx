import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useFavoriteRegionsInfiniteQuery } from '@/api/favorites/favoriteHooks';
import type { FavoriteRegion } from '@/api/favorites/favoriteType';

const Regions = () => {
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
  } = useFavoriteRegionsInfiniteQuery({ lang: i18n.language || 'ko' });

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
  const allFavoriteRegions: FavoriteRegion[] = useMemo(() => {
    const result =
      data?.pages.flatMap((page) => page.favorite_subregions) ?? [];

    // 전체 데이터 콘솔 출력
    console.log('=== Regions 컴포넌트 데이터 디버깅 ===');
    console.log('Raw data from API:', data);
    console.log('All favorite regions:', result);
    console.log('Total regions count:', result.length);

    return result;
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

  const filteredAndSortedData: FavoriteRegion[] = useMemo(() => {
    let filtered = [...allFavoriteRegions];

    // 검색 필터링
    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      filtered = filtered.filter((region) =>
        [region.name, region.description, region.features]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(lower))
      );
    }

    // 정렬
    const sorted = filtered.sort((a, b) => {
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

    // 필터링/정렬 결과 콘솔 출력
    console.log('Search value:', searchValue);
    console.log('Sort option:', sortOption);
    console.log('Filtered data:', filtered);
    console.log('Final sorted data:', sorted);
    console.log('Final count:', sorted.length);

    // 각 지역의 세부 정보 출력
    if (sorted.length > 0) {
      console.log('Region details:');
      sorted.forEach((region, index) => {
        console.log(`  ${index + 1}. ${region.name}`, {
          id: region.id,
          description: region.description,
          features: region.features,
          favorite_count: region.favorite_count,
          favorited_at: region.favorited_at,
          latitude: region.latitude,
          longitude: region.longitude,
        });
      });
    }

    return sorted;
  }, [allFavoriteRegions, searchValue, sortOption]);

  // 상태 변화 감지
  useEffect(() => {
    console.log('Selected region ID changed:', selectedPlaceId);
  }, [selectedPlaceId]);

  useEffect(() => {
    console.log('Loading states:', {
      isLoading,
      isError,
      isFetchingNextPage,
      hasNextPage,
      inView,
    });
  }, [isLoading, isError, isFetchingNextPage, hasNextPage, inView]);

  const handleSearch = (value: string): void => {
    console.log('Search triggered:', value);
    setSearchValue(value);
  };

  const handleCardClick = (id: number): void => {
    console.log('Card clicked:', id);
    setSelectedPlaceId((prev) => (prev === id ? null : id));
  };

  const handleAddSchedule = (id: number): void => {
    const region = allFavoriteRegions.find((r) => r.id === id);
    console.log('Add to schedule:', { id, region: region?.name });
    alert(`"${region?.name}"이(가) 일정에 추가되었습니다.`);
  };

  const handleViewDetails = (id: number): void => {
    const region = allFavoriteRegions.find((r) => r.id === id);
    console.log('View details:', { id, region: region?.name });
    alert(`"${region?.name}" 상세 정보를 확인합니다.`);
  };

  // 즐겨찾기 토글은 이제 InfoCard에서 처리하므로 간단한 로그만
  const handleFavoriteCallback = (id: number): void => {
    console.log('Favorite callback from InfoCard:', id);
    // 필요시 추가 로직 (예: 목록 새로고침, 분석 등)
  };

  // 로딩 상태 처리
  if (isLoading) {
    console.log('Loading favorite regions...');
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
    console.error('Error loading favorite regions');
    return (
      <div className='max-w-screen-2xl py-8'>
        <div className='py-16 text-center'>
          <p className='text-error-red'>
            즐겨찾기 지역을 불러오는데 실패했습니다.
          </p>
          <p className='text-sub-text-gray mt-2 text-sm'>
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  console.log(
    'Rendering Regions component with',
    filteredAndSortedData.length,
    'regions'
  );

  return (
    <div className='max-w-screen-2xl py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>
        {t('places.favorite_regions')}
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
            type='region'
            key={item.id}
            variant='interactive'
            title={item.name}
            description={item.description}
            details={item.features} // 지역은 features를 details로 표시
            imageUrl={null} // 지역은 기본적으로 이미지가 없음
            isSelected={selectedPlaceId === item.id}
            isFavorite={item.is_favorite}
            id={item.id}
            onClick={() => handleCardClick(item.id)}
            onAddSchedule={() => handleAddSchedule(item.id)}
            onViewDetails={() => handleViewDetails(item.id)}
            onFavorite={() => handleFavoriteCallback(item.id)}
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
        {t('places.total_favorite_regions', {
          count: allFavoriteRegions.length,
        })}
      </div>
    </div>
  );
};

export default Regions;
