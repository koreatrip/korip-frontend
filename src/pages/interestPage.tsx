import React, { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import Input from '@/components/common/Input';
import SelectButtonGroup from '@/components/domain/interest/selectButton/SelectButtonGroup';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import SelectedInterests from '@/components/domain/interest/selectButton/SelectedInterests';
import IdolRequestModal from '@/components/domain/interest/IdolRequestModal';
import SelectDetailBox from '@/components/domain/interest/selectButton/SelectDetailBox';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAllCategoriesQuery } from '@/api/category/categoryHooks';
import type { Category, Subcategory } from '@/api/category/categoryType';

const InterestPage = () => {
  const { data, isLoading, isError, error } = useAllCategoriesQuery('ko');

  const [slectedId, setSletedId] = useState<number>();
  const [subCate, setSubCate] = useState<Subcategory[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);


  const [subSelectedId, setSubSelectedId] = useState<number[]>([]);

  let mainCate: Category[] = [];

  const handleClickSubCate = (id: number) => {
    setSletedId(id);
  };

  useEffect(() => {
    const tempCate = mainCate.find((item) => item.id === slectedId);
    if (tempCate) {
      setSubCate(tempCate.subcategories);
    }
  }, [slectedId]);

  if (data) {
    mainCate = data.data;
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
          <div>
            <SelectButtonGroup
            slectedId={slectedId}
              mainCateData={mainCate}
              handleClickSubCate={handleClickSubCate}
            />
          </div>
        )}

        {/* 소분류 해시태그 뿌림 */}

        {slectedId && (
          <div className='mt-4 flex flex-col gap-4'>
            <SelectDetailBox
              subCateData={subCate}
              // ui 확인용
              subSelectedId={subSelectedId}
              setSubSelectedId={setSubSelectedId}
            />
             {slectedId === 6 && (
              <div className='border-main-pink bg-bg-section mt-2 rounded-3xl border p-4'>
                <p>관심있는 K-POP 아이돌/그룹을 선택하세요</p>
                <Input type='text' placeholder='아이돌 이름 검색' />

                <p>원하는게 없쟈며</p>
                <Button
                  variant='active'
                  onClick={() => setModalOpen(true)}
                  className='m-auto mt-4 w-fit rounded-full px-5'
                >
                  아이돌 신청하기
                </Button>
              </div>
            )}
          </div>
        )}

        <h3 className='mt-6 mb-2 text-lg font-semibold'>최종 선택된 관심사</h3>

        {/* <SelectedInterests
          data={finalSelectedInterestsForDisplay}
          onDelete={handleDeleteInterest}
        /> */}

        <div className='mt-8'>
          <Button className='w-full'>완료</Button>
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
