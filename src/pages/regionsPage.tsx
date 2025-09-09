import InfoCard from '@/components/domain/regions/InfoCard';
import InfoCardSkeleton from '@/components/common/ui/InfoCardSkeleton';
import Carousel from '@/components/domain/regions/Carousel';
import Weather from '@/components/domain/weather/Weather';
import Container from '@/components/common/Container';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { useModalStore } from '@/stores/useModalStore';
import LoginPromptModal from '@/components/domain/auth/LoginPromptModal';
import { useNavigate } from 'react-router';
import { usePlacesQuery } from '@/api/place/placeHooks';
import LoadingPage from './statusPage/loadingPage';
import { useEffect, useState } from 'react';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';
import EmptyCard from '@/components/common/ui/EmptyCard';
import { useUserProfileQuery } from '@/api/user/userHooks';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import PlaceDetailModal from '@/components/domain/regions/PlaceDetailModal';

const RegionsPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { stack, actions } = useModalStore();
  const { isLoggedIn } = useAuthCheck();

  // 선택된 장소 ID 상태 관리
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const regionId = useNumericSearchParam('region_id');
  const subregionId = useNumericSearchParam('subregion_id');

  // 헤더에서 선택한 현재 언어 가져오기
  const currentLanguage = i18n.language || 'ko';

  const {
    data: placesData,
    isLoading,
    error,
  } = usePlacesQuery(
    {
      region_id: regionId!,
      ...(subregionId && { subregion_id: subregionId }),
      lang: currentLanguage,
    },
    {
      enabled: !!regionId, // region_id가 있을 때만 쿼리 실행
    }
  );

  console.log('명소데이터', placesData);

  const { data: userProfile } = useUserProfileQuery();

  // 안전한 데이터 추출 (배열 접근 포함)
  const region = placesData?.region; // 첫 번째 요소
  const subregion = placesData?.subregion; // 첫 번째 요소
  const popularSubregions = placesData?.popular_subregions || [];
  const majorPlaces = placesData?.major_places || [];
  const userRecommendedPlaces = placesData?.user_recommended_places || [];
  const accommodations = placesData?.accommodations || [];

  // 모달 관련 핸들러
  const handlePlaceDetailOpen = (placeId: number) => {
    setSelectedPlaceId(placeId);
  };

  const handlePlaceDetailClose = () => {
    setSelectedPlaceId(null);
  };

  // 일정에 장소 추가 핸들러
  const handleAddToSchedule = (planId: string, planName: string) => {
    console.log(`장소 ${selectedPlaceId}를 ${planName} 일정에 추가`);
    // 여기에 실제 일정 추가 API 호출 로직 추가
  };

  // 위치 표시명 결정 함수 - API 데이터 기반으로 수정
  const getLocationDisplayName = () => {
    if (!region?.name) return '날씨 정보';

    // subregion이 선택되어 있고 데이터가 있으면 함께 표시
    if (subregionId && subregion?.name) {
      return `${region.name} ${subregion.name} 날씨`;
    }

    // region만 선택된 경우
    return `${region.name} 날씨`;
  };

  // 현재 보고 있는 지역명 결정 - API 데이터 우선, 로케이션 스토어 fallback
  const getCurrentRegionName = () => {
    // 1순위: API 데이터 조합
    if (region?.name) {
      const regionName = region.name;

      // subregion이 선택되어 있고 데이터가 있으면 함께 표시
      if (subregionId && subregion?.name) {
        return `${regionName} ${subregion.name}`;
      }

      // region만 선택된 경우
      return regionName;
    }

    // 2순위: URL 파라미터 기반 fallback
    if (regionId) {
      const regionNames: Record<number, string> = {
        1: '서울특별시',
        2: '부산광역시',
        3: '대구광역시',
        4: '인천광역시',
      };

      const subregionNames: Record<number, string> = {
        526: '강남구',
        527: '강동구',
        548: '종로구',
        549: '중구',
      };

      const regionName = regionNames[regionId] || `지역 ${regionId}`;

      if (subregionId) {
        const subregionName =
          subregionNames[subregionId] || `구역 ${subregionId}`;
        return `${regionName} ${subregionName}`;
      }

      return regionName;
    }

    return '지역을 선택해주세요';
  };

  // 기본 서울특별시로 리다이렉트
  useEffect(() => {
    if (!regionId) {
      // region_id가 없으면 서울특별시(ID: 1)로 리다이렉트
      navigate(`/explore/regions?region_id=1&lang=${currentLanguage}`, {
        replace: true,
      });
      return;
    }
  }, [regionId, currentLanguage, navigate]);

  if (isLoading) return <LoadingPage />;
  if (!regionId) {
    return <LoadingPage />;
  }
  if (error) return <div>Error occurred</div>;

  return (
    <div className='mt-8 w-full'>
      <Container>
        <Carousel />

        {/* 지역 정보 섹션 */}
        <div className='mt-[60px] flex flex-col'>
          <h1 className='tablet-bp:text-4xl mb-4 text-2xl font-semibold'>
            {region?.name || '서울특별시'}
          </h1>
          <h2 className='tablet-bp:text-[32px] mb-3.5 text-xl font-semibold'>
            {region?.description || '대한민국의 수도'}
          </h2>
          <p className='text-sub-text-gray tablet-bp:text-base text-sm'>
            {region?.feature}
          </p>
        </div>

        {/* 날씨 섹션 */}
        <div className='mt-[60px] flex flex-col'>
          <h1 className='tablet-bp:text-[32px] mb-4 text-xl font-semibold'>
            {getLocationDisplayName()}
          </h1>

          {(regionId || subregionId) && (
            <div className='text-sub-text-gray mb-4 text-sm'>
              {t('common.search_result')} → {getCurrentRegionName()}
            </div>
          )}
          <div className='flex justify-center'>
            <Weather />
          </div>
        </div>

        {/* 인기 서브지역 섹션 */}
        <div className='mt-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.popular_area_info')}
          </h2>

          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-7 grid grid-cols-1 gap-4'>
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <li key={`skeleton-subregion-${i}`}>
                    <InfoCardSkeleton variant='selectable' />
                  </li>
                ))
              : popularSubregions.length > 0
                ? popularSubregions.map((subregion) => (
                    <li key={subregion.id}>
                      <InfoCard
                        variant='selectable'
                        title={subregion.name}
                        description={subregion.description || ''}
                        details={subregion.feature || ''}
                      />
                    </li>
                  ))
                : // EmptyCard로 교체
                  Array.from({ length: 4 }, (_, i) => (
                    <li key={`empty-subregion-${i}`}>
                      <EmptyCard
                        variant='selectable'
                        type='subregions'
                        onActionClick={() =>
                          navigate('/explore/regions?region_id=1')
                        }
                      />
                    </li>
                  ))}
          </ul>

          {popularSubregions.length > 0 && (
            <div className='mt-2 flex w-full justify-end'>
              <button
                onClick={() =>
                  navigate(
                    `/explore/districts?region_id=${regionId}&subregion_id=${subregionId || 1}&lang=${currentLanguage}`
                  )
                }
              >
                {t('places.explore_all_districts')}
              </button>
            </div>
          )}
        </div>

        <h1 className='tablet-bp:text-4xl mt-14 text-2xl font-semibold'>
          <p>
            {t('places.currently_viewing', {
              location: getCurrentRegionName(),
            })}
          </p>
        </h1>

        {/* 주요 명소 섹션 */}
        <div className='mt-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.main_attractions')}
          </h2>

          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-7 grid grid-cols-1 gap-4'>
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <li key={`skeleton-major-${i}`}>
                    <InfoCardSkeleton variant='interactive' />
                  </li>
                ))
              : majorPlaces.length > 0
                ? majorPlaces.slice(0, 4).map((place) => (
                    <li key={place.id}>
                      <InfoCard
                        variant='interactive'
                        title={place.name}
                        description={place.description ?? ''} // null이면 빈 문자열
                        details={place.feature ?? ''}
                        id={place.id}
                        onViewDetails={() => handlePlaceDetailOpen(place.id)}
                        onAddToSchedule={handleAddToSchedule}
                      />
                    </li>
                  ))
                : // EmptyCard로 교체
                  Array.from({ length: 4 }, (_, i) => (
                    <li key={`empty-attraction-${i}`}>
                      <EmptyCard
                        variant='interactive'
                        type='attractions'
                        onActionClick={() => navigate('/explore/attractions')}
                      />
                    </li>
                  ))}
          </ul>

          <div className='mt-2 flex w-full justify-end'>
            <button
              className='cursor-pointer font-medium'
              onClick={() =>
                navigate(
                  `/explore/attractions?subregion_id=${subregionId || 1}&lang=${currentLanguage}`
                )
              }
            >
              {t('common.view_all')}
            </button>
          </div>
        </div>

        {/* 사용자 추천 명소 섹션 */}
        {isLoggedIn &&
          (userRecommendedPlaces.length > 0 ? (
            <div className='mt-7'>
              <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
                {t('places.recommended_spots_for_user', {
                  name: userProfile?.name || '사용자',
                })}
              </h2>
              <p className='text-sub-text-gray tablet-bp:text-base text-sm'>
                <Trans
                  i18nKey='places.selected_based_on_interests'
                  values={{ interest: 'k-pop,맛집/카페' }}
                  components={{
                    InterestSpan: <span className='font-medium' />,
                  }}
                />
              </p>
              <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-3 mt-7 grid grid-cols-1 gap-4'>
                {userRecommendedPlaces.slice(0, 3).map((place) => (
                  <li key={place.id}>
                    <InfoCard
                      variant='selectable'
                      title={place.name}
                      description={place.description ?? ''}
                      details={place.feature ?? ''}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='mt-7'>
              <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
                {t('places.recommended_spots_for_user', {
                  name: userProfile?.name || '사용자',
                })}
              </h2>
              <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-3 mt-7 grid grid-cols-1 gap-4'>
                {Array.from({ length: 3 }, (_, i) => (
                  <li key={`empty-user-recommended-${i}`}>
                    <EmptyCard
                      variant='selectable'
                      type='user-recommended'
                      // onActionClick={() => actions.openLoginPrompt()}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}

        {/* 숙박 시설 섹션 */}
        <div className='my-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.recommended_accommodations')}
          </h2>

          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-7 grid grid-cols-1 gap-4'>
            {accommodations.length > 0
              ? accommodations.map((accommodation) => (
                  <li key={accommodation.id}>
                    <InfoCard
                      variant='selectable'
                      title={accommodation.name}
                      description={accommodation.description}
                      details={accommodation.feature}
                    />
                  </li>
                ))
              : // EmptyCard로 교체
                Array.from({ length: 4 }, (_, i) => (
                  <li key={`empty-accommodation-${i}`}>
                    <EmptyCard
                      variant='selectable'
                      type='accommodations'
                      onActionClick={() => navigate('/explore/accommodations')}
                    />
                  </li>
                ))}
          </ul>

          <div className='mt-2 flex w-full justify-end'>
            <button className='cursor-pointer font-medium'>
              {t('common.view_all')}
            </button>
          </div>
        </div>
      </Container>

      <LoginPromptModal
        isOpen={stack.isLoginPromptOpen}
        onClose={actions.closeLoginPrompt}
      />

      <PlaceDetailModal
        isOpen={selectedPlaceId !== null}
        onClose={handlePlaceDetailClose}
        placeId={selectedPlaceId || 0}
        lang={i18n.language || 'ko'}
      />
    </div>
  );
};

export default RegionsPage;
