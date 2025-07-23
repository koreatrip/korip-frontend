// src/components/domain/weather/WeatherDetail.tsx
type WeatherDetailProps = {
  label: string;
  value: string;
};
const WeatherDetail = ({ label, value }: WeatherDetailProps) => {
  return (
    <div className='bg-bg-section border-outline-gray flex w-full flex-col items-center justify-center rounded-2xl border px-8 py-4'>
      <p className='text-sub-text-gray'>{label}</p>
      <p className='text-[20px] font-medium'>{value}</p>
    </div>
  );
};
export default WeatherDetail;
