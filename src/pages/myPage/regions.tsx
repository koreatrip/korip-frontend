import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import type { DropdownItem } from '@/types/dropdown';
import React, { useMemo, useRef, useState } from 'react';

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
        label: '날짜 내림차순',
        onClick: () => setSortOption('dateDesc'),
      },
      {
        value: 'dateAsc',
        label: '날짜 오름차순',
        onClick: () => setSortOption('dateAsc'),
      },
      {
        value: 'nameAsc',
        label: '이름 오름차순',
        onClick: () => setSortOption('nameAsc'),
      },
      {
        value: 'nameDesc',
        label: '이름 내림차순',
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
    <div className='w-full px-2 py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>즐겨찾는 지역</h1>

      <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center'>
        <div className='flex-1'>
          <SearchBar
            className='max-w-none'
            placeholder='지역명을 검색해보세요 (예: 서울, 제주도)'
            onSearch={setSearchValue}
          />
        </div>
        <div ref={dropdownRef}>
          <SortDropdown options={sortOptions} current={sortOption} />
        </div>
      </div>

      {searchValue && (
        <div className='mb-4 text-sm text-gray-600'>
          "{searchValue}"에 대한 검색 결과: {filteredAndSortedData.length}개
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
          <div className='mb-4 text-gray-300'>
            <svg
              className='mx-auto h-16 w-16'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
          </div>
          {searchValue ? (
            <>
              <p className='text-gray-500'>검색한 즐겨찾기가 없습니다.</p>
              <p className='mt-2 text-sm text-gray-400'>
                다른 키워드로 검색해보세요.
              </p>
            </>
          ) : (
            <>
              <p className='text-gray-500'>아직 즐겨찾기한 지역이 없습니다.</p>
              <p className='mt-2 text-sm text-gray-400'>
                여행지를 탐색하고 즐겨찾기에 추가해보세요.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Regions;
