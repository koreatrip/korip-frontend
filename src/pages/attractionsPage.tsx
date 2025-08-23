import { useInfiniteSubregionPlacesQuery } from '@/api/place/placeHooks';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import ListPageLayout from '@/layouts/listPageLayout';
import { useTranslation } from 'react-i18next';
import LoadingPage from './statusPage/loadingPage';
import PlaceCard from '@/components/domain/regions/PlaceCard';
import { useEffect, useRef } from 'react';
import Spinner from '@/components/common/Spinner';

const AttractionsPage = () => {
  const { t, i18n } = useTranslation();
  const subregionId = useNumericSearchParam('subregion_id');
  const categoryId = useNumericSearchParam('category_id'); // 카테고리 ID 추가
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSubregionPlacesQuery({
    subregion_id: subregionId!,
    lang: i18n.language || 'ko',
    page_size: 12,
    category_id: categoryId || undefined, // URL에서 가져온 카테고리 ID 사용
  });

  // 모든 페이지의 places를 하나의 배열로 합치기
  const allPlaces = data?.pages.flatMap((page) => page.places) || [];
  const firstPageData = data?.pages[0];

  console.log('ㅝㅁ야 왜 필터링아도ㅔ', data);

  // 현재 서브지역 이름 가져오기
  const getCurrentSubregionName = () => {
    if (!allPlaces.length) return '선택된 지역';

    const firstPlace = allPlaces[0];
    if (firstPlace?.sub_region?.name && firstPlace?.region?.name) {
      return `${firstPlace.region.name} ${firstPlace.sub_region.name}`;
    }

    return '선택된 지역';
  };

  // Intersection Observer를 사용한 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '20px',
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 카테고리나 서브지역이 변경되면 데이터 리셋 (스크롤 위치 초기화)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, subregionId]);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>error: {error.message}</div>;

  return (
    <ListPageLayout
      title={t('places.explore_attractions', {
        regions: getCurrentSubregionName(),
      })}
      subtitle={t('places.45_attractions', {
        attractions_count: firstPageData?.count || 0,
      })}
    >
      {allPlaces.length > 0 ? (
        <>
          {allPlaces.map((place) => (
            <PlaceCard key={place.id} data={place} />
          ))}

          {/* 무한스크롤 트리거 요소 */}
          <div ref={loadMoreRef} className='col-span-full h-10'>
            {isFetchingNextPage && (
              <div className='flex justify-center py-4'>
                <Spinner />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className='col-span-full text-center text-gray-500'>
          해당 지역의 명소 정보가 없습니다.
        </div>
      )}
    </ListPageLayout>
  );
};

export default AttractionsPage;
