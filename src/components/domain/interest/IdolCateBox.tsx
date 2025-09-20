import { useState } from 'react';
import Input from '@/components/common/Input';
import type { Subcategory } from '@/api/category/categoryType';
import type { Dispatch, SetStateAction } from 'react';
import type { Category } from '@/api/category/categoryType';
import { useSubcategoriesQuery } from '@/api/category/categoryHooks';
import Button from '@/components/common/Button';
import IdolRequestModal from '@/components/domain/interest/IdolRequestModal';
import SelectButton from './selectButton/SelectButton';
import { useToast } from '@/hooks/useToast';

type IdolCateBoxProps = {
  selectedId: number;
  subSelected: Category[];
  setSubSelected: Dispatch<SetStateAction<Category[]>>;
};

const IdolCateBox = ({
  selectedId,
  subSelected,
  setSubSelected,
}: IdolCateBoxProps) => {
  const [idolInput, setIdolInput] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState(false); // 아이돌 모달 온오프 여부
  const handleSerchIdol = (value: string) => {
    setIdolInput(value);
  };
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

  const filteredData = subData.filter((item) =>
    item.name.toLowerCase().includes(idolInput.toLowerCase())
  );

  return (
    <>
      <div>
        <div className='border-main-pink bg-main-pink/2 my-6 rounded-3xl border p-6'>
          <p className='mb-4'>관심있는 K-POP 아이돌/그룹을 선택하세요</p>
          <Input
            type='text'
            placeholder='아이돌 그룹 검색 (예: BTS, BLACKPINK)'
            value={idolInput}
            onChange={(e) => handleSerchIdol(e.target.value)}
          />
          <div className='flex flex-wrap gap-2 pt-4'>
            {filteredData.map((item) => {
              return (
                <SelectButton
                  key={item.id}
                  selected={subSelected.some((c) => c.id === item.id)}
                  className='text-md rounded-all h-8'
                  onClick={() =>
                    setSubSelected((prev) => {
                      if (
                        prev.length >= 9 &&
                        !prev.some((c) => c.id === item.id)
                      ) {
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
          <hr className='text-outline-gray my-5' />
          <p className='my-2 text-center'>원하는 아이돌이 없나요?</p>
          <Button
            variant='active'
            onClick={() => setModalOpen(true)}
            className='m-auto mt-4 h-12 w-fit rounded-full px-5'
          >
            아이돌 신청하기
          </Button>
        </div>
      </div>

      <IdolRequestModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default IdolCateBox;
