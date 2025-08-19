import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MapPinIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type SearchInputProps = {
  placeholder?: string;
  className?: string;
  height?: string;
  showLocationIcon?: boolean;
  onSearch: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
};

const SearchInput = ({
  placeholder = '지역명을 검색해보세요 (예: 서울, 강남구, 대전 서구)',
  className = '',
  height = 'h-14',
  showLocationIcon = true,
  onSearch,
  value: externalValue,
  onChange: externalOnChange,
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // controlled vs uncontrolled 처리
  const searchValue =
    externalValue !== undefined ? externalValue : internalValue;
  const handleValueChange = externalOnChange || setInternalValue;

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    try {
      await onSearch(searchValue.trim());
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleValueChange(e.target.value);
  };

  return (
    <div className={twMerge(`relative w-full max-w-2xl`, className)}>
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
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={twMerge(
            'placeholder-ph-gray flex-1 border-none bg-transparent py-4 text-base outline-none',
            showLocationIcon ? 'px-2' : 'px-6'
          )}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchValue.trim()}
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
    </div>
  );
};

export default SearchInput;
