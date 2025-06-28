const AirQuality = () => {
  return (
    <div className='bg-bg-section rounded-2xl p-6'>
      <h3 className='text-main-text-navy mb-4 text-lg font-semibold'>
        대기질 정보
      </h3>
      <div className='flex gap-x-4'>
        <div className='flex-1 rounded-2xl bg-[#E8F4F2]/50 p-[26px]'>
          <div className='flex flex-col gap-y-1'>
            <span className='text-sub-text-gray text-sm'>미세먼지</span>
            <span className='text-sub-green text-lg font-semibold'>좋음</span>
          </div>
          <div className='text-xs opacity-60'>PM2.5: 15μg/m³</div>
        </div>
        <div className='flex-1 rounded-2xl bg-[#E8F4F2]/50 p-[26px]'>
          <div className='flex flex-col gap-y-1'>
            <span className='text-sub-text-gray text-sm'>초미세먼지</span>
            <span className='text-sub-green text-lg font-semibold'>좋음</span>
          </div>
          <div className='text-xs opacity-60'>PM10: 30μg/m³</div>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;
