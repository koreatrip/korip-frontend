import Carousel from '@/components/regionsCarousel/Carousel';
import Weather from '@/components/weather/Weather';

const RegionsPage = () => {
  return (
    <div className='mt-16'>
      <Carousel />
      <div className='mt-[60px] flex flex-col'>
        <h1 className='mb-4 text-5xl font-semibold'>서울</h1>
        <h2 className='mb-3.5 text-[32px] font-semibold'>
          전통과 현대가 공존하는 도시
        </h2>
        <p className='text-sub-text-gray'>
          서울은 대한민국의 수도이자, 문화·경제·정치의 중심지입니다.
          <br /> 고궁과 한옥마을, 현대적인 쇼핑몰과 마천루, 트렌디한 카페 골목과
          전통시장까지 다양한 매력을 하루 안에 모두 경험할 수 있는 도시입니다.
        </p>
      </div>
      <div className='mt-[60px] flex flex-col'>
        <h1 className='mb-4 text-[32px] font-semibold'>서울 날씨</h1>
        <div className='flex justify-center'>
          <Weather />
        </div>
      </div>
    </div>
  );
};

export default RegionsPage;
