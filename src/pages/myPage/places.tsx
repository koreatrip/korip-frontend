import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import type { PlaceData } from '@/types/plannerType';
import { HeartIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Places: React.FC = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(
    SortOption.DATE_DESC
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const [places, setPlaces] = useState<PlaceData[]>([
    {
      id: 1,
      type: '궁궐',
      title: '경복궁',
      description: '조선왕조 최고의 궁궐',
      details: '서울 종로구 사직로 161',
      location: '서울 종로구',
      imageUrl: null,
      isFavorite: true,
      createdAt: '2025-06-25',
    },
    {
      id: 2,
      type: '한옥마을',
      title: '북촌 한옥마을',
      description: '한국 전통 가옥이 잘 보존된 아름다운 문화재',
      details: '서울특별시 종로구',
      location: '서울 종로구',
      imageUrl: null,
      isFavorite: true,
      createdAt: '2025-06-26',
    },
  ]);

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
  const handleFavorite = (id: number): void => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

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
