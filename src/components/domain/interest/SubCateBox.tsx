import type { Subcategory } from '@/api/category/categoryType';
import { useSubcategoriesQuery } from '@/api/category/categoryHooks';
import SelectButton from './selectButton/SelectButton';
import type { Dispatch, SetStateAction } from 'react';
import { useToast } from '@/hooks/useToast';
import type { Category } from '@/api/category/categoryType';

type SubCateBoxProps = {
  selectedId: number;
  subSelected: Category[];
  setSubSelected: Dispatch<SetStateAction<Category[]>>;
};

const SubCateBox = ({
  selectedId,
  subSelected,
  setSubSelected,
}: SubCateBoxProps) => {
  const { showToast } = useToast();

  const { data, isLoading, isError, error } = useSubcategoriesQuery(
    selectedId,
    'ko'
  ); // 서브 카테고리 불러옴.

  if (isLoading) {
    return <div></div>;
  }

  if (isError) {
    return <div>서브 카테고리 로딩 에러: {error.message}</div>;
  }

  if (!data) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  const subData: Subcategory[] = data.subcategories;

  return (
    <div className='border-outline-gray shadow-light bg-bg-white my-4 rounded-lg border p-4 text-sm'>
      <div className='flex flex-wrap gap-2'>
        {subData.map((item) => {
          return (
            <SelectButton
              key={item.id}
              selected={subSelected.some((c) => c.id === item.id)}
              className='text-md rounded-all h-8'
              onClick={() =>
                setSubSelected((prev) => {
                  if (prev.length >= 9 && !prev.some((c) => c.id === item.id)) {
                    showToast('관심사는 9개까지 선택 가능합니다.', 'error');
                    return prev;
                  }
                  if (prev.some((c) => c.id === item.id)) {
                    return prev.filter((c) => c.id !== item.id);
                  } else {
                    return [...prev, { id: item.id, name: item.name }];
                  }
                })
              }
            >
              # {item.name}
            </SelectButton>
          );
        })}
      </div>
    </div>
  );
};

export default SubCateBox;
