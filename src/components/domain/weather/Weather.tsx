import useWeather from '@/hooks/useWeather';
import { useLocationStore, type Location } from '@/stores/useLocationStore';
import WeatherDetail from './WeatherDetail';
import HourlyForecast from './HourlyForecast';
import AirQuality from './AirQuality';
import WeatherSkeleton from './WeatherSkeleton';

const WeatherDisplay = ({ location }: { location: Location }) => {
  console.log('✅ 4. WeatherDisplay: 최종적으로 받은 location prop', location);
  const { weatherData, loading, error } = useWeather(location);

  if (loading) return <WeatherSkeleton />;
  if (error)
    return <div className='p-4 text-center text-red-500'>{error.message}</div>;
  if (!weatherData)
    return (
      <div className='p-4 text-center text-gray-500'>
        날씨 데이터를 표시할 수 없습니다.
      </div>
    );

  // const tempDiffText =
  //   weatherData.current.tempDiff !== null
  //     ? `어제보다 ${weatherData.current.tempDiff > 0 ? `${weatherData.current.tempDiff.toFixed(1)}°↑` : `${Math.abs(weatherData.current.tempDiff).toFixed(1)}°↓`}`
  //     : '';

  const today = new Date().toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  });
  const tomorrow = new Date(
    new Date().setDate(new Date().getDate() + 1)
  ).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <div className='bg-bg-section text-main-text-navy flex items-center justify-center rounded-2xl p-6'>
        <div className='flex w-full justify-center gap-x-[142px]'>
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>현재 {today}</div>
            <div className='mb-2 text-6xl font-semibold'>
              {weatherData.current.temp}°
            </div>
            <div className='text-center'>
              <p>
                <span className='text-xl font-medium'>
                  {weatherData.current.sky}
                </span>{' '}
                {/* {tempDiffText} */}
              </p>
              <p>
                최저{' '}
                <span className='text-xl font-medium'>
                  {weatherData.current.minTemp}°
                </span>{' '}
                최고{' '}
                <span className='text-xl font-medium'>
                  {weatherData.current.maxTemp}°
                </span>
              </p>
            </div>
          </div>
          <div className='bg-ph-gray w-[1px]'></div>
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>내일 {tomorrow}</div>
            <div className='mb-1'>최저 최고</div>
            <div className='mb-2 text-5xl font-semibold'>
              {weatherData.tomorrow.minTemp}°<span className='text-3xl'>/</span>{' '}
              {weatherData.tomorrow.maxTemp}°
            </div>
            <div className='text-sm'>
              <div>
                오전 {weatherData.tomorrow.am.sky}
                {weatherData.tomorrow.am.pop}%
              </div>
              <div>
                오후 {weatherData.tomorrow.pm.sky}
                {weatherData.tomorrow.pm.pop}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className='flex w-full gap-x-4'>
        {weatherData.details.map((detail, index) => (
          <li key={index} className='flex-1'>
            <WeatherDetail label={detail.label} value={detail.value} />
          </li>
        ))}
      </ul>
      <HourlyForecast data={weatherData.hourly} />
      <div className='grid grid-cols-2 gap-6'>
        {weatherData.airQuality && <AirQuality data={weatherData.airQuality} />}
      </div>
    </div>
  );
};

const Weather = () => {
  const activeLocation = useLocationStore((state) => state.activeLocation);
  console.log('✅ 3. Weather 래퍼: 스토어에서 받은 현재 위치', activeLocation);

  if (!activeLocation) {
    return <WeatherSkeleton />;
  }
  return <WeatherDisplay location={activeLocation} />;
};

export default Weather;
