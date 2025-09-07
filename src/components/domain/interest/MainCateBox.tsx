import { twMerge } from 'tailwind-merge';
import SelectButton from '@/components/domain/interest/selectButton/SelectButton';
import type { Category } from '@/api/category/categoryType';

type MainCateBoxProps = {
  selectedId: number | undefined;
  mainData: Category[];
  handleClickMainCate: (id: number) => void;
  className?: string;
};

const MainCateBox = ({
  selectedId,
  mainData,
  handleClickMainCate,
  className,
}: MainCateBoxProps) => {
  return (
    <div
      className={twMerge(
        'mb-2 flex flex-row justify-between text-sm',
        className
      )}
    >
      {mainData.map((item) => (
        <SelectButton
          key={item.id}
          selected={item.id === selectedId}
          onClick={() => handleClickMainCate(item.id)}
        >
          # {item.name}
        </SelectButton>
      ))}
    </div>
  );
};

export default MainCateBox;
