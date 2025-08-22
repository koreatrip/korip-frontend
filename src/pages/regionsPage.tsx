import InfoCard from '@/components/domain/regions/InfoCard';
import Carousel from '@/components/domain/regions/Carousel';
import Weather from '@/components/domain/weather/Weather';
import Container from '@/components/common/Container';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { useModalStore } from '@/stores/useModalStore';
import LoginPromptModal from '@/components/domain/auth/LoginPromptModal';
import { useNavigate, useSearchParams } from 'react-router';
import { usePlacesQuery } from '@/api/place/placeHooks';
import LoadingPage from './statusPage/loadingPage';
import { useEffect } from 'react';

const RegionsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { stack, actions } = useModalStore();

  const regionId = searchParams.get('region_id');
  const subregionId = searchParams.get('subregion_id');

  // 헤더에서 선택한 현재 언어 가져오기
  const currentLanguage = i18n.language || 'ko';

  const {
    data: placesData,
    isLoading,
    error,
  } = usePlacesQuery(
    {
      region_id: Number(regionId),
      ...(subregionId && { subregion_id: Number(subregionId) }),
      lang: currentLanguage,
    },
    {
      enabled: !!regionId, // region_id가 있을 때만 쿼리 실행
    }
  );

  console.log('placesData:', placesData);
  console.log('현재 i18n.language:', i18n.language);
  console.log('currentLanguage 값:', currentLanguage);

  // 위치 표시명 결정 함수 - API 데이터 기반으로 수정
  const getLocationDisplayName = () => {
    if (!placesData?.region?.name) return '날씨 정보';

    // subregion이 선택되어 있고 데이터가 있으면 함께 표시
    if (subregionId && placesData?.subregion?.name) {
      return `${placesData.region.name} ${placesData.subregion.name} 날씨`;
    }

    // region만 선택된 경우
    return `${placesData.region.name} 날씨`;
  };

  // 현재 보고 있는 지역명 결정 - API 데이터 우선, 로케이션 스토어 fallback
  const getCurrentRegionName = () => {
    // 1순위: API 데이터 조합
    if (placesData?.region?.name) {
      const regionName = placesData.region.name;

      // subregion이 선택되어 있고 데이터가 있으면 함께 표시
      if (subregionId && placesData?.subregion?.name) {
        return `${regionName} ${placesData.subregion.name}`;
      }

      // region만 선택된 경우
      return regionName;
    }

    // 2순위: URL 파라미터 기반 fallback
    if (regionId) {
      const regionNames = {
        '1': '서울특별시',
        '2': '부산광역시',
        '3': '대구광역시',
        '4': '인천광역시',
      };

      const subregionNames = {
        '526': '강남구',
        '527': '강동구',
        '548': '종로구',
        '549': '중구',
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
            {placesData?.region?.name || '서울특별시'}
          </h1>
          <h2 className='tablet-bp:text-[32px] mb-3.5 text-xl font-semibold'>
            {placesData?.region?.description || '대한민국의 수도'}
          </h2>
          <p className='text-sub-text-gray tablet-bp:text-base text-sm'>
            {placesData?.region.feature}
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
            {placesData?.popular_subregions?.length > 0 ? (
              // API 데이터 사용
              placesData.popular_subregions.map((subregion) => (
                <li key={subregion.id}>
                  <InfoCard
                    variant='selectable'
                    title={subregion.name}
                    description={subregion.description || ''}
                    details={subregion.feature || ''}
                  />
                </li>
              ))
            ) : (
              // 로딩 중이거나 데이터 없을 때 fallback
              <>
                <li>
                  <InfoCard variant='interactive' />
                </li>
                <li>
                  <InfoCard variant='selectable' title='종로구' />
                </li>
                <li>
                  <InfoCard
                    variant='selectable'
                    title='강남구'
                    description='트렌디한 쇼핑과 엔터테인먼트의 중심지'
                  />
                </li>
                <li>
                  <InfoCard
                    variant='selectable'
                    title='홍대입구'
                    description='젊음과 예술이 넘치는 문화의 거리'
                  />
                </li>
              </>
            )}
          </ul>
          <div className='mt-2 flex w-full justify-end'>
            <button className='cursor-pointer font-medium'>
              {t('places.explore_all_districts')}
            </button>
          </div>
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
            {placesData.major_places?.length > 0 ? (
              placesData.major_places.slice(0, 4).map((place) => (
                <li key={place.id}>
                  <InfoCard
                    variant='interactive'
                    title={place.name}
                    description={place.description}
                    details={place.feature}
                  />
                </li>
              ))
            ) : (
              // 데이터가 없을 때 기본 카드들
              <>
                <li>
                  <InfoCard variant='interactive' />
                </li>
                <li>
                  <InfoCard
                    variant='interactive'
                    title='경복궁'
                    description='조선시대 왕궁 한복입고 방문시 어쩌고'
                    details='오전9시 ~ 6시 3호선 경복궁 역 '
                  />
                </li>
                <li>
                  <InfoCard
                    variant='selectable'
                    title='경복궁'
                    description='조선시대 왕궁 한복입고 방문시 어쩌고'
                    details='오전9시 ~ 6시 3호선 경복궁 역 '
                  />
                </li>
                <li>
                  <InfoCard
                    variant='selectable'
                    title='경복궁'
                    description='조선시대 왕궁 한복입고 방문시 어쩌고'
                    details='오전9시 ~ 6시 3호선 경복궁 역 '
                  />
                </li>
              </>
            )}
          </ul>
          <div className='mt-2 flex w-full justify-end'>
            <button className='cursor-pointer font-medium'>
              {t('common.view_all')}
            </button>
          </div>
        </div>

        {/* 사용자 추천 명소 섹션 */}
        {placesData.user_recommended_places && (
          <div className='mt-7'>
            <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
              {t('places.recommended_spots_for_user')}
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
              {placesData.user_recommended_places.slice(0, 3).map((place) => (
                <li key={place.id}>
                  <InfoCard
                    variant='selectable'
                    title={place.name}
                    description={place.description}
                    details={place.feature}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 숙박 시설 섹션 - 현재는 하드코딩 유지 */}
        <div className='my-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.recommended_accommodations')}
          </h2>
          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-7 grid grid-cols-1 gap-4'>
            <li>
              <InfoCard variant='selectable' />
            </li>
            <li>
              <InfoCard
                variant='selectable'
                title='경복궁'
                description='조선시대 왕궁 한복입고 방문시 어쇼고'
                details='오전9시 ~ 6시 3호선 경복궁 역 '
              />
            </li>
            <li>
              <InfoCard
                variant='selectable'
                title='경복궁'
                description='조선시대 왕궁 한복입고 방문시 어쩌고'
                details='오전9시 ~ 6시 3호선 경복궁 역 '
              />
            </li>
            <li>
              <InfoCard
                variant='selectable'
                title='경복궁'
                description='조선시대 왕궁 한복입고 방문시 어쩌고'
                details='오전9시 ~ 6시 3호선 경복궁 역 '
              />
            </li>
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
    </div>
  );
};

export default RegionsPage;
