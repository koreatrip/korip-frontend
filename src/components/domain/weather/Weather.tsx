import WeatherDetail from './WeatherDetail';
import HourlyForecast from './HourlyForecast';
import AirQuality from './AirQuality';
import WeatherSkeleton from './WeatherSkeleton';
import { useTranslation } from 'react-i18next';
import { useWeatherQuery } from '@/api/weather/weatherHooks';
import { useNumericSearchParam } from '@/hooks/useNumericSearchParam';

const Weather = () => {
  const { t } = useTranslation();
  const region_id = useNumericSearchParam('region_id'); // number | null
  const subregion_id = useNumericSearchParam('subregion_id'); // number | null

  console.log('Weather 컴포넌트 호출됨:', { region_id, subregion_id });

  const {
    data: weatherData,
    isLoading,
    isError,
    error,
  } = useWeatherQuery(region_id, subregion_id);

  console.log('weatherData:', weatherData);

  if (isLoading) return <WeatherSkeleton />;
  if (isError)
    return (
      <div className='p-4 text-center text-red-500'>
        {error?.message || '날씨 데이터를 불러올 수 없습니다.'}
      </div>
    );
  if (!weatherData)
    return (
      <div className='p-4 text-center text-gray-500'>
        날씨 데이터를 표시할 수 없습니다.
      </div>
    );

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <div className='bg-bg-section text-main-text-navy flex items-center justify-center rounded-2xl p-6'>
        <div className='tablet-bp:flex-row tablet-bp:justify-center tablet-bp:gap-x-[142px] tablet-bp:gap-y-0 flex w-full flex-col gap-y-6'>
          {/* 현재 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>
              {t('common.current')} {weatherData.current_weather.current_date}
            </div>
            <div className='mb-2 text-6xl font-semibold'>
              {weatherData.current_weather.temperature}°
            </div>
            <div className='text-center'>
              <p>
                <span className='text-xl font-medium'>
                  {weatherData.current_weather.weather_condition}
                </span>{' '}
                <span>
                  어제보다 {weatherData.current_weather.temperature_change}
                </span>
              </p>
              <p>
                {t('common.min')}{' '}
                <span className='text-xl font-medium'>
                  {weatherData.current_weather.min_temperature}°
                </span>{' '}
                {t('common.max')}{' '}
                <span className='text-xl font-medium'>
                  {weatherData.current_weather.max_temperature}°
                </span>
              </p>
            </div>
          </div>

          {/* 구분선 - 태블릿 이상에서만 세로선, 모바일에서는 가로선 */}
          <div className='bg-ph-gray tablet-bp:h-auto tablet-bp:w-[1px] h-[1px] w-full'></div>

          {/* 내일 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>
              {t('common.tomorrow')}{' '}
              {weatherData.tomorrow_weather.tomorrow_date}
            </div>
            <div className='mb-1'>
              {t('common.min')} {t('common.max')}
            </div>
            <div className='mb-2 text-5xl font-semibold'>
              {weatherData.tomorrow_weather.min_temperature}°
              <span className='text-3xl'>/</span>{' '}
              {weatherData.tomorrow_weather.max_temperature}°
            </div>
            <div className='text-sm'>
              <div>
                {t('common.am')}{' '}
                {weatherData.tomorrow_weather.morning_condition}{' '}
                {weatherData.tomorrow_weather.morning_precipitation}%
              </div>
              <div>
                {t('common.pm')}{' '}
                {weatherData.tomorrow_weather.afternoon_condition}{' '}
                {weatherData.tomorrow_weather.afternoon_precipitation}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className='w-full overflow-x-auto'>
        <ul className='tablet-bp:gap-x-4 tablet-bp:min-w-0 flex min-w-max gap-x-3'>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='습도'
              value={`${weatherData.detail_info.humidity}%`}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='바람'
              value={`${weatherData.detail_info.wind_speed}m/s`}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='체감온도'
              value={`${weatherData.detail_info.feels_like}°`}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='자외선'
              value={weatherData.detail_info.uv_level}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='일출'
              value={weatherData.detail_info.sunrise}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='일몰'
              value={weatherData.detail_info.sunset}
            />
          </li>
        </ul>
      </div>

      {/* 시간별 예보 */}
      {weatherData.hourly_forecast && (
        <HourlyForecast data={weatherData.hourly_forecast} />
      )}

      {/* 대기질 */}
      {weatherData.air_quality && <AirQuality data={weatherData.air_quality} />}

      {/* 여행 팁 */}
      {weatherData.travel_tip && (
        <div className='bg-bg-section rounded-2xl p-4'>
          <h3 className='text-main-text-navy mb-2 text-lg font-semibold'>
            여행 팁
          </h3>
          <p className='text-sub-text-gray text-sm'>
            {weatherData.travel_tip.tip_message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;
