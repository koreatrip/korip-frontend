// src/components/domain/weather/AirQuality.tsx
import { getAirQualityInfo } from '@/utils/weatherUtils';
import { useTranslation } from 'react-i18next';

interface AirQualityData {
  pm10: { grade: string; value: string };
  pm25: { grade: string; value: string };
}
interface AirQualityProps {
  data: AirQualityData;
}
const AirQuality = ({ data }: AirQualityProps) => {
  const pm10Info = getAirQualityInfo(data.pm10.grade);
  const pm25Info = getAirQualityInfo(data.pm25.grade);
  const { t } = useTranslation();

  return (
    <div className='bg-bg-section rounded-2xl p-6'>
      <h3 className='text-main-text-navy mb-4 text-lg font-semibold'>
        {t('weather.air_quality_info')}
      </h3>
      <div className='flex gap-x-4'>
        <div className={`flex-1 rounded-2xl p-[26px] ${pm25Info.color}`}>
          <div className='flex flex-col gap-y-1'>
            <span className='text-sub-text-gray text-sm'>
              {t('weather.fine_dust')}
            </span>
            <span className='text-sub-green text-lg font-semibold'>
              {pm25Info.text}
            </span>
          </div>
          <div className='text-xs opacity-60'>
            PM2.5: {data.pm25.value}µg/m³
          </div>
        </div>
        <div className={`flex-1 rounded-2xl p-[26px] ${pm10Info.color}`}>
          <div className='flex flex-col gap-y-1'>
            <span className='text-sub-text-gray text-sm'>
              {t('weather.ultrafine_dust')}
            </span>
            <span className='text-sub-green text-lg font-semibold'>
              {pm10Info.text}
            </span>
          </div>
          <div className='text-xs opacity-60'>PM10: {data.pm10.value}µg/m³</div>
        </div>
      </div>
    </div>
  );
};
export default AirQuality;
