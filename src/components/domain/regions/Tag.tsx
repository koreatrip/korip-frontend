import {
  useAllCategoriesQuery,
  useSubcategoriesQuery,
} from '@/api/category/categoryHooks';
import { TagSkeleton } from '@/components/common/ui/TagSkeleton';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';

const Tag = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 현재 선택된 카테고리 읽기
  const selectedCategory = useNumericSearchParam('category_id');

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useAllCategoriesQuery(i18n.language || 'ko');

  const {
    data: subcategoriesData,
    isLoading: subcategoriesLoading,
    error: subCategoriesError,
  } = useSubcategoriesQuery(selectedCategory!, i18n.language || 'ko', {
    enabled: !!selectedCategory,
  });

  console.log('subcategoriesData:', subcategoriesData);

  // URL 파라미터 업데이트 헬퍼 함수
  const updateURLParams = (updates: Record<string, string | null>) => {
    const searchParams = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      // 이미 선택된 카테고리 클릭 시 제거
      updateURLParams({ category_id: null });
    } else {
      // 새 카테고리 선택
      updateURLParams({ category_id: categoryId.toString() });
    }
  };

  // 전체 태그 클릭 시 카테고리 필터 제거
  const handleAllClick = () => {
    updateURLParams({ category_id: null });
  };

  // 서브카테고리 선택 핸들러
  const handleSubcategoryClick = (subcategoryId: number) => {
    updateURLParams({
      category_id: selectedCategory?.toString() || null,
      subcategory_id: subcategoryId.toString(),
    });
  };

  if (categoriesLoading) {
    return (
      <div className='flex w-full flex-wrap gap-x-2'>
        <TagSkeleton count={6} />
      </div>
    );
  }

  if (categoriesError) {
    return <div>error: {categoriesError.message}</div>;
  }
  if (subCategoriesError) {
    return <div>error: {subCategoriesError.message}</div>;
  }

  return (
    <div className='flex w-full flex-col gap-y-2'>
      {/* 메인 카테고리 */}
      <div className='flex w-full flex-wrap gap-2'>
        <button
          onClick={handleAllClick}
          className={`rounded-full border px-5 py-2 transition-colors ${
            selectedCategory === null
              ? 'border-main-pink bg-main-pink text-bg-white'
              : 'border-outline-gray bg-bg-white hover:bg-hover-gray'
          }`}
        >
          전체
        </button>
        {categoriesData?.categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`rounded-full border px-5 py-2 transition-colors ${
              selectedCategory === category.id
                ? 'border-main-pink bg-main-pink text-bg-white'
                : 'border-outline-gray bg-bg-white hover:bg-hover-gray'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 서브카테고리 */}
      {selectedCategory && (
        <div className='flex w-full flex-wrap gap-x-2'>
          {subcategoriesLoading ? (
            <TagSkeleton count={6} />
          ) : (
            subcategoriesData?.subcategories?.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory.id)}
                className='border-outline-gray bg-bg-white rounded-full border px-4 py-1.5 text-sm transition-colors hover:bg-gray-50'
              >
                {subcategory.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tag;
