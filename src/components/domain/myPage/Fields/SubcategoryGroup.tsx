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

  // 👇 여기가 수정된 부분입니다. id -> name 으로 변경
  const selectedInterestsSet = new Set(
    tempFormData?.preferences_display.map((p) => p.name) || []
  );

  const handleClick = (subCategory: { id: number; name: string }) => {
    const success = addInterest(subCategory);
    if (!success) {
      showToast('관심사는 최대 9개까지 선택할 수 있습니다.', 'warning');
    }
  };

  if (isLoading) return <Spinner size='sm' />;
  if (isError) return <div className='px-1 text-xs text-red-500'>오류</div>;

  return (
    <div className='flex flex-wrap gap-2'>
      {data?.subcategories.map((subCategory) => {
        // 이제 name을 기준으로 정상적으로 비교합니다.
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
