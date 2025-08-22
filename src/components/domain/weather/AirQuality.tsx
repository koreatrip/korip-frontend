// src/components/domain/weather/AirQuality.tsx
import { getAirQualityInfo } from '@/utils/weatherUtils';
import { useTranslation } from 'react-i18next';

interface AirQualityData {
  pm10_grade: string;
  pm10_value: number;
  pm25_grade: string;
  pm25_value: number;
}
interface AirQualityProps {
  data: AirQualityData;
}
const AirQuality = ({ data }: AirQualityProps) => {
  const pm10Info = getAirQualityInfo(data.pm10_grade);
  const pm25Info = getAirQualityInfo(data.pm25_grade);
  const { t } = useTranslation();

  return (
    <div className='bg-bg-section tablet-bp:p-6 rounded-2xl p-4'>
      <h3 className='text-main-text-navy tablet-bp:mb-4 tablet-bp:text-lg mb-3 text-base font-semibold'>
        {t('weather.air_quality_info')}
      </h3>
      <div className='tablet-bp:gap-x-4 flex gap-x-2'>
        <div
          className={`tablet-bp:p-[26px] flex-1 rounded-2xl p-4 ${pm25Info.color}`}
        >
          <div className='flex flex-col gap-y-1'>
            <span className='text-sub-text-gray tablet-bp:text-sm text-xs'>
              {t('weather.fine_dust')}
            </span>
            <span className='text-sub-green tablet-bp:text-lg text-base font-semibold'>
              {pm25Info.text}
            </span>
          </div>
          <div className='text-xs break-words opacity-60'>
            PM2.5: {data.pm25_value}µg/m³
          </div>
        </div>
        <div
          className={`tablet-bp:p-[26px] flex-1 rounded-2xl p-4 ${pm10Info.color}`}
        >
          <div className='flex flex-col gap-y-1'>
            <span className='text-sub-text-gray tablet-bp:text-sm text-xs'>
              {t('weather.ultrafine_dust')}
            </span>
            <span className='text-sub-green tablet-bp:text-lg text-base font-semibold'>
              {pm10Info.text}
            </span>
          </div>
          <div className='text-xs break-words opacity-60'>
            PM10: {data.pm10_value}µg/m³
          </div>
        </div>
      </div>
    </div>
  );
};
export default AirQuality;
