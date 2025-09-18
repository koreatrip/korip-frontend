import { useProfileEditStore } from '@/stores/useProfileEditStore';
import { useSubcategoriesQuery } from '@/api/category/categoryHooks';
import Spinner from '@/components/common/Spinner';
import { useToast } from '@/hooks/useToast';

type SubcategoryGroupProps = {
  categoryId: number;
  lang: string;
};

const SubcategoryGroup = ({ categoryId, lang }: SubcategoryGroupProps) => {
  const { state, actions } = useProfileEditStore();
  const { tempFormData } = state;
  const { addInterest } = actions;

  const { data, isLoading, isError } = useSubcategoriesQuery(categoryId, lang);
  const { showToast } = useToast();

  // tempFormData가 null인 경우 빈 Set으로 처리
  const selectedInterestsSet = new Set(
    tempFormData?.preferences_display?.map((p) => p.name) || []
  );

  const handleClick = (subCategory: { id: number; name: string }) => {
    // tempFormData null 체크 추가
    if (!tempFormData) {
      console.error('tempFormData is null');
      return;
    }

    // 현재 관심사 개수 체크를 컴포넌트에서 직접 처리
    if (tempFormData.preferences_display.length >= 9) {
      showToast('관심사는 최대 9개까지 선택할 수 있습니다.', 'warning');
      return;
    }

    // 이미 선택된 관심사인지 체크
    if (selectedInterestsSet.has(subCategory.name)) {
      return;
    }

    // addInterest 호출
    addInterest(subCategory);
  };

  // tempFormData가 null인 경우 로딩 또는 에러 처리
  if (!tempFormData) {
    return (
      <div className='px-1 text-xs text-gray-500'>데이터를 불러오는 중...</div>
    );
  }

  if (isLoading) return <Spinner size='sm' />;
  if (isError) return <div className='px-1 text-xs text-red-500'>오류</div>;

  return (
    <div className='flex flex-wrap gap-2'>
      {data?.subcategories.map((subCategory) => {
        const isSelected = selectedInterestsSet.has(subCategory.name);
        return (
          <button
            key={subCategory.id}
            onClick={() => handleClick(subCategory)}
            disabled={isSelected}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm transition ${
              isSelected
                ? 'text-sub-text-gray cursor-not-allowed bg-gray-100'
                : 'bg-main-pink text-bg-white hover:opacity-80'
            }`}
          >
            #{subCategory.name}
          </button>
        );
      })}
    </div>
  );
};

export default SubcategoryGroup;
