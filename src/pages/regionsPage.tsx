import InfoCard from '@/components/domain/regions/InfoCard';
import Carousel from '@/components/domain/regions/Carousel';
import Weather from '@/components/domain/weather/Weather';
import Container from '@/components/common/Container';
// import {
//   useGetRegionDetailQuery,
//   useGetRegionsQuery,
// } from '@/api/regions/regionHooks';
import { useLocationStore } from '@/stores/useLocationStore';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const RegionsPage = () => {
  // regions API 호출 주석 처리 (MSW에서 지원 안 함)
  // const {
  //   data: regions,
  //   isLoading: isRegionsLoading,
  //   error: regionsError,
  // } = useGetRegionsQuery();
  // const {
  //   data: regionDetail,
  //   isLoading: isDetailLoading,
  //   error: detailError,
  // } = useGetRegionDetailQuery(1);

  const activeLocation = useLocationStore((state) => state.activeLocation);
  const searchAndSetLocation = useLocationStore(
    (state) => state.searchAndSetLocation
  );
  const { showToast } = useToast();
  const { t } = useTranslation();

  console.log('✅ 2. 페이지: 스토어에서 받은 현재 위치', activeLocation);

  // 앱이 처음 시작될 때 기본 위치를 '종로구'로 설정
  useEffect(() => {
    if (!activeLocation) {
      searchAndSetLocation('종로구', showToast);
    }
  }, [activeLocation, searchAndSetLocation, showToast]);

  // 위치 표시명 결정 함수
  const getLocationDisplayName = () => {
    if (!activeLocation) return '날씨 정보';

    // displayName이 있으면 우선 사용
    if (activeLocation.displayName) {
      return `${activeLocation.displayName} 날씨`;
    }

    // 기본 로직
    if (activeLocation['3단계']) {
      return `${activeLocation['1단계']} ${activeLocation['2단계']} ${activeLocation['3단계']} 날씨`;
    } else if (activeLocation['2단계']) {
      return `${activeLocation['1단계']} ${activeLocation['2단계']} 날씨`;
    } else {
      return `${activeLocation['1단계']} 날씨`;
    }
  };

  // 현재 보고 있는 지역명 결정
  const getCurrentRegionName = () => {
    if (!activeLocation) return '지역을 선택해주세요';

    if (activeLocation.displayName) {
      return activeLocation.displayName;
    }

    if (activeLocation['2단계']) {
      return activeLocation['2단계'];
    } else {
      return activeLocation['1단계'];
    }
  };

  // 로딩 및 에러 처리 주석 처리
  // if (isRegionsLoading || isDetailLoading) {
  //   return <div>로딩 중입니다...</div>;
  // }

  // if (regionsError || detailError) {
  //   return <div>에러가 발생했습니다.</div>;
  // }

  return (
    <div className='mt-8 w-full'>
      <Container>
        <Carousel />
        <div className='mt-[60px] flex flex-col'>
          <h1 className='tablet-bp:text-4xl mb-4 text-2xl font-semibold'>
            {/* 임시로 하드코딩 */}
            서울
            {/* {regionDetail?.regions[0]?.name} */}
          </h1>
          <h2 className='tablet-bp:text-[32px] mb-3.5 text-xl font-semibold'>
            전통과 현대가 공존하는 도시
          </h2>
          <p className='text-sub-text-gray tablet-bp:text-base text-sm'>
            서울은 대한민국의 수도이자, 문화·경제·정치의 중심지입니다.
            <br /> 고궁과 한옥마을, 현대적인 쇼핑몰과 마천루, 트렌디한 카페
            골목과 전통시장까지 다양한 매력을 하루 안에 모두 경험할 수 있는
            도시입니다.
          </p>
        </div>
        <div className='mt-[60px] flex flex-col'>
          <h1 className='tablet-bp:text-[32px] mb-4 text-xl font-semibold'>
            {getLocationDisplayName()}
          </h1>
          {/* 검색된 위치 정보 표시 */}
          {activeLocation && activeLocation.searchedQuery && (
            <div className='text-sub-text-gray mb-4 text-sm'>
              "{activeLocation.searchedQuery}" {t('common.search_result')} →{' '}
              {activeLocation.displayName ||
                `${activeLocation['1단계']} ${activeLocation['2단계']} ${activeLocation['3단계'] || ''}`.trim()}
            </div>
          )}
          <div className='flex justify-center'>
            <Weather />
          </div>
        </div>
        <div className='mt-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.popular_area_info')}
          </h2>
          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-7 grid grid-cols-1 gap-4'>
            <li>
              <InfoCard variant='interactive' />
            </li>
            <li>
              <InfoCard
                variant='selectable'
                title='종로구'
                // description='조선시대 왕궁 한복입고 방문시 어쩌고'
                // details='오전9시 ~ 6시 3호선 경복궁 역 '
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
        <div className='mt-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {t('places.main_attractions')}
          </h2>
          <ul className='tablet-bp:grid-cols-2 desktop-bp:grid-cols-4 mt-7 grid grid-cols-1 gap-4'>
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
          </ul>
          <div className='mt-2 flex w-full justify-end'>
            <button className='cursor-pointer font-medium'>
              {t('common.view_all')}
            </button>
          </div>
        </div>
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
            <li>
              <InfoCard variant='selectable' />
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
        </div>
        <div className='my-16'>
          <h2 className='tablet-bp:text-[32px] text-xl font-semibold'>
            {' '}
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
              {' '}
              {t('common.view_all')}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RegionsPage;
