import InfoCard from '@/components/domain/regions/InfoCard';
import Carousel from '@/components/domain/regions/Carousel';
import Weather from '@/components/domain/weather/Weather';
import Container from '@/components/common/Container';

const RegionsPage = () => {
  return (
    <div className='mt-8 w-full'>
      <Container>
        <Carousel />
        <div className='mt-[60px] flex flex-col'>
          <h1 className='mb-4 text-4xl font-semibold'>서울</h1>
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
          <h1 className='mb-4 text-[32px] font-semibold'>서울 날씨</h1>
          <div className='flex justify-center'>
            <Weather />
          </div>
        </div>
        <div className='mt-16'>
          <h2 className='text-[32px] font-semibold'>인기 구역 정보</h2>
          <ul className='mt-7 grid grid-cols-4 gap-4'>
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
          지금은 강남구만 보고있어요
        </h1>
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
      </Container>
    </div>
  );
};

export default RegionsPage;
