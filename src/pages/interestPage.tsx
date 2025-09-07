import { useAllCategoriesQuery } from '@/api/category/categoryHooks';
import type { Category, Subcategory } from '@/api/category/categoryType';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import Input from '@/components/common/Input';
import IdolRequestModal from '@/components/domain/interest/IdolRequestModal';
import SelectButton from '@/components/domain/interest/selectButton/SelectButton';
import SelectButtonGroup from '@/components/domain/interest/selectButton/SelectButtonGroup';
import SelectDetailBox from '@/components/domain/interest/selectButton/SelectDetailBox';
import SelectedInterests from '@/components/domain/interest/selectButton/SelectedInterests';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import { useToast } from '@/hooks/useToast';
import { useEffect, useState } from 'react';

const InterestPage = () => {
  const { data, isLoading, isError, error } = useAllCategoriesQuery('ko');
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<number>();
  const [subCate, setSubCate] = useState<Subcategory[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [subSelected, setSubSelected] = useState<Subcategory[]>([]);

  const [idolInput, setIdolInput] = useState<string>('');

  let mainCate: Category[] = [];

  const handleClickSubCate = (id: number) => {
    setSelectedId(id);
  };

  const handleClickName = (data: Subcategory) => {
    if (
      subSelected.length >= 9 &&
      !subSelected.some((item) => item.id === data.id)
    ) {
      alert('관심사는 최대 9개까지 선택할 수 있습니다.');
      return;
    }

    setSubSelected((prevItems) => {
      // prevItems 배열에 같은 id를 가진 객체가 있는지 확인합니다.
      const isSelected = prevItems.some((item) => item.id === data.id);

      if (isSelected) {
        // 같은 id를 가진 객체를 배열에서  제거합니다.
        return prevItems.filter((item) => item.id !== data.id);
      } else {
        // 새로운 data 객체를 배열에 추가합니다.
        return [...prevItems, data];
      }
    });
  };

  const handleSerchIdol = (value: string) => {
    setIdolInput(value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (subSelected.length === 0) {
      showToast('관심사를 하나 이상 선택해주세요.', 'error');
      return;
    }
    console.log('최종 선택된 관심사:', subSelected);
    showToast('관심사 선택이 완료되었습니다!', 'success');
  };

  useEffect(() => {
    const tempCate = mainCate.find((item) => item.id === selectedId);
    if (tempCate) {
      setSubCate(tempCate.subcategories);
    }
  }, [selectedId]);

  if (data) {
    mainCate = data.categories;
  }

  if (isLoading) {
    return <div>메인 카테고리 로딩중</div>;
  }

  if (isError) {
    return <div>메인 카테고리 로딩 에러: {error.message}</div>;
  }

  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText='관심사를 선택하세요'
          accountQuestionText='Korip에서 추천하는 관심사예요.'
        />

        {/* 대분류 해시태그 뿌림 */}
        {mainCate && mainCate.length > 0 && (
          <SelectButtonGroup
            selectedId={selectedId}
            mainCateData={mainCate}
            handleClickSubCate={handleClickSubCate}
          />
        )}

        {/* 소분류 해시태그 뿌림 */}
        {selectedId && selectedId !== 6 && (
          <SelectDetailBox
            subCateData={subCate}
            // ui 확인용 프롭스
            subSelected={subSelected}
            handleClickName={handleClickName}
          />
        )}

        {/* K-POP 아이돌/그룹 선택 */}
        {selectedId === 6 && (
          <div className='border-main-pink bg-main-pink/2 my-6 rounded-3xl border p-6'>
            <p className='mb-4'>관심있는 K-POP 아이돌/그룹을 선택하세요</p>
            <Input
              type='text'
              placeholder='아이돌 그룹 검색 (예: BTS, BLACKPINK)'
              value={idolInput}
              onChange={(e) => handleSerchIdol(e.target.value)}
            />

            <div className='border-outline-gray mt-4 flex flex-wrap gap-2 border-b pb-4'>
              {mainCate[5].subcategories
                .filter((item) => item.name.includes(idolInput)) // 필터링 로직 추가
                .map((item) => {
                  return (
                    <SelectButton
                      key={item.id}
                      type='button'
                      onClick={() => handleClickName(item)}
                      className='text-sm'
                      selected={subSelected.some(
                        (selectedItem) => selectedItem.id === item.id
                      )}
                    >
                      # {item.name}
                    </SelectButton>
                  );
                })}
            </div>
            <p className='my-2 text-center'>원하는 아이돌이 없나요?</p>
            <Button
              variant='active'
              onClick={() => setModalOpen(true)}
              className='m-auto mt-4 w-fit rounded-full px-5'
            >
              아이돌 신청하기
            </Button>
          </div>
        )}

        <h3 className='mt-6 mb-2 text-lg font-semibold'>최종 선택된 관심사</h3>

        <SelectedInterests
          subSelected={subSelected}
          handleClickName={handleClickName}
        />

        <div className='mt-8'>
          <Button className='w-full' onClick={handleSubmit}>
            완료
          </Button>
        </div>
      </div>

      <IdolRequestModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Container>
  );
};

export default InterestPage;
