import { twMerge } from 'tailwind-merge';
import SelectButton from '@/components/domain/interest/selectButton/SelectButton';
import type { Category } from '@/api/category/categoryType';

type SelectButtonGroupProps = {
  selectedId: number | undefined;
  mainCateData: Category[];

  handleClickSubCate: (id: number) => void;
  className?: string;
};

const SelectButtonGroup = ({
  selectedId,
  mainCateData,
  handleClickSubCate,

  className,
}: SelectButtonGroupProps) => {
  const handleButtonClick = (id: number) => {
    handleClickSubCate(id);
  };

  return (
    <div
      className={twMerge(
        'mb-2 flex flex-row justify-between text-sm',
        className
      )}
    >
      {mainCateData.map((item) => (
        <SelectButton
          key={item.id}
          selected={item.id === selectedId}
          onClick={() => handleButtonClick(item.id)}
        >
          # {item.name}
        </SelectButton>
      ))}
    </div>
  );
};

export default SelectButtonGroup;
