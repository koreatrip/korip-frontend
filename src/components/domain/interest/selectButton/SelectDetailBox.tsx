import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectDetailBoxProps {
  details: string[];
  selectedDetails: string[];
  setSelectedDetailInterests: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
}

const SelectDetailBox = ({
  details,
  selectedDetails,
  setSelectedDetailInterests,
  className,
}: SelectDetailBoxProps) => {
  if (!details || details.length === 0) {
    return null;
  }

  const handleSelect = (detail: string) => {
    setSelectedDetailInterests((prev) => {
      if (prev.includes(detail)) {
        // 이미 선택된 항목이면 제거
        return prev.filter((d) => d !== detail);
      }
      // 새 항목을 추가하기 전에 개수 확인
      if (prev.length >= 9) {
        alert('최대 9개까지 선택할 수 있습니다.');
        return prev; // 9개 이상이면 상태 변경 없음
      }
      // 9개 미만이면 새 항목 추가
      return [...prev, detail];
    });
  };

  return (
    <div
      className={twMerge(
        'p-2 border min-h-24 border-outline-gray shadow-light rounded-md bg-bg-white',
        className
      )}
    >
      <div className='flex flex-wrap gap-1'>
        {details.map((item, index) => {
          const isSelected = selectedDetails.includes(item);
          return (
            <button
              key={`${item}-${index}`}
              type='button'
              onClick={() => handleSelect(item)}
              className={twMerge(
                'text-sm hover:cursor-pointer py-1 px-4 rounded-2xl transition-colors duration-300 border border-outline-gray',
                isSelected
                  ? 'bg-main-pink text-white font-semibold'
                  : 'bg-bg-white text-gray-800 hover:bg-gray-100'
              )}
            >
              # {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectDetailBox;
