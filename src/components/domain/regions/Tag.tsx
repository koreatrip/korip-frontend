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

  // URL에서 현재 선택된 카테고리와 서브카테고리 읽기
  const selectedCategory = useNumericSearchParam('category_id');
  const selectedSubcategory = useNumericSearchParam('subcategory_id');

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

  // URL 파라미터 업데이트 헬퍼 함수 (순서 정리)
  const updateURLParams = (updates: Record<string, string | null>) => {
    const searchParams = new URLSearchParams(location.search);

    // 업데이트 적용
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    // 원하는 순서대로 파라미터 재정렬
    const orderedParams = new URLSearchParams();

    // 1. 지역 관련 파라미터
    if (searchParams.has('region_id')) {
      orderedParams.set('region_id', searchParams.get('region_id')!);
    }
    if (searchParams.has('subregion_id')) {
      orderedParams.set('subregion_id', searchParams.get('subregion_id')!);
    }

    // 2. 카테고리 관련 파라미터
    if (searchParams.has('category_id')) {
      orderedParams.set('category_id', searchParams.get('category_id')!);
    }
    if (searchParams.has('subcategory_id')) {
      orderedParams.set('subcategory_id', searchParams.get('subcategory_id')!);
    }

    // 3. 기타 파라미터
    if (searchParams.has('place_id')) {
      orderedParams.set('place_id', searchParams.get('place_id')!);
    }

    // 4. 언어는 맨 마지막
    if (searchParams.has('lang')) {
      orderedParams.set('lang', searchParams.get('lang')!);
    }

    navigate(`${location.pathname}?${orderedParams.toString()}`);
  };

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      // 이미 선택된 카테고리 클릭 시 제거 (서브카테고리도 함께 제거)
      updateURLParams({
        category_id: null,
        subcategory_id: null,
      });
    } else {
      // 새 카테고리 선택 (서브카테고리 초기화)
      updateURLParams({
        category_id: categoryId.toString(),
        subcategory_id: null,
      });
    }
  };

  // 전체 태그 클릭 시 모든 필터 제거
  const handleAllClick = () => {
    updateURLParams({
      category_id: null,
      subcategory_id: null,
    });
  };

  // 서브카테고리 선택 핸들러
  const handleSubcategoryClick = (subcategoryId: number) => {
    if (selectedSubcategory === subcategoryId) {
      // 이미 선택된 서브카테고리 클릭 시 제거
      updateURLParams({
        subcategory_id: null,
      });
    } else {
      // 새 서브카테고리 선택
      updateURLParams({
        subcategory_id: subcategoryId.toString(),
      });
    }
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
            selectedCategory === null && selectedSubcategory === null
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
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  selectedSubcategory === subcategory.id
                    ? 'border-main-pink bg-main-pink text-bg-white'
                    : 'border-outline-gray bg-bg-white hover:bg-hover-gray'
                }`}
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
