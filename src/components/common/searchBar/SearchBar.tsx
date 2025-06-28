import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';

type TSearchBarProps = {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  suggestions?: string[];
  height?: string;
  showLocationIcon?: boolean;
};

const SearchBar = ({
  placeholder = '지역명을 검색해보세요 (예: 서울, 제주도)',
  onSearch,
  className = '',
  suggestions = ['서울', '부산', '제주도', '경주', '전주'],
  height = 'h-14',
  showLocationIcon = true,
}: TSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = useMemo(() => {
    if (searchQuery.trim()) {
      return suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return suggestions;
  }, [searchQuery, suggestions]);

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

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
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
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
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
          className='flex items-center justify-center p-4 transition-colors duration-200 hover:bg-gray-50'
          aria-label='검색'
        >
          <MagnifyingGlassIcon className='text-outline-gray h-6 w-6' />
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {isDropdownOpen && (
        <div className='border-outline-gray shadow-medium absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-2xl border bg-white'>
          <div className='p-4'>
            <h3 className='text-sub-text-gray mb-3 text-sm font-medium'>
              추천 검색어
            </h3>
            <div className='space-y-0'>
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className='text-main-text-navy hover:bg-hover-gray w-full rounded-lg px-2 py-3 text-left transition-colors duration-150'
                >
                  {suggestion}
                </button>
              ))}
              {filteredSuggestions.length === 0 && (
                <div className='text-sub-text-gray px-2 py-3 text-center'>
                  검색 결과가 없습니다
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
