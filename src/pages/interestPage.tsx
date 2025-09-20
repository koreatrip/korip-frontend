import { useState } from 'react';

import { useAllCategoriesQuery } from '@/api/category/categoryHooks';
import type { Category } from '@/api/category/categoryType';

import Button from '@/components/common/Button';
import Container from '@/components/common/Container';

import MainCateBox from '@/components/domain/interest/MainCateBox';
import SubCateBox from '@/components/domain/interest/SubCateBox';
import SelectedBox from '@/components/domain/interest/SelectedBox';
import WelcomeCard from '@/components/domain/login/WelcomeCard';
import { useToast } from '@/hooks/useToast';
import IdolCateBox from '@/components/domain/interest/IdolCateBox';
import { interestAPI } from '@/api/interest/interestAPI';
import { useUserProfileQuery } from '@/api/user/userHooks';

const InterestPage = () => {
  const { showToast } = useToast();
  const { data, isLoading, isError, error } = useAllCategoriesQuery('ko'); // 메인 카테고리 불러옴.
  const [selectedId, setSelectedId] = useState<number>(); // 서브 카테고리 선택시 (역할 1. 핑크, 2. get)
  const [subSelected, setSubSelected] = useState<Category[]>([]); // 1.post 로 보낼 데이터 목록 2. 핑크
  const {
    data: userProfileData,
    isLoading: userLoading,
    error: userError,
  } = useUserProfileQuery();
  const handleClickMainCate = (id: number) => {
    setSelectedId(id);
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (subSelected.length === 0) {
      showToast('관심사를 하나 이상 선택해주세요.', 'error');
      return;
    }
    const requestPayload = {
      preferences: subSelected.map((item) => item.id),
    };
    if (!userProfileData || !userProfileData.id) {
      showToast('사용자 정보를 찾을 수 없습니다.', 'error');
      return;
    }
    const userId = userProfileData.id;
    try {
      await interestAPI(userId, requestPayload);
      showToast('관심사 선택이 완료되었습니다!', 'success');
    } catch (error) {
      console.error('관심사 선택 전송 실패:', error);
      showToast('관심사 전송에 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  if (isLoading) {
    return <div></div>;
  }
  if (isError) {
    return <div>메인 카테고리 로딩 에러: {error.message}</div>;
  }
  if (!data) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }
  const mainData: Category[] = data.categories;

  return (
    <Container>
      <div className='m-auto max-w-[540px] flex-col items-center justify-center p-8'>
        <WelcomeCard
          mainText='관심사를 선택하세요'
          accountQuestionText='Korip에서 추천하는 관심사예요.'
        />
        {/* 대분류 해시태그 뿌림 */}
        {mainData && mainData.length > 0 && (
          <MainCateBox
            selectedId={selectedId}
            mainData={mainData}
            handleClickMainCate={handleClickMainCate}
          />
        )}
        {/* 소분류 해시태그 뿌림 */}
        {selectedId && selectedId !== 7 && (
          <SubCateBox
            selectedId={selectedId}
            subSelected={subSelected}
            setSubSelected={setSubSelected}
          />
        )}

        {/* K-POP 아이돌/그룹 선택 */}
        {selectedId === 7 && (
          <IdolCateBox
            selectedId={selectedId}
            subSelected={subSelected}
            setSubSelected={setSubSelected}
          />
        )}
        <h3 className='mt-6 mb-2 text-lg font-semibold'>최종 선택된 관심사</h3>

        <SelectedBox
          subSelected={subSelected}
          setSubSelected={setSubSelected}
        />

        <div className='mt-8'>
          <Button className='w-full' onClick={handleSubmit}>
            완료
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default InterestPage;
