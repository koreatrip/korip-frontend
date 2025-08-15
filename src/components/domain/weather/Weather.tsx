import useWeather from '@/hooks/useWeather';
import { useLocationStore, type Location } from '@/stores/useLocationStore';
import WeatherDetail from './WeatherDetail';
import HourlyForecast from './HourlyForecast';
import AirQuality from './AirQuality';
import WeatherSkeleton from './WeatherSkeleton';
import { useTranslation } from 'react-i18next';

const WeatherDisplay = ({ location }: { location: Location }) => {
  console.log('✅ 4. WeatherDisplay: 최종적으로 받은 location prop', location);
  const { weatherData, loading, error } = useWeather(location);
  const { t } = useTranslation();

  if (loading) return <WeatherSkeleton />;
  if (error)
    return <div className='p-4 text-center text-red-500'>{error.message}</div>;
  if (!weatherData)
    return (
      <div className='p-4 text-center text-gray-500'>
        날씨 데이터를 표시할 수 없습니다.
      </div>
    );

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
        <div className='tablet-bp:flex-row tablet-bp:justify-center tablet-bp:gap-x-[142px] tablet-bp:gap-y-0 flex w-full flex-col gap-y-6'>
          {/* 현재 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>
              {t('common.current')} {today}
            </div>
            <div className='mb-2 text-6xl font-semibold'>
              {weatherData.current.temp}°
            </div>
            <div className='text-center'>
              <p>
                <span className='text-xl font-medium'>
                  {weatherData.current.sky}
                </span>
              </p>
              <p>
                {t('common.min')}{' '}
                <span className='text-xl font-medium'>
                  {weatherData.current.minTemp}°
                </span>{' '}
                {t('common.max')}{' '}
                <span className='text-xl font-medium'>
                  {weatherData.current.maxTemp}°
                </span>
              </p>
            </div>
          </div>

          {/* 구분선 - 태블릿 이상에서만 세로선, 모바일에서는 가로선 */}
          <div className='bg-ph-gray tablet-bp:h-auto tablet-bp:w-[1px] h-[1px] w-full'></div>

          {/* 내일 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>
              {t('common.tomorrow')} {tomorrow}
            </div>
            <div className='mb-1'>
              {t('common.min')} {t('common.max')}
            </div>
            <div className='mb-2 text-5xl font-semibold'>
              {weatherData.tomorrow.minTemp}°<span className='text-3xl'>/</span>{' '}
              {weatherData.tomorrow.maxTemp}°
            </div>
            <div className='text-sm'>
              <div>
                {t('common.am')} {weatherData.tomorrow.am.sky}{' '}
                {weatherData.tomorrow.am.pop}%
              </div>
              <div>
                {t('common.pm')} {weatherData.tomorrow.pm.sky}{' '}
                {weatherData.tomorrow.pm.pop}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className='w-full overflow-x-auto'>
        <ul className='tablet-bp:gap-x-4 tablet-bp:min-w-0 flex min-w-max gap-x-3'>
          {weatherData.details.map((detail, index) => (
            <li key={index} className='tablet-bp:flex-1 flex-shrink-0'>
              <WeatherDetail label={detail.label} value={detail.value} />
            </li>
          ))}
        </ul>
      </div>

      {/* 시간별 예보 */}
      <HourlyForecast data={weatherData.hourly} />

      {/* 대기질 */}
      {weatherData.airQuality && <AirQuality data={weatherData.airQuality} />}
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
