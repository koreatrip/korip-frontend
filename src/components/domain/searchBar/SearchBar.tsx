import {
  useRegionDetailQuery,
  useRegionsQuery,
} from '@/api/regions/regionsHooks';
import { useToast } from '@/hooks/useToast';
import {
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';

type TSearchBarProps = {
  placeholder?: string;
  className?: string;
  height?: string;
  showLocationIcon?: boolean;
  onSearch?: (value: string) => void;
  disableNavigation?: boolean;
  onRegionSelect?: (
    region: { id: number; name: string },
    subregion?: { id: number; name: string }
  ) => void;
};

const SearchBar = ({
  placeholder = '지역명을 검색해보세요 (예: 서울, 강남구, 대전 서구)',
  className = '',
  height = 'h-14',
  showLocationIcon = true,
  onSearch,
  disableNavigation = false,
  onRegionSelect,
}: TSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [currentView, setCurrentView] = useState<'city' | 'district'>('city');
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language || 'ko';

  // 시/도 목록 조회
  const {
    data: regionsResponse,
    isLoading: isRegionsLoading,
    error: regionsError,
    refetch: refetchRegions,
  } = useRegionsQuery(currentLanguage);

  // 선택된 시/도의 구/군 목록 조회
  const {
    data: regionDetail,
    isLoading: isRegionDetailLoading,
    error: regionDetailError,
    refetch: refetchRegionDetail,
  } = useRegionDetailQuery(selectedRegion?.id || null, currentLanguage);

  const regions = regionsResponse?.regions || [];
  const subregions = regionDetail?.regions?.subregions?.regions || [];

  // 에러 메시지 파싱 함수
  const getErrorMessage = (error: any) => {
    if (!error) return '';

    // HTTP 상태 코드별 메시지
    if (error.status || error.response?.status) {
      const status = error.status || error.response?.status;
      switch (status) {
        case 500:
        case 502:
        case 503:
        case 504:
          return '서버에 일시적인 문제가 발생했습니다.';
        case 404:
          return '요청한 정보를 찾을 수 없습니다.';
        case 403:
          return '접근 권한이 없습니다.';
        case 429:
          return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
        default:
          return '데이터를 불러오는 중 오류가 발생했습니다.';
      }
    }

    // 네트워크 에러
    if (
      error.message?.includes('Network Error') ||
      error.code === 'NETWORK_ERROR'
    ) {
      return '네트워크 연결을 확인해주세요.';
    }

    // 기본 에러 메시지
    return '일시적인 오류가 발생했습니다.';
  };

  // 드롭다운 외부 클릭 시 닫기 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;
    if (disableNavigation && onSearch) {
      onSearch(searchTerm);
      setIsDropdownOpen(false);
      return;
    }
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        q: searchTerm,
        lang: currentLanguage,
      });

      navigate(`/explore/regions?${params.toString()}`);
      showToast('');
    } catch (error) {
      console.error('페이지 이동 실패:', error);
      showToast('페이지 이동 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
    setCurrentView('city');
    setSelectedRegion(null);
  };

  const handleCitySelect = (region: { id: number; name: string }) => {
    setSelectedRegion(region);
    setCurrentView('district');
  };

  const handleDistrictSelect = (district: { id: number; name: string }) => {
    if (!selectedRegion) return;

    const locationQuery = `${selectedRegion.name} ${district.name}`;
    setSearchQuery(locationQuery);

    if (disableNavigation && onRegionSelect) {
      onRegionSelect(selectedRegion, district);
      setIsDropdownOpen(false);
      return;
    }

    const params = new URLSearchParams({
      region_id: selectedRegion.id.toString(),
      subregion_id: district.id.toString(),
      lang: currentLanguage,
    });

    if (location.pathname === '/') {
      navigate(`/explore/regions?${params.toString()}`);
    } else {
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('region_id', selectedRegion.id.toString());
      currentParams.set('subregion_id', district.id.toString());
      currentParams.set('lang', currentLanguage);

      navigate(`${location.pathname}?${currentParams.toString()}`);
    }

    setIsDropdownOpen(false);
  };

  const handleBackToCity = () => {
    setCurrentView('city');
    setSelectedRegion(null);
  };

  const handleCityAll = (region: { id: number; name: string }) => {
    setSearchQuery(region.name);

    if (disableNavigation && onRegionSelect) {
      onRegionSelect(region);
      setIsDropdownOpen(false);
      return;
    }

    const params = new URLSearchParams({
      region_id: region.id.toString(),
      lang: currentLanguage,
    });

    if (location.pathname === '/explore/attractions') {
      navigate(`/explore/districts?${params.toString()}`);
    } else if (location.pathname === '/') {
      navigate(`/explore/regions?${params.toString()}`);
    } else {
      const currentParams = new URLSearchParams(location.search);
      currentParams.set('region_id', region.id.toString());
      currentParams.delete('subregion_id');
      currentParams.set('lang', currentLanguage);

      navigate(`${location.pathname}?${currentParams.toString()}`);
    }

    setIsDropdownOpen(false);
  };

  // 에러 상태 컴포넌트
  const ErrorState = ({
    error,
    onRetry,
    message,
  }: {
    error: any;
    onRetry: () => void;
    message?: string;
  }) => (
    <div className='flex flex-col items-center justify-center px-4 py-8'>
      <ExclamationCircleIcon className='text-main-hover-pink mb-3 h-12 w-12' />
      <p className='text-error-red mb-2 text-center text-sm font-medium'>
        {message || getErrorMessage(error)}
      </p>
      <button
        onClick={onRetry}
        className='text-error-red flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm transition-colors hover:bg-red-100'
      >
        <ArrowPathIcon className='h-4 w-4' />
        다시 시도
      </button>
    </div>
  );

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
        {showLocationIcon && (
          <div className='flex items-center justify-center pr-3 pl-6'>
            <MapPinIcon className='text-main-pink h-6 w-6' />
          </div>
        )}
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

      {isDropdownOpen && (
        <div className='border-outline-gray shadow-medium bg-bg-white absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border'>
          <div className='p-4'>
            {currentView === 'city' ? (
              <>
                {isRegionsLoading ? (
                  <div className='flex items-center justify-center py-8'>
                    <div className='border-outline-gray h-6 w-6 animate-spin rounded-full border-2 border-t-gray-600'></div>
                    <span className='ml-2 text-sm text-gray-500'>
                      지역 정보를 불러오는 중...
                    </span>
                  </div>
                ) : regionsError ? (
                  <ErrorState
                    error={regionsError}
                    onRetry={refetchRegions}
                    message='지역 목록을 불러올 수 없습니다.'
                  />
                ) : (
                  <div className='grid max-h-80 grid-cols-2 gap-2 overflow-y-auto'>
                    {regions.length > 0 ? (
                      regions.map((region) => (
                        <button
                          key={region.id}
                          onClick={() =>
                            handleCitySelect({
                              id: region.id,
                              name: region.name,
                            })
                          }
                          className='hover:bg-hover-gray flex items-center justify-between rounded-lg px-4 py-3 transition-colors duration-150'
                        >
                          <span className='text-left font-medium'>
                            {region.name}
                          </span>
                          <ChevronRightIcon className='h-4 w-4 text-gray-400' />
                        </button>
                      ))
                    ) : (
                      <div className='col-span-2 py-4 text-center text-gray-500'>
                        지역 정보가 없습니다.
                      </div>
                    )}
                  </div>
                )}
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
                    {selectedRegion?.name}
                  </span>
                </div>

                <div className='space-y-1'>
                  <div className='mb-3 flex items-center'>
                    <input
                      type='checkbox'
                      id='city-all'
                      className='mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                      onChange={(e) => {
                        if (e.target.checked && selectedRegion) {
                          handleCityAll(selectedRegion);
                        }
                      }}
                    />
                    <label
                      htmlFor='city-all'
                      className='text-sub-text-gray text-sm font-medium'
                    >
                      {selectedRegion?.name} 전체
                    </label>
                  </div>

                  {isRegionDetailLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600'></div>
                      <span className='ml-2 text-sm text-gray-500'>
                        구/군 정보를 불러오는 중...
                      </span>
                    </div>
                  ) : regionDetailError ? (
                    <ErrorState
                      error={regionDetailError}
                      onRetry={refetchRegionDetail}
                      message='구/군 정보를 불러올 수 없습니다.'
                    />
                  ) : (
                    <div className='grid max-h-60 grid-cols-3 gap-2 overflow-y-auto'>
                      {subregions.length > 0 ? (
                        subregions.map((subregion) => (
                          <button
                            key={subregion.id}
                            onClick={() =>
                              handleDistrictSelect({
                                id: subregion.id,
                                name: subregion.name,
                              })
                            }
                            className='text-main-text-navy hover:bg-hover-gray flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors duration-150'
                          >
                            <span className='text-sm'>{subregion.name}</span>
                          </button>
                        ))
                      ) : (
                        <div className='col-span-3 py-4 text-center text-gray-500'>
                          하위 지역이 없습니다.
                        </div>
                      )}
                    </div>
                  )}
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
