import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';
import { useLocationStore } from '@/stores/useLocationStore';
import { useToast } from '@/hooks/useToast';

type TSearchBarProps = {
  placeholder?: string;
  className?: string;
  height?: string;
  showLocationIcon?: boolean;
};

const SearchBar = ({
  placeholder = '지역명을 검색해보세요 (예: 서울, 강남구, 대전 서구)',
  className = '',
  height = 'h-14',
  showLocationIcon = true,
}: TSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const { searchAndSetLocation, getSuggestions } = useLocationStore();
  const { showToast } = useToast();

  // 디바운스된 추천 검색어 업데이트
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (isDropdownOpen) {
        setIsLoading(true);
        try {
          const newSuggestions = await getSuggestions(searchQuery);
          setSuggestions(newSuggestions);
        } catch (error) {
          console.error('추천 검색어 로딩 실패:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, isDropdownOpen, getSuggestions]);

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
    if (searchTerm.trim()) {
      setIsLoading(true);
      try {
        await searchAndSetLocation(searchTerm.trim(), showToast);
      } catch (error) {
        console.error('검색 실패:', error);
        showToast('검색 중 오류가 발생했습니다.', 'error');
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

  const handleInputFocus = async () => {
    setIsDropdownOpen(true);
    if (suggestions.length === 0) {
      setIsLoading(true);
      try {
        const initialSuggestions = await getSuggestions(searchQuery);
        setSuggestions(initialSuggestions);
      } catch (error) {
        console.error('초기 추천 검색어 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className='bg-yellow-200 font-medium'>
          {part}
        </span>
      ) : (
        part
      )
    );
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

      {/* Dropdown Suggestions */}
      {isDropdownOpen && (
        <div className='border-outline-gray shadow-medium absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border bg-white'>
          <div className='p-4'>
            <h3 className='text-sub-text-gray mb-3 text-sm font-medium'>
              {searchQuery.trim() ? '검색 결과' : '추천 검색어'}
            </h3>
            <div className='space-y-0'>
              {isLoading ? (
                <div className='text-sub-text-gray px-2 py-3 text-center'>
                  <div className='mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600'></div>
                  검색 중...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className='text-main-text-navy hover:bg-hover-gray w-full rounded-lg px-2 py-3 text-left transition-colors duration-150'
                  >
                    {highlightMatch(suggestion, searchQuery)}
                  </button>
                ))
              ) : (
                <div className='text-sub-text-gray px-2 py-3 text-center'>
                  {searchQuery.trim()
                    ? '검색 결과가 없습니다'
                    : '추천 검색어를 불러오는 중입니다...'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
