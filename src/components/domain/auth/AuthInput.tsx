import React, {
  type ReactNode,
  forwardRef,
  useRef,
  useState,
  useEffect,
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
    const [inputValue, setInputValue] = useState(
      value !== undefined
        ? value
        : rest.defaultValue !== undefined
          ? rest.defaultValue
          : ''
    );

    const internalInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const setRefs = useCallback(
      (instance: HTMLInputElement | null) => {
        // internalInputRef 업데이트
        internalInputRef.current = instance;

        // forwardRef로 받은 ref도 업데이트
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            instance;
        }
      },
      [ref]
    );

    useEffect(() => {
      if (value !== undefined) {
        setInputValue(value);
      }
    }, [value]);

    // [핵심 수정 부분] current 속성 접근 시 internalInputRef 사용
    const handleContainerClick = () => {
      if (internalInputRef.current) {
        // mergedRef 대신 internalInputRef 사용
        internalInputRef.current.focus();
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!containerRef.current?.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
        onBlur?.(e);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInputValue('');
      if (internalInputRef.current) {
        // mergedRef 대신 internalInputRef 사용
        internalInputRef.current.value = '';
        internalInputRef.current.focus();
      }
      if (onClear && rest.name) {
        onClear(rest.name, '');
      } else if (onChange && rest.name) {
        const syntheticEvent = {
          target: { name: rest.name, value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const shouldShowClearButton =
      inputValue !== null &&
      inputValue !== undefined &&
      String(inputValue).length > 0 &&
      onClear;

    const determinedAutoComplete =
      autoComplete ||
      (type === 'email'
        ? 'email'
        : type === 'password'
          ? 'current-password'
          : 'off');
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
          onClick={handleContainerClick}
          tabIndex={0}
        >
          <input
            ref={setRefs} // 병합된 ref 사용
            type={type}
            className={twMerge(
              'placeholder:text-ph-gray text-main-text-navy flex-1 border-0 bg-transparent outline-none'
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onChange={handleInputChange}
            value={inputValue}
            autoComplete={determinedAutoComplete}
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
