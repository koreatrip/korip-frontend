import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import type { PlaceData } from '@/types/plannerType';
import { HeartIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFavoritePlaces, useUserProfile, useToggleFavoritePlace } from '@/api/user/userHooks';
import type { FavoritePlace } from '@/api/user/userType';

const Places: React.FC = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // API에서 사용자 정보와 즐겨찾기 장소 조회 - 임시로 비활성화
  // const { data: userProfileData } = useUserProfile();
  // const userId = userProfileData?.data?.id;
  // const { data: favoritePlacesData, isLoading, error } = useFavoritePlaces(userId || 0);
  const toggleFavoritePlace = useToggleFavoritePlace();

  // 임시 목 데이터
  const mockFavoritePlacesData = {
    data: [
      {
        id: 1,
        type: '관광지',
        title: '경복궁',
        description: '조선왕조 제일의 법궁',
        details: '서울 종로구에 위치한 조선왕조의 정궁',
        location: '서울특별시 종로구',
        imageUrl: null,
        isFavorite: true,
        createdAt: '2024-02-20',
      },
      {
        id: 2,
        type: '맛집',
        title: '명동교자',
        description: '유명한 만두 전문점',
        details: '50년 전통의 손만두 맛집',
        location: '서울특별시 중구 명동',
        imageUrl: null,
        isFavorite: true,
        createdAt: '2024-02-18',
      },
    ],
  };

  const favoritePlacesData = mockFavoritePlacesData;
  const isLoading = false;
  const error = null;

  // API 데이터를 로컬 형식으로 변환
  const places: PlaceData[] = useMemo(() => {
    if (!favoritePlacesData?.data) return [];
    
    return favoritePlacesData.data.map((place: FavoritePlace) => ({
      id: place.id,
      type: place.type,
      title: place.title,
      description: place.description,
      details: place.details,
      location: place.location,
      imageUrl: place.imageUrl,
      isFavorite: place.isFavorite,
      createdAt: place.createdAt,
    }));
  }, [favoritePlacesData]);

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

  const filteredAndSortedData: PlaceData[] = useMemo(() => {
    let filtered = places.filter((place) => place.isFavorite);

    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();
      filtered = filtered.filter((place) =>
        [place.title, place.location, place.type, place.description]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(lower))
      );
    }

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case SortOption.DATE_DESC:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case SortOption.DATE_ASC:
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case SortOption.NAME_ASC:
          return a.title.localeCompare(b.title);
        case SortOption.NAME_DESC:
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [places, searchValue, sortOption]);

  const handleSearch = (value: string): void => setSearchValue(value);
  const handleCardClick = (id: number): void =>
    setSelectedPlaceId((prev) => (prev === id ? null : id));
  const handleAddSchedule = (id: number): void => {
    const place = places.find((p) => p.id === id);
    alert(`"${place?.title}"이(가) 일정에 추가되었습니다.`);
  };
  const handleViewDetails = (id: number): void => {
    const place = places.find((p) => p.id === id);
    alert(`"${place?.title}" 상세 정보를 확인합니다.`);
  };
  const handleFavorite = async (id: number): Promise<void> => {
    // 임시로 비활성화
    // if (!userId) return;
    
    try {
      // await toggleFavoritePlace.mutateAsync({ userId, placeId: id });
      console.log('즐겨찾기 토글:', id);
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className='max-w-screen-2xl py-8'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/3'></div>
          <div className='h-12 bg-gray-200 rounded'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-[200px] bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className='max-w-screen-2xl py-8'>
        <div className='text-center py-16'>
          <p className='text-red-500'>즐겨찾기 장소를 불러오는데 실패했습니다.</p>
          <p className='text-gray-400 text-sm mt-2'>잠시 후 다시 시도해주세요.</p>
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
            title={item.title}
            description={item.description}
            details={item.details}
            imageUrl={item.imageUrl}
            isSelected={selectedPlaceId === item.id}
            onClick={() => handleCardClick(item.id)}
            onAddSchedule={() => handleAddSchedule(item.id)}
            onViewDetails={() => handleViewDetails(item.id)}
            onFavorite={() => handleFavorite(item.id)}
          />
        ))}
      </div>

      {filteredAndSortedData.length === 0 && (
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
          count: filteredAndSortedData.length,
        })}
      </div>
    </div>
  );
};

export default Places;
