import React, { type ReactNode, forwardRef, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { XCircleIcon } from '@heroicons/react/24/outline';

type TInputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> & {
  type: 'text' | 'password' | 'email' | 'number' | 'date';
  children?: ReactNode;
  label?: string;
  onClear?: () => void; // 클리어 버튼 클릭 시 호출될 함수
};

const AuthInput = forwardRef<HTMLInputElement, TInputProps>(
  ({ label, children, className, onBlur, onClear, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(
      rest.value || rest.defaultValue || ''
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleContainerClick = () => {
      inputRef.current?.focus();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!containerRef.current?.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
        onBlur?.(e);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      rest.onChange?.(e);
    };

    const handleClear = () => {
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }
      onClear?.();
    };

    // 클리어 버튼을 보여줄 조건: 입력값이 있을 때
    const shouldShowClearButton = inputValue && String(inputValue).length > 0;

    return (
      <div className='flex w-full flex-col items-start'>
        {label && (
          <label
            className='text-main-text-navy mb-2 block font-medium'
            htmlFor={rest.id}
          >
            {label}
          </label>
        )}
        <div
          ref={containerRef}
          className={twMerge(
            'bg-bg-white flex w-full items-center rounded-lg border px-4 py-3 transition-all duration-200',
            isFocused
              ? 'border-main-pink shadow-light'
              : 'shadow-light border-outline-gray hover:border-hover-gray'
          )}
          onClick={handleContainerClick}
          tabIndex={0}
        >
          <input
            ref={inputRef}
            className={twMerge(
              'placeholder:text-ph-gray text-main-text-navy flex-1 border-0 bg-transparent outline-none',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onChange={handleInputChange}
            {...rest}
          />

          {/* 클리어 버튼 */}
          {shouldShowClearButton && (
            <button
              type='button'
              onClick={handleClear}
              className='text-sub-text-gray hover:text-main-text-navy ml-2 transition-colors duration-200'
              tabIndex={-1} // 탭 순서에서 제외
            >
              <XCircleIcon className='stroke-outline-gray h-6 w-6' />
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
