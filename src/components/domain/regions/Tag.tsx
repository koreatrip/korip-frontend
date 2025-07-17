import {
  useAllCategoriesQuery,
  useSubcategoriesQuery,
} from '@/api/category/categoryHooks';
import { useState } from 'react';
import { TagSkeleton } from '@/components/ui/TagSkeleton';

const Tag = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useAllCategoriesQuery();
  const { data: subcategoriesData, isLoading: subcategoriesLoading } =
    useSubcategoriesQuery(selectedCategory!, 'ko', {
      enabled: !!selectedCategory,
    });

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      // 이미 선택된 카테고리를 다시 클릭하면 서브카테고리 숨기기
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  // 전체 태그 클릭 시 서브카테고리 초기화
  const handleAllClick = () => {
    setSelectedCategory(null);
  };

  if (categoriesLoading) {
    return <div>로딩 중...</div>;
  }

  if (!categoriesData?.success || !categoriesData?.data) {
    return <div>카테고리를 불러올 수 없습니다.</div>;
  }

  return (
    <div className='flex w-full flex-col gap-y-2'>
      {/* 메인 카테고리 */}
      <div className='flex w-full flex-wrap gap-x-2'>
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
        {categoriesData.data.map((category) => (
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
            subcategoriesData?.success &&
            subcategoriesData?.data?.map((subcategory) => (
              <button
                key={subcategory.id}
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
