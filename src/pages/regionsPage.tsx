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
          <h1 className='mb-4 text-4xl font-semibold'>
            {/* 임시로 하드코딩 */}
            서울
            {/* {regionDetail?.regions[0]?.name} */}
          </h1>
          <h2 className='mb-3.5 text-[32px] font-semibold'>
            전통과 현대가 공존하는 도시
          </h2>
          <p className='text-sub-text-gray'>
            서울은 대한민국의 수도이자, 문화·경제·정치의 중심지입니다.
            <br /> 고궁과 한옥마을, 현대적인 쇼핑몰과 마천루, 트렌디한 카페
            골목과 전통시장까지 다양한 매력을 하루 안에 모두 경험할 수 있는
            도시입니다.
          </p>
        </div>
        <div className='mt-[60px] flex flex-col'>
          <h1 className='mb-4 text-[32px] font-semibold'>
            {getLocationDisplayName()}
          </h1>
          {/* 검색된 위치 정보 표시 */}
          {activeLocation && activeLocation.searchedQuery && (
            <div className='text-sub-text-gray mb-4 text-sm'>
              "{activeLocation.searchedQuery}" 검색 결과 →{' '}
              {activeLocation.displayName ||
                `${activeLocation['1단계']} ${activeLocation['2단계']} ${activeLocation['3단계'] || ''}`.trim()}
            </div>
          )}
          <div className='flex justify-center'>
            <Weather />
          </div>
        </div>
        <div className='mt-16'>
          <h2 className='text-[32px] font-semibold'>인기 구역 정보</h2>
          <ul className='mt-7 grid grid-cols-4 gap-4'>
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
              전체 구 둘러보기
            </button>
          </div>
        </div>
        <h1 className='mt-14 text-4xl font-semibold'>
          지금은 {getCurrentRegionName()}만 보고있어요
        </h1>
        <div className='mt-16'>
          <h2 className='text-[32px] font-semibold'>주요 명소</h2>
          <ul className='mt-7 grid grid-cols-4 gap-4'>
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
            <button className='cursor-pointer font-medium'>모두보기</button>
          </div>
        </div>
        <div className='mt-7'>
          <h2 className='text-[32px] font-semibold'>
            박원빈님을 위한 추천 장소
          </h2>
          <p className='text-sub-text-gray'>
            회원님의 관심사 <span className='font-medium'>k-pop,맛집/카페</span>
            를 바탕으로 선별했습니다.
          </p>
          <ul className='mt-7 grid grid-cols-3 gap-4'>
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
          <h2 className='text-[32px] font-semibold'>여행자를 위한 추천 숙소</h2>
          <ul className='mt-7 grid grid-cols-4 gap-4'>
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
            <button className='cursor-pointer font-medium'>모두보기</button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RegionsPage;
