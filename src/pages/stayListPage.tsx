import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import { useTranslation } from 'react-i18next';
import LoadingPage from './statusPage/loadingPage';
import i18n from '@/i18n/i18n';
import ListPageLayout from '@/layouts/listPageLayout';
import { useEffect, useState } from 'react';
import PlaceCard from '@/components/domain/regions/PlaceCard';
import { useInfiniteStayPlacesQuery } from '@/api/place/placeHooks';
import { useInView } from 'react-intersection-observer';
import Spinner from '@/components/common/Spinner';
import PlaceDetailModal from '@/components/domain/regions/PlaceDetailModal';
import Button from '@/components/common/Button';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/seo';

const StayListPage = () => {
  const { t } = useTranslation();
  const subregionId = useNumericSearchParam('subregion_id');
  const currentLanguage = i18n.language || 'ko';
  const { ref, inView } = useInView();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  // 무한 스크롤용 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteStayPlacesQuery(
    {
      subregionId: subregionId!,
      lang: currentLanguage,
      page_size: 24,
    },
    {
      enabled: !!subregionId,
    }
  );

  // 스크롤 감지하여 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 페이지의 places를 하나의 배열로 합치기
  const stayPlaces = data?.pages.flatMap((page) => page.places) || [];
  const totalCount = data?.pages[0]?.count || 0;

  // 현재 선택된 지역 이름 찾기
  const getCurrentRegionName = () => {
    if (subregionId && stayPlaces.length > 0) {
      const place = stayPlaces[0];
      return `${place.region.name} ${place.sub_region.name}`;
    }
    return '';
  };

  // 페이지 제목
  const getPageTitle = () => {
    return t('places.explore_stay_places', {
      region: getCurrentRegionName(),
    });
  };

  // 페이지 부제목
  const getPageSubtitle = () => {
    return t('places.total_stay_places', {
      count: totalCount,
    });
  };

  // PlaceCard 클릭 핸들러
  const handlePlaceClick = (placeId: number) => {
    setSelectedPlaceId(placeId);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlaceId(null);
  };

  // subregionId가 없으면 에러 표시
  if (!subregionId) {
    return (
      <ListPageLayout title={t('places.stay_title')} subtitle=''>
        <div className='col-span-full text-center text-gray-500'>
          지역을 선택해주세요.
        </div>
      </ListPageLayout>
    );
  }

  // 로딩 상태
  if (isLoading) return <LoadingPage />;

  // 에러 상태
  if (error)
    return (
      <ListPageLayout title={t('places.stay_title')} subtitle=''>
        <div className='col-span-full py-8 text-center'>
          <h3 className='mb-2 text-xl font-semibold text-red-600'>
            데이터를 불러오는데 실패했습니다
          </h3>
          <p className='mb-4 text-gray-600'>
            {error.message || '일시적인 문제가 발생했습니다'}
          </p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </ListPageLayout>
    );

  return (
    <>
      <Helmet>
        <link rel='canonical' href={`${BASE_URL}/explore/stays`} />
      </Helmet>
      <ListPageLayout title={getPageTitle()} subtitle={getPageSubtitle()}>
        {stayPlaces.length > 0 ? (
          <>
            {stayPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                data={place}
                onClick={() => handlePlaceClick(place.id)}
              />
            ))}

            {/* 무한 스크롤 트리거 */}
            <div
              ref={ref}
              className='col-span-full flex h-10 items-center justify-center'
            >
              {isFetchingNextPage && <Spinner />}
            </div>
          </>
        ) : (
          <div className='col-span-full text-center text-gray-500'>
            해당 지역의 숙박 시설 정보가 없습니다.
          </div>
        )}
      </ListPageLayout>

      {/* 장소 상세 모달 */}
      <PlaceDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        placeId={selectedPlaceId}
        lang={currentLanguage}
      />
    </>
  );
};

export default StayListPage;
