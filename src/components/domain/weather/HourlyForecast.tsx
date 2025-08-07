import { useTranslation } from 'react-i18next';

// src/components/domain/weather/HourlyForecast.tsx
interface HourlyData {
  time: string;
  icon: string;
  temp: string;
  pop?: string;
}
interface HourlyForecastProps {
  data: HourlyData[];
}
const HourlyForecast = ({ data }: HourlyForecastProps) => {
  const { t } = useTranslation();
  return (
    <div className='bg-bg-section mb-6 rounded-2xl p-8'>
      <h3 className='text-main-text-navy mb-6 text-xl font-semibold'>
        {t('weather.hourly_forecast')}
      </h3>
      <div className='flex gap-6 overflow-x-auto pb-2'>
        {data.map((hour, index) => (
          <div key={index} className='min-w-16 flex-shrink-0 text-center'>
            <div className='mb-3 text-sm opacity-70'>{hour.time}</div>
            <div className='mb-3 text-3xl'>{hour.icon}</div>
            <div className='mb-1 text-lg font-semibold'>{hour.temp}°</div>
            {hour.pop && hour.pop !== '0' && (
              <div className='text-sub-text-gray text-xs opacity-70'>
                {hour.pop}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default HourlyForecast;
