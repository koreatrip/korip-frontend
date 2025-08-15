import { CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const AgreementCheckbox = ({
  id,
  type,
  checked,
  onChange,
  onLinkClick,
  required = true, // 필수 여부를 props로 받기
}) => {
  const { t } = useTranslation();

  return (
    <div className='flex items-start space-x-2 py-2'>
      {/* 체크박스 */}
      <div className='relative mt-0.5 flex-shrink-0'>
        <input
          type='checkbox'
          id={id}
          checked={checked}
          onChange={onChange}
          className='sr-only'
        />
        <label
          htmlFor={id}
          className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border-2 transition-all duration-200 ease-in-out ${
            checked
              ? 'bg-main-pink border-main-pink'
              : 'border-outline-gray hover:border-main-pink bg-white'
          } `}
        >
          {checked && <CheckIcon className='h-3 w-3 stroke-2 text-white' />}
        </label>
      </div>

      {/* 라벨 */}
      <div className='text-main-text-navy flex cursor-pointer items-center text-sm'>
        {required && <span className='text-main-pink mr-1'>*</span>}{' '}
        {/* 필수일 때만 표시 */}
        <button
          type='button'
          onClick={onLinkClick}
          className='text-main-text-navy hover:text-main-pink focus:ring-main-pink rounded underline transition-colors duration-200 focus:ring-2 focus:ring-offset-1 focus:outline-none'
        >
          {t(`agreement.${type}`)}
        </button>
      </div>
    </div>
  );
};

export default AgreementCheckbox;
