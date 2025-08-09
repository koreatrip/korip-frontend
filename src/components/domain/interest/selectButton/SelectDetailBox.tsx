import type { Subcategory } from '@/api/category/categoryType';
import { Dispatch, SetStateAction } from 'react';
import SelectButton from './SelectButton';

type SelectDetailBoxProps = {
  subCateData: Subcategory[];
  subSelectedId: number[];
  setSubSelectedId: Dispatch<SetStateAction<number[]>>;
};

const SelectDetailBox = ({
  subCateData,
  subSelectedId,
  setSubSelectedId,
}: SelectDetailBoxProps) => {
  if (!subCateData || subCateData.length === 0) {
    return null;
  }

  return (
    <div className='border-outline-gray shadow-light bg-bg-white min-h-24 rounded-lg border p-2'>
      <div className='flex flex-wrap gap-2'>
        {subCateData.map((item) => {
          return (
            <SelectButton
              key={item.id}
              type='button'
              onClick={() => {
                setSubSelectedId((prevIds) => {
                  // 이미 선택된 ID라면 배열에서 제거
                  if (prevIds.includes(item.id)) {
                    return prevIds.filter((id) => id !== item.id);
                  }
                  // 선택되지 않은 ID라면 배열에 추가
                  else {
                    return [...prevIds, item.id];
                  }
                });
              }}
              className='text-sm'
              selected={subSelectedId.includes(item.id)}
            >
              # {item.name}
            </SelectButton>
          );
        })}
      </div>
    </div>
  );
};

export default SelectDetailBox;
