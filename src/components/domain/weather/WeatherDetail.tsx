type WeatherDetailProps = {
  label: string;
  value: string;
};

const WeatherDetail = ({ label, value }: WeatherDetailProps) => {
  return (
    <div className='bg-bg-section border-outline-gray tablet-bp:px-8 tablet-bp:py-4 tablet-bp:min-w-0 flex w-full min-w-[120px] flex-col items-center justify-center rounded-2xl border px-4 py-3'>
      <p className='text-sub-text-gray tablet-bp:text-base text-sm'>{label}</p>
      <p className='tablet-bp:text-[20px] text-lg font-medium'>{value}</p>
    </div>
  );
};

export default WeatherDetail;
