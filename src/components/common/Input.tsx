import React, { forwardRef, useRef } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  onClear?: () => void;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onClear, ...props }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // ref prop이 있으면 그걸 사용하고, 없으면 내부 ref 사용
    const inputRef = ref || internalRef;

    const handleClear = () => {
      if ('current' in inputRef && inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }

      // 제어 컴포넌트인 경우 onChange 콜백 호출
      if (props.onChange) {
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }

      onClear?.();
    };

    // 클리어 버튼을 보여줄 조건: 입력값이 있을 때
    const currentValue = props.value || props.defaultValue || '';
    const shouldShowClearButton =
      currentValue && String(currentValue).length > 0;

    return (
      <div className='relative w-full'>
        <input
          ref={inputRef}
          className='ring-outline-gray bg-bg-white placeholder:text-sub-text-gray focus:ring-main-pink shadow-light w-full rounded-lg border-0 px-4 py-4 ring-1 outline-none ring-inset focus:ring-2 focus:ring-inset'
          {...props}
        />

        {/* 클리어 버튼 */}
        {shouldShowClearButton && (
          <button
            type='button'
            onClick={handleClear}
            className='text-outline-gray absolute top-1/2 right-3 -translate-y-1/2 transition-colors duration-200'
            tabIndex={-1}
          >
            <XCircleIcon className='h-6 w-6' />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
