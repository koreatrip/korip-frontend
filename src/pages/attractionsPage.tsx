import { useInfiniteSubregionPlacesQuery } from '@/api/place/placeHooks';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import ListPageLayout from '@/layouts/listPageLayout';
import { useTranslation } from 'react-i18next';
import LoadingPage from './statusPage/loadingPage';
import PlaceCard from '@/components/domain/regions/PlaceCard';
import { useEffect, useRef } from 'react';
import Spinner from '@/components/common/Spinner';
import { useLocation, useNavigate } from 'react-router';
import PlaceDetailModal from '@/components/domain/regions/PlaceDetailModal';

const AttractionsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const subregionId = useNumericSearchParam('subregion_id');
  const categoryId = useNumericSearchParam('category_id');
  const placeId = useNumericSearchParam('place_id');

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

  const handlePlaceCardClick = (placeId: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('place_id', placeId.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleModalClose = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('place_id');
    navigate(`${location.pathname}?${searchParams.toString()}`);
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
    <>
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
              <PlaceCard
                key={place.id}
                data={place}
                onClick={() => handlePlaceCardClick(place.id)}
              />
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
      <PlaceDetailModal
        isOpen={!!placeId}
        onClose={handleModalClose}
        placeId={placeId}
        lang={i18n.language || 'ko'}
      />
    </>
  );
};

export default AttractionsPage;
