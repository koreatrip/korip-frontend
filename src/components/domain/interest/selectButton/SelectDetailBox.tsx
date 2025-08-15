import type { Subcategory } from '@/api/category/categoryType';
import SelectButton from './SelectButton';

type SelectDetailBoxProps = {
  subCateData: Subcategory[];
  subSelected: Subcategory[];
  handleClickName: (data: Subcategory) => void;
};

const SelectDetailBox = ({
  subCateData,
  subSelected,
  handleClickName,
  subSelectedId,
  setSubSelectedId,
}: SelectDetailBoxProps) => {
  if (!subCateData || subCateData.length === 0) {
    return null;
  }

  return (
    <div className='border-outline-gray shadow-light bg-bg-white my-4 rounded-lg border p-4'>
      <div className='flex flex-wrap gap-2'>
        {subCateData.map((item) => {
          return (
            <SelectButton
              key={item.id}
              type='button'
              onClick={() => handleClickName(item)}
              className='text-sm'
              // 'some' 메소드에 콜백

              selected={subSelected.some(
                (selectedItem) => selectedItem.id === item.id
              )}
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
