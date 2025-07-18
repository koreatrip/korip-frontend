import SortDropdown from '@/components/common/dropdown/SortDropdown';
import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import { SortOption, type DropdownItem } from '@/types/dropdown';
import type { PlaceData } from '@/types/plannerType';
import React, { useMemo, useState } from 'react';

const Places: React.FC = () => {
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
      label: '날짜 내림차순',
      onClick: () => setSortOption(SortOption.DATE_DESC),
    },
    {
      value: SortOption.DATE_ASC,
      label: '날짜 오름차순',
      onClick: () => setSortOption(SortOption.DATE_ASC),
    },
    {
      value: SortOption.NAME_ASC,
      label: '이름 오름차순',
      onClick: () => setSortOption(SortOption.NAME_ASC),
    },
    {
      value: SortOption.NAME_DESC,
      label: '이름 내림차순',
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
    <div className='mx-auto max-w-screen-2xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>즐겨찾는 장소</h1>

      <div className='mb-6 flex gap-4'>
        <div className='flex-1'>
          <SearchBar
            placeholder='지역명을 검색해보세요 (예: 서울, 제주도)'
            onSearch={handleSearch}
          />
        </div>
        <SortDropdown options={sortOptions} current={sortOption} />
      </div>

      {searchValue && (
        <div className='mb-4 text-sm text-gray-600'>
          "{searchValue}"에 대한 검색 결과: {filteredAndSortedData.length}개
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
              <p className='text-gray-500'>아직 즐겨찾기한 장소가 없습니다.</p>
              <p className='mt-2 text-sm text-gray-400'>
                여행지를 탐색하고 즐겨찾기에 추가해보세요.
              </p>
            </>
          )}
        </div>
      )}

      <div className='mt-12 text-right text-sm text-gray-400'>
        총 {filteredAndSortedData.length}개의 즐겨찾기 장소
      </div>
    </div>
  );
};

export default Places;
