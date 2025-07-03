import SearchBar from '@/components/common/searchBar/SearchBar';
import InfoCard from '@/components/domain/regions/InfoCard';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// 기존 Dropdown 컴포넌트의 타입이 export되지 않은 경우를 위한 타입 정의
type DropdownItem = {
  value: string;
  label: string;
  onClick?: () => void;
  href?: string;
};

type PlaceData = {
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

const Places: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('dateDesc');
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 샘플 데이터
  const [favoriteData, setFavoriteData] = useState<PlaceData[]>([
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
    {
      id: 3,
      type: '전망대',
      title: 'N서울타워',
      description: '남산 타워에서 바라보는 전망대, 서울 야경을 한눈에',
      details: '서울특별시 용산구 남산공원길 105',
      location: '서울 중구',
      imageUrl: null,
      isFavorite: true,
      createdAt: '2025-06-27',
    },
    {
      id: 4,
      type: '궁궐',
      title: '경복궁역 5번 출구',
      description: '약속 장소 부근 아름다운 궁궐',
      details: '서울 종로구 사직로 161 경복궁 안뜰',
      location: '서울 종로구',
      imageUrl: null,
      isFavorite: true,
      createdAt: '2025-06-28',
    },
    {
      id: 5,
      type: '한옥마을',
      title: '북촌 8경',
      description: '한국 관광 명소 중 필수 코스',
      details: '서울특별시 종로구 계동길',
      location: '서울 종로구',
      imageUrl: null,
      isFavorite: true,
      createdAt: '2025-06-29',
    },
    {
      id: 6,
      type: '교통',
      title: '남산케이블카',
      description: '남산 타워로 가는 케이블카',
      details: '서울특별시 중구 소파로 83',
      location: '서울 중구',
      imageUrl: null,
      isFavorite: true,
      createdAt: '2025-06-30',
    },
  ]);

  // 정렬 옵션 정의
  const sortOptions: DropdownItem[] = [
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
  ];

  // 검색 및 정렬된 데이터
  const filteredAndSortedData = useMemo(() => {
    // 즐겨찾기된 장소만 필터링
    let filtered = favoriteData.filter((place) => place.isFavorite);

    // 검색 필터링
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        (place) =>
          place.title.toLowerCase().includes(searchLower) ||
          place.location.toLowerCase().includes(searchLower) ||
          place.type.toLowerCase().includes(searchLower) ||
          place.description.toLowerCase().includes(searchLower)
      );
    }

    // 정렬
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

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSortToggle = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const handleSortClose = () => {
    setShowSortDropdown(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSortDropdown]);

  const handleCardClick = (id: number) => {
    setSelectedPlaceId(selectedPlaceId === id ? null : id);
  };

  const handleAddSchedule = (id: number) => {
    const place = favoriteData.find((p) => p.id === id);
    console.log('일정 추가:', place?.title);
    alert(`"${place?.title}"이(가) 일정에 추가되었습니다.`);
  };

  const handleViewDetails = (id: number) => {
    const place = favoriteData.find((p) => p.id === id);
    console.log('상세보기:', place?.title);
    alert(`"${place?.title}" 상세 정보를 확인합니다.`);
  };

  const handleFavorite = (id: number) => {
    setFavoriteData((prev) =>
      prev.map((place) =>
        place.id === id ? { ...place, isFavorite: !place.isFavorite } : place
      )
    );
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'dateDesc':
        return '날짜 내림차순';
      case 'dateAsc':
        return '날짜 오름차순';
      case 'nameAsc':
        return '이름 오름차순';
      case 'nameDesc':
        return '이름 내림차순';
      default:
        return '정렬';
    }
  };
  return (
    <div className='mx-auto max-w-screen-2xl px-4 py-8'>
      <h1 className='mb-6 text-2xl font-semibold'>즐겨찾는 장소</h1>

      {/* 검색바와 정렬 */}
      <div className='mb-6 flex gap-4'>
        <div className='flex-1'>
          <SearchBar
            placeholder='지역명을 검색해보세요 (예: 서울, 제주도)'
            onSearch={handleSearch}
          />
        </div>
        <div ref={dropdownRef} className='relative'>
          <button
            onClick={handleSortToggle}
            className={`flex h-14 w-32 items-center justify-center gap-4 rounded-4xl border px-4 py-2 text-sm font-light transition-colors ${
              showSortDropdown
                ? 'border-[#FF6B7A] bg-[#FF6B7A] text-white'
                : 'border-[#FF6B7A] bg-[#FF6B7A] text-white hover:bg-[#ff5a6b]'
            }`}
          >
            <span>정렬</span>
            <svg
              className={`ml-2 h-4 w-4 transition-transform ${
                showSortDropdown ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
          {/* 직접 만든 드롭다운 */}
          {showSortDropdown && (
            <div className='absolute top-full right-0 z-50 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg'>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={option.onClick}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                    sortOption === option.value
                      ? 'bg-[#FF6B7A] font-medium text-white'
                      : 'text-gray-700'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span>{option.label}</span>
                    {sortOption === option.value && (
                      <svg
                        className='h-4 w-4 text-white'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 검색 결과 정보 */}
      {searchValue && (
        <div className='mb-4 text-sm text-gray-600'>
          "{searchValue}"에 대한 검색 결과: {filteredAndSortedData.length}개
        </div>
      )}

      {/* 즐겨찾는 장소 목록 */}
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

      {/* 빈 상태 (즐겨찾기가 없을 때) */}
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
                여행지를 탐색하고 마음에 드는 장소를 즐겨찾기에 추가해보세요.
              </p>
            </>
          )}
        </div>
      )}

      {/* 하단 정보 */}
      <div className='mt-12 space-y-2 text-right'>
        <p className='text-sm text-gray-400'>
          총 {filteredAndSortedData.length}개의 즐겨찾기 장소
        </p>
      </div>
    </div>
  );
};

export default Places;
