import { type DropdownItem, SortOption } from '@/types/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SortDropdownProps = {
  options: DropdownItem[];
  current: SortOption;
};

const SortDropdown: React.FC<SortDropdownProps> = ({ options, current }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className='relative'>
      <button
        onClick={handleToggle}
        className={`text-md flex h-14 w-32 items-center justify-center gap-2 rounded-4xl border bg-[#FF6B7A] px-4 py-2 font-light text-white transition-colors ${
          isOpen ? '' : 'hover:bg-[#ff5a6b]'
        }`}
      >
        <span>{t('common.sort')}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

      {isOpen && (
        <div className='border-outline-gray bg-bg-white absolute top-full right-0 z-50 mt-1 w-auto rounded-lg border py-1 shadow-lg'>
          {options.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                item.onClick();
                handleClose();
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                current === item.value
                  ? 'bg-gray-100 font-medium text-gray-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className='flex items-center justify-between'>
                <span>{item.label}</span>
                {current === item.value && (
                  <svg
                    className='h-4 w-4 text-gray-700'
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
  );
};

export default SortDropdown;
