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

  // 🔥 안전한 데이터 검증
  if (!weatherData || !weatherData.current_weather) {
    return (
      <div className='p-4 text-center text-gray-500'>
        날씨 데이터를 표시할 수 없습니다.
      </div>
    );
  }

  // 🔥 안전한 데이터 추출
  const currentWeather = weatherData.current_weather || {};
  const tomorrowWeather = weatherData.tomorrow_weather || {};
  const detailInfo = weatherData.detail_info || {};

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <div className='bg-bg-section text-main-text-navy flex items-center justify-center rounded-2xl p-6'>
        <div className='tablet-bp:flex-row tablet-bp:justify-center tablet-bp:gap-x-[142px] tablet-bp:gap-y-0 flex w-full flex-col gap-y-6'>
          {/* 현재 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2'>
              {t('common.current')}{' '}
              {currentWeather.current_date || '날짜 정보 없음'}
            </div>
            <div className='mb-2 text-6xl font-semibold'>
              {currentWeather.temperature || '--'}°
            </div>
            <div className='text-center'>
              <p>
                <span className='text-xl font-medium'>
                  {currentWeather.weather_condition || '정보 없음'}
                </span>{' '}
                {currentWeather.temperature_change && (
                  <span>어제보다 {currentWeather.temperature_change}</span>
                )}
              </p>
              <p>
                {t('common.min')}{' '}
                <span className='text-xl font-medium'>
                  {currentWeather.min_temperature || '--'}°
                </span>{' '}
                {t('common.max')}{' '}
                <span className='text-xl font-medium'>
                  {currentWeather.max_temperature || '--'}°
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
              {tomorrowWeather.tomorrow_date || '날짜 정보 없음'}
            </div>
            <div className='mb-1'>
              {t('common.min')} {t('common.max')}
            </div>
            <div className='mb-2 text-5xl font-semibold'>
              {tomorrowWeather.min_temperature || '--'}°
              <span className='text-3xl'>/</span>{' '}
              {tomorrowWeather.max_temperature || '--'}°
            </div>
            <div className='text-sm'>
              <div>
                {t('common.am')}{' '}
                {tomorrowWeather.morning_condition || '정보 없음'}{' '}
                {tomorrowWeather.morning_precipitation || 0}%
              </div>
              <div>
                {t('common.pm')}{' '}
                {tomorrowWeather.afternoon_condition || '정보 없음'}{' '}
                {tomorrowWeather.afternoon_precipitation || 0}%
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
              value={`${detailInfo.humidity || '--'}%`}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='바람'
              value={`${detailInfo.wind_speed || '--'}m/s`}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='체감온도'
              value={`${detailInfo.feels_like || '--'}°`}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail
              label='자외선'
              value={detailInfo.uv_level || '정보 없음'}
            />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail label='일출' value={detailInfo.sunrise || '--:--'} />
          </li>
          <li className='tablet-bp:flex-1 flex-shrink-0'>
            <WeatherDetail label='일몰' value={detailInfo.sunset || '--:--'} />
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
