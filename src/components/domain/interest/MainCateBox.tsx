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
}: MainCateBoxProps) => {
  return (
    <div className='mb-2 flex flex-row flex-wrap justify-between gap-y-2 text-sm'>
      {mainData.map((item) => (
        <SelectButton
          key={item.id}
          selected={item.id === selectedId}
          onClick={() => handleClickMainCate(item.id)}
          className='text-md rounded-all h-8'
        >
          # {item.name}
        </SelectButton>
      ))}
    </div>
  );
};

export default MainCateBox;
