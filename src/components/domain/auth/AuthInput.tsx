import React, {
  type ReactNode,
  forwardRef,
  useRef,
  useState,
  useCallback,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { XCircleIcon } from '@heroicons/react/24/outline';

type TInputProps = React.ComponentPropsWithoutRef<'input'> & {
  type: 'text' | 'password' | 'email' | 'number' | 'date';
  children?: ReactNode;
  label?: string;
  onClear?: (name: string, value: string) => void;
  autoComplete?: React.ComponentPropsWithoutRef<'input'>['autoComplete'];
};

const AuthInput = forwardRef<HTMLInputElement, TInputProps>(
  (
    {
      label,
      children,
      className,
      onBlur,
      onClear,
      onChange,
      value,
      type,
      autoComplete,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false); // X 버튼 표시용
    const internalInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Controlled vs Uncontrolled 모드 감지
    const isControlled = value !== undefined;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Uncontrolled 모드에서 값 체크
      if (!isControlled) {
        setHasValue(e.target.value.length > 0);
      }
      onChange?.(e);
    };

    const setRefs = useCallback(
      (instance: HTMLInputElement | null) => {
        internalInputRef.current = instance;
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            instance;
        }
      },
      [ref]
    );

    const handleClear = () => {
      if (internalInputRef.current) {
        internalInputRef.current.value = '';
        internalInputRef.current.focus();
        setHasValue(false);

        // Controlled 모드면 onChange 트리거
        if (isControlled && onChange && rest.name) {
          const syntheticEvent = {
            target: { name: rest.name, value: '' },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }

      onClear?.(rest.name || '', '');
    };

    // Clear 버튼 표시 여부: Controlled는 value 기준, Uncontrolled는 ref 사용
    const shouldShowClearButton = isControlled
      ? value && String(value).length > 0 && onClear
      : hasValue && onClear;

    return (
      <div className='flex w-full flex-col items-start'>
        {label && (
          <label
            className='text-main-text-navy mb-2 block font-medium'
            htmlFor={rest.id || rest.name}
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
              : 'shadow-light border-outline-gray hover:border-hover-gray',
            className
          )}
          onClick={() => internalInputRef.current?.focus()}
          tabIndex={0}
        >
          <input
            ref={setRefs}
            type={type}
            className='placeholder:text-ph-gray text-main-text-navy flex-1 border-0 bg-transparent outline-none'
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (!containerRef.current?.contains(e.relatedTarget as Node)) {
                setIsFocused(false);
                onBlur?.(e);
              }
            }}
            onChange={handleInputChange}
            value={value}
            autoComplete={
              autoComplete ||
              (type === 'email'
                ? 'email'
                : type === 'password'
                  ? 'current-password'
                  : 'off')
            }
            {...rest}
          />

          {children}

          {shouldShowClearButton && (
            <button
              type='button'
              onClick={handleClear}
              className='text-sub-text-gray hover:text-main-text-navy ml-2 transition-colors duration-200'
              tabIndex={-1}
            >
              <XCircleIcon className='stroke-outline-gray h-6 w-6' />
            </button>
          )}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
