import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { XCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// 국가 코드 타입
type CountryCode = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  displayFormat?: string; // 사용자에게 보여줄 형식
  inputExample?: string; // 실제 입력 예시 (하이픈 없음)
};

// 주요 국가 코드들
const COUNTRY_CODES: CountryCode[] = [
  {
    code: 'KR',
    name: '대한민국',
    flag: '🇰🇷',
    dialCode: '+82',
    displayFormat: '010-XXXX-XXXX',
    inputExample: '01012345678',
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    displayFormat: '(XXX) XXX-XXXX',
    inputExample: '5551234567',
  },
  {
    code: 'JP',
    name: '日本',
    flag: '🇯🇵',
    dialCode: '+81',
    displayFormat: 'XXX-XXXX-XXXX',
    inputExample: '9012345678',
  },
  {
    code: 'CN',
    name: '中国',
    flag: '🇨🇳',
    dialCode: '+86',
    displayFormat: 'XXX XXXX XXXX',
    inputExample: '13812345678',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    displayFormat: 'XXXX XXX XXXX',
    inputExample: '7712345678',
  },
  {
    code: 'DE',
    name: 'Deutschland',
    flag: '🇩🇪',
    dialCode: '+49',
    displayFormat: 'XXX XXXXXXX',
    inputExample: '15712345678',
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    dialCode: '+33',
    displayFormat: 'XX XX XX XX XX',
    inputExample: '0612345678',
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    dialCode: '+91',
    displayFormat: 'XXXXX XXXXX',
    inputExample: '9876543210',
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    dialCode: '+61',
    displayFormat: 'XXX XXX XXX',
    inputExample: '412345678',
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    dialCode: '+1',
    displayFormat: '(XXX) XXX-XXXX',
    inputExample: '5551234567',
  },
];

type PhoneInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string, fullNumber: string) => void;
  onClear?: (name: string, value: string) => void;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  defaultCountry?: string; // 기본 국가 코드
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      placeholder,
      value = '',
      onChange,
      onClear,
      className,
      id,
      name = 'phoneNumber',
      disabled = false,
      defaultCountry = 'KR',
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(() => {
      // ✨ 1. 초기 렌더링 시 value를 기반으로 selectedCountry를 설정합니다.
      const initialCountry = COUNTRY_CODES.find((c) =>
        value.startsWith(c.dialCode)
      );
      return (
        initialCountry ||
        COUNTRY_CODES.find((c) => c.code === defaultCountry) ||
        COUNTRY_CODES[0]
      );
    });
    const [phoneNumber, setPhoneNumber] = useState(() => {
      // ✨ 2. 초기 렌더링 시 value를 기반으로 phoneNumber를 설정합니다.
      const initialCountry = COUNTRY_CODES.find((c) =>
        value.startsWith(c.dialCode)
      );
      return initialCountry
        ? value.substring(initialCountry.dialCode.length)
        : value;
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    // ref 병합
    useImperativeHandle(ref, () => inputRef.current!);

    const shouldShowClearButton = phoneNumber.length > 0 && !disabled;

    // 기본 플레이스홀더 설정
    const defaultPlaceholder =
      placeholder || t('auth.phone_number_placeholder');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 숫자만 남기고 하이픈, 공백, 괄호 등 제거
      const cleanValue = e.target.value.replace(/[^\d]/g, '');
      setPhoneNumber(cleanValue);

      if (onChange) {
        const fullNumber = selectedCountry.dialCode + cleanValue;
        onChange(cleanValue, fullNumber);
      }
    };

    const handleCountrySelect = (country: CountryCode) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);

      if (onChange) {
        const fullNumber = country.dialCode + phoneNumber;
        onChange(phoneNumber, fullNumber);
      }

      // 포커스를 입력 필드로 이동
      inputRef.current?.focus();
    };

    const handleClear = () => {
      setPhoneNumber('');
      if (onClear) {
        onClear(name, '');
      }
      if (onChange) {
        onChange('', selectedCountry.dialCode);
      }
      inputRef.current?.focus();
    };

    const handleBlur = (e: React.FocusEvent) => {
      // 드롭다운 내부를 클릭한 경우 포커스를 유지
      if (dropdownRef.current?.contains(e.relatedTarget as Node)) {
        return;
      }
      setIsFocused(false);
      setIsDropdownOpen(false);
    };

    const handleContainerClick = () => {
      if (!disabled) {
        inputRef.current?.focus();
      }
    };

    const toggleDropdown = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        setIsDropdownOpen(!isDropdownOpen);
      }
    };

    useEffect(() => {
      const country = COUNTRY_CODES.find((c) => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.dialCode.length));
      } else {
        // 국가 코드가 없는 번호가 들어오면 현재 선택된 국가를 기준으로 처리
        setPhoneNumber(value);
      }
    }, [value]);

    return (
      <div className='flex w-full flex-col items-start'>
        {label && (
          <label
            className='text-main-text-navy mb-2 block font-medium'
            htmlFor={id || name}
          >
            {label}
          </label>
        )}

        <div className='relative w-full'>
          <div
            ref={containerRef}
            className={twMerge(
              'bg-bg-white flex w-full items-center rounded-lg border transition-all duration-200',
              isFocused || isDropdownOpen
                ? 'border-main-pink shadow-light'
                : 'shadow-light border-outline-gray hover:border-hover-gray',
              disabled && 'cursor-not-allowed opacity-50',
              className
            )}
            onClick={handleContainerClick}
            tabIndex={0}
          >
            {/* 국가 코드 선택 버튼 */}
            <button
              type='button'
              onClick={toggleDropdown}
              className={twMerge(
                'border-outline-gray hover:bg-hover-gray flex items-center border-r px-3 py-3 transition-colors',
                disabled && 'cursor-not-allowed hover:bg-transparent'
              )}
              disabled={disabled}
              tabIndex={-1}
            >
              <span className='mr-2 text-lg'>{selectedCountry.flag}</span>
              <span className='text-main-text-navy mr-1 text-sm font-medium'>
                {selectedCountry.dialCode}
              </span>
              <ChevronDownIcon
                className={twMerge(
                  'text-sub-text-gray h-4 w-4 transition-transform',
                  isDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* 전화번호 입력 필드 */}
            <input
              ref={inputRef}
              id={id || name}
              name={name}
              type='tel'
              value={phoneNumber}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={handleBlur}
              placeholder={defaultPlaceholder}
              disabled={disabled}
              className={twMerge(
                'placeholder:text-ph-gray text-main-text-navy flex-1 border-0 bg-transparent px-4 py-3 outline-none',
                disabled && 'cursor-not-allowed'
              )}
              autoComplete='tel'
              {...rest}
            />

            {/* 클리어 버튼 */}
            {shouldShowClearButton && (
              <button
                type='button'
                onClick={handleClear}
                className='text-sub-text-gray hover:text-main-text-navy mr-3 transition-colors duration-200'
                tabIndex={-1}
              >
                <XCircleIcon className='stroke-outline-gray h-6 w-6' />
              </button>
            )}
          </div>

          {/* 국가 코드 드롭다운 */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className='border-outline-gray absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border bg-white shadow-lg'
            >
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type='button'
                  onClick={() => handleCountrySelect(country)}
                  className={twMerge(
                    'flex w-full items-center px-4 py-3 text-left transition-colors hover:bg-gray-50',
                    selectedCountry.code === country.code &&
                      'text-main-pink bg-blue-50'
                  )}
                >
                  <span className='mr-3 text-lg'>{country.flag}</span>
                  <div className='flex-1'>
                    <div className='text-sm font-medium'>{country.name}</div>
                    {country.displayFormat && (
                      <div className='text-sub-text-gray text-xs'>
                        {t('common.format')}: {country.displayFormat}
                      </div>
                    )}
                  </div>
                  <span className='text-sub-text-gray ml-2 text-sm font-medium'>
                    {country.dialCode}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 입력 예시 힌트 */}
        {selectedCountry.inputExample && phoneNumber.length === 0 && (
          <div className='text-sub-text-gray mt-1 text-xs'>
            {t('common.enter_without_hyphens')}: {selectedCountry.inputExample}
          </div>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
