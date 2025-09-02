import {
  useInfiniteSubregionPlacesQuery,
  useInfiniteSubcategoryPlacesQuery,
} from '@/api/place/placeHooks';
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

  const regionId = useNumericSearchParam('region_id');
  const subregionId = useNumericSearchParam('subregion_id');
  const categoryId = useNumericSearchParam('category_id');
  const subcategoryId = useNumericSearchParam('subcategory_id');
  const placeId = useNumericSearchParam('place_id');

  // 서브카테고리가 선택되었으면 서브카테고리 API 사용, 아니면 서브지역 API 사용
  const useSubcategoryQuery = !!subcategoryId;

  // 서브지역별 명소 쿼리 (카테고리 필터링 포함)
  const subregionQuery = useInfiniteSubregionPlacesQuery(
    {
      subregion_id: subregionId!,
      lang: i18n.language || 'ko',
      page_size: 12,
      category_id: categoryId || undefined,
    },
    {
      enabled: !!subregionId && !useSubcategoryQuery,
    }
  );

  // 서브카테고리별 명소 쿼리
  const subcategoryQuery = useInfiniteSubcategoryPlacesQuery(
    {
      subcategory_id: subcategoryId,
      lang: i18n.language || 'ko',
      page_size: 12,
      region_id: regionId || undefined,
      subregion_id: subregionId || undefined,
    },
    {
      enabled: !!subcategoryId && useSubcategoryQuery,
    }
  );

  // 현재 사용 중인 쿼리 결과
  const currentQuery = useSubcategoryQuery ? subcategoryQuery : subregionQuery;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = currentQuery;

  // 모든 페이지의 places를 하나의 배열로 합치기
  const allPlaces = data?.pages.flatMap((page) => page.places) || [];
  const firstPageData = data?.pages[0];

  console.log(
    '현재 사용 쿼리:',
    useSubcategoryQuery ? 'subcategory' : 'subregion'
  );
  console.log('필터링된 데이터:', data);

  const getCurrentSubregionName = () => {
    // 1순위: subregionQuery의 캐시 데이터를 확인합니다.
    // 이 데이터는 subregion_id에 직접적으로 연결된 가장 정확한 정보 소스입니다.
    // 카테고리 필터링으로 인해 subcategoryQuery 결과가 비어있더라도,
    // 이 캐시된 데이터는 그대로 남아있어 안정적으로 지역명을 가져올 수 있습니다.
    if (subregionQuery.data?.pages?.[0]?.places?.length > 0) {
      const firstPlace = subregionQuery?.data?.pages[0].places[0];
      if (firstPlace?.sub_region?.name && firstPlace?.region?.name) {
        return `${firstPlace.region.name} ${firstPlace.sub_region.name}`;
      }
    }

    // 2순위 (폴백): subregionQuery 데이터가 없는 경우 (예: 서브카테고리 링크로 바로 진입)
    // subcategoryQuery 결과에서 지역명을 찾습니다.
    if (subcategoryQuery.data?.pages) {
      for (const page of subcategoryQuery.data.pages) {
        // subregionId와 일치하는 장소를 찾아 이름을 반환합니다.
        const matchingPlace = page.places.find(
          (place) => place.sub_region.id === subregionId
        );
        if (matchingPlace?.sub_region?.name && matchingPlace?.region?.name) {
          return `${matchingPlace.region.name} ${matchingPlace.sub_region.name}`;
        }
      }
    }

    // 모든 시도가 실패할 경우의 기본값입니다.
    return '선택된 지역';
  };

  // 현재 필터 상태에 따른 타이틀 생성
  const getPageTitle = () => {
    return getCurrentSubregionName(); // 항상 지역명만 반환
  };

  const handlePlaceCardClick = (placeId: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('place_id', placeId.toString());

    // URL 파라미터 순서 정리
    const orderedParams = new URLSearchParams();

    // 1. 지역 관련
    if (searchParams.has('region_id')) {
      orderedParams.set('region_id', searchParams.get('region_id')!);
    }
    if (searchParams.has('subregion_id')) {
      orderedParams.set('subregion_id', searchParams.get('subregion_id')!);
    }

    // 2. 카테고리 관련
    if (searchParams.has('category_id')) {
      orderedParams.set('category_id', searchParams.get('category_id')!);
    }
    if (searchParams.has('subcategory_id')) {
      orderedParams.set('subcategory_id', searchParams.get('subcategory_id')!);
    }

    // 3. place_id
    if (searchParams.has('place_id')) {
      orderedParams.set('place_id', searchParams.get('place_id')!);
    }

    // 4. 언어는 마지막
    if (searchParams.has('lang')) {
      orderedParams.set('lang', searchParams.get('lang')!);
    }

    navigate(`${location.pathname}?${orderedParams.toString()}`);
  };

  const handleModalClose = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('place_id');

    // URL 파라미터 순서 정리
    const orderedParams = new URLSearchParams();

    // 1. 지역 관련
    if (searchParams.has('region_id')) {
      orderedParams.set('region_id', searchParams.get('region_id')!);
    }
    if (searchParams.has('subregion_id')) {
      orderedParams.set('subregion_id', searchParams.get('subregion_id')!);
    }

    // 2. 카테고리 관련
    if (searchParams.has('category_id')) {
      orderedParams.set('category_id', searchParams.get('category_id')!);
    }
    if (searchParams.has('subcategory_id')) {
      orderedParams.set('subcategory_id', searchParams.get('subcategory_id')!);
    }

    // 3. 언어는 마지막
    if (searchParams.has('lang')) {
      orderedParams.set('lang', searchParams.get('lang')!);
    }

    navigate(`${location.pathname}?${orderedParams.toString()}`);
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

  // 필터가 변경되면 스크롤 위치 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, subcategoryId, subregionId]);

  if (isLoading) return <LoadingPage />;
  if (error) return <div>error: {error.message}</div>;

  return (
    <>
      <ListPageLayout
        title={t('places.explore_attractions', {
          regions: getPageTitle(),
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
            {subcategoryId
              ? '해당 카테고리의 명소 정보가 없습니다.'
              : '해당 지역의 명소 정보가 없습니다.'}
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
