import AirQuality from './AirQuality';
import HourlyForecast from './HourlyForecast';
import TravelTips from './TravelTips';
import WeatherDetail from './WeatherDetail';

const Weather = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <div className='bg-bg-section text-main-text-navy flex items-center justify-center rounded-2xl p-6'>
        <div className='flex w-full justify-center gap-x-[142px]'>
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>현재 06.09</div>
            <div className='mb-2 text-6xl font-semibold'>19°</div>
            <div className=''>
              <p>
                <span className='text-xl font-medium'>맑음</span> 어제보다 0.8°↓
              </p>
              <p>
                최저 <span className='text-xl font-medium'>19°</span> 최고{' '}
                <span className='text-xl font-medium'>27°</span>
              </p>
            </div>
          </div>
          <div className='bg-ph-gray w-[1px]'></div>
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>내일 06.10</div>
            <div className='mb-1'>최저 최고</div>
            <div className='mb-2 text-5xl font-semibold'>
              19° <span className='text-3xl'>/</span> 30°
            </div>
            <div>
              <div>
                오전 ❄ <span>맑음</span> ☔ 0%
              </div>
              <div>
                오후 ❄ <span>맑음</span> ☔ 0%
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className='flex w-full gap-x-4'>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
        <li className='flex-1'>
          <WeatherDetail />
        </li>
      </ul>
      <HourlyForecast />
      <div className='grid grid-cols-2 gap-6'>
        <AirQuality />
        <TravelTips />
      </div>
    </div>
  );
};

export default Weather;
