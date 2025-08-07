import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import type { DropdownItem } from '@/types/dropdown';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeartIcon } from '@heroicons/react/24/outline';

type RegionsData = {
  id: number;
  type: string;
  title: string;
  description: string;
  details: string | null;
  location: string;
  imageUrl: string | null;
  isFavorite: boolean;
  createdAt?: string;
};

type SortOption = 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc';

const Regions: React.FC = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('dateDesc');
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [favoriteData, setFavoriteData] = useState<RegionsData[]>([
    /* ... */
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: DropdownItem[] = useMemo(
    () => [
      {
        value: 'dateDesc',
        label: t('common.date_descending'),
        onClick: () => setSortOption('dateDesc'),
      },
      {
        value: 'dateAsc',
        label: t('common.date_ascending'),
        onClick: () => setSortOption('dateAsc'),
      },
      {
        value: 'nameAsc',
        label: t('common.name_ascending'),
        onClick: () => setSortOption('nameAsc'),
      },
      {
        value: 'nameDesc',
        label: t('common.name_descending'),
        onClick: () => setSortOption('nameDesc'),
      },
    ],
    []
  );

  const filteredAndSortedData = useMemo(() => {
    let filtered = favoriteData.filter((item) => item.isFavorite);

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((item) =>
        [item.title, item.location, item.type, item.description]
          .filter(Boolean)
          .some((field) => field?.toLowerCase().includes(searchLower))
      );
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'dateDesc':
          return (
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
          );
        case 'dateAsc':
          return (
            new Date(a.createdAt || '').getTime() -
            new Date(b.createdAt || '').getTime()
          );
        case 'nameAsc':
          return a.title.localeCompare(b.title);
        case 'nameDesc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [favoriteData, searchValue, sortOption]);

  const handleCardClick = (id: number) => {
    setSelectedPlaceId(selectedPlaceId === id ? null : id);
  };

  const handleFavorite = (id: number) => {
    setFavoriteData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleAddSchedule = (id: number) => {
    const place = favoriteData.find((p) => p.id === id);
    alert(`"${place?.title}"이(가) 일정에 추가되었습니다.`);
  };

  const handleViewDetails = (id: number) => {
    const place = favoriteData.find((p) => p.id === id);
    alert(`"${place?.title}" 상세 정보를 확인합니다.`);
  };

  return (
    <div className='w-full py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>
        {t('places.favorite_regions')}
      </h1>

      <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center'>
        <div className='flex-1'>
          <SearchBar
            className='max-w-none'
            placeholder={t('places.search_region_placeholder')}
            onSearch={setSearchValue}
          />
        </div>
        <div ref={dropdownRef}>
          <SortDropdown options={sortOptions} current={sortOption} />
        </div>
      </div>

      {searchValue && (
        <div className='mb-4 text-sm text-gray-600'>
          {t('places.search_results', {
            searchValue,
            count: filteredAndSortedData.length,
          })}
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
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

      <div className='text-sub-text-gray mt-12 text-right text-sm'>
        {t('places.total_favorite_regions', {
          count: filteredAndSortedData.length,
        })}
      </div>
    </div>
  );
};

export default Regions;
