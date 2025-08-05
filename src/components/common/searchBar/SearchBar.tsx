import { locationData } from '@/data/locations';
import { useToast } from '@/hooks/useToast';
import { useLocationStore } from '@/stores/useLocationStore';
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type TSearchBarProps = {
  placeholder?: string;
  className?: string;
  height?: string;
  showLocationIcon?: boolean;
  onSearch: (value: string) => void;
};

const SearchBar = ({
  placeholder = '지역명을 검색해보세요 (예: 서울, 강남구, 대전 서구)',
  className = '',
  height = 'h-14',
  showLocationIcon = true,
}: TSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'city' | 'district'>('city');
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // 실제 프로젝트에서는 이 부분을 주석 해제하고 사용
  const { searchAndSetLocation } = useLocationStore();
  const { showToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setCurrentView('city');
        setSelectedCity(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      setIsLoading(true);
      try {
        // 실제 프로젝트에서는 아래 주석을 해제하고 사용
        await searchAndSetLocation(searchTerm.trim(), showToast);
        console.log('검색:', searchTerm.trim());
      } catch (error) {
        console.error('검색 실패:', error);
        // showToast('검색 중 오류가 발생했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    setIsDropdownOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    setCurrentView('city');
    setSelectedCity(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCurrentView('district');
  };

  const handleDistrictSelect = (district: string) => {
    const locationQuery = `${selectedCity} ${district}`;
    setSearchQuery(locationQuery);
    handleSearch(locationQuery);
    setIsDropdownOpen(false);
    setCurrentView('city');
    setSelectedCity(null);
  };

  const handleBackToCity = () => {
    setCurrentView('city');
    setSelectedCity(null);
  };

  const handleCityAll = (city: string) => {
    setSearchQuery(city);
    handleSearch(city);
    setIsDropdownOpen(false);
    setCurrentView('city');
    setSelectedCity(null);
  };

  return (
    <div
      className={twMerge(`relative w-full max-w-2xl`, className)}
      ref={searchBarRef}
    >
      <div
        className={twMerge(
          'shadow-medium border-outline-gray bg-bg-white relative flex items-center overflow-hidden rounded-full border',
          height
        )}
      >
        {/* Location Icon */}
        {showLocationIcon && (
          <div className='flex items-center justify-center pr-3 pl-6'>
            <MapPinIcon className='text-main-pink h-6 w-6' />
          </div>
        )}
        {/* Search Input */}
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={twMerge(
            'placeholder-ph-gray flex-1 border-none bg-transparent py-4 text-base outline-none',
            showLocationIcon ? 'px-2' : 'px-6'
          )}
        />
        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          disabled={isLoading}
          className='flex items-center justify-center p-4 transition-colors duration-200 hover:bg-gray-50 disabled:opacity-50'
          aria-label='검색'
        >
          {isLoading ? (
            <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600'></div>
          ) : (
            <MagnifyingGlassIcon className='text-outline-gray h-6 w-6' />
          )}
        </button>
      </div>

      {/* Location Selection Dropdown */}
      {isDropdownOpen && (
        <div className='border-outline-gray shadow-medium absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border bg-white'>
          <div className='p-4'>
            {currentView === 'city' ? (
              <>
                {/* <div className='mb-4'>
                  <input
                    type='text'
                    placeholder='지역명 입력'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='text-sub-text-gray w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div> */}

                <div className='grid max-h-80 grid-cols-2 gap-2 overflow-y-auto'>
                  {Object.entries(locationData).map(([city, data]) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={twMerge(
                        'hover:bg-hover-gray flex items-center justify-between rounded-lg px-4 py-3 transition-colors duration-150',
                        city === '서울' ? '' : ''
                      )}
                    >
                      <span className='font-medium'>{city}</span>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sub-text-gray text-sm'>
                          ({data.total.toLocaleString()})
                        </span>
                        <ChevronRightIcon className='h-4 w-4 text-gray-400' />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className='mb-4 flex items-center'>
                  <button
                    onClick={handleBackToCity}
                    className='text-main-pink hover:text-main-hover-pink text-sm font-medium'
                  >
                    ← 지역 선택
                  </button>
                  <span className='text-sub-text-gray ml-2'>|</span>
                  <span className='text-main-text-navy ml-2 font-medium'>
                    {selectedCity}
                  </span>
                </div>

                <div className='space-y-1'>
                  <div className='mb-3 flex items-center'>
                    <input
                      type='checkbox'
                      id='city-all'
                      className='mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                      onChange={(e) => {
                        if (e.target.checked && selectedCity) {
                          handleCityAll(selectedCity);
                        }
                      }}
                    />
                    <label
                      htmlFor='city-all'
                      className='text-sub-text-gray text-sm font-medium'
                    >
                      {selectedCity}전체
                    </label>
                  </div>

                  <div className='grid max-h-60 grid-cols-3 gap-2 overflow-y-auto'>
                    {selectedCity &&
                      locationData[
                        selectedCity as keyof typeof locationData
                      ]?.districts.map((district) => (
                        <button
                          key={district.name}
                          onClick={() => handleDistrictSelect(district.name)}
                          className='text-main-text-navy hover:bg-hover-gray flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-150'
                        >
                          <span className='text-sm'>{district.name}</span>
                          <span className='text-sub-text-gray text-xs'>
                            ({district.count.toLocaleString()})
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
