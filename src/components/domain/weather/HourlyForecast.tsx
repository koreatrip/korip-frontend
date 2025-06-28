const HourlyForecast = () => {
  return (
    <div className='bg-bg-section mb-6 rounded-2xl p-8'>
      <h3 className='text-main-text-navy mb-6 text-xl font-semibold'>
        시간별 예보
      </h3>
      <div className='flex gap-6 overflow-x-auto pb-2'>
        {/* <!-- 2시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>2시</div>
          <div className='mb-3 text-3xl'>☁️</div>
          <div className='mb-1 text-lg font-semibold'>19°</div>
        </div>
        {/* <!-- 2시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>2시</div>
          <div className='mb-3 text-3xl'>☁️</div>
          <div className='mb-1 text-lg font-semibold'>19°</div>
        </div>
        {/* <!-- 4시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>4시</div>
          <div className='mb-3 text-3xl'>☁️</div>
          <div className='mb-1 text-lg font-semibold'>20°</div>
        </div>
        {/* <!-- 5시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>5시</div>
          <div className='mb-3 text-3xl'>☁️</div>
          <div className='mb-1 text-lg font-semibold'>20°</div>
        </div>
        {/* <!-- 6시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>6시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>20°</div>
        </div>
        {/* <!-- 7시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>7시</div>
          <div className='mb-3 text-3xl'>☁️</div>
          <div className='mb-1 text-lg font-semibold'>21°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>30%</div>
        </div>
        {/* <!-- 8시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>8시</div>
          <div className='mb-3 text-3xl'>🌧️</div>
          <div className='mb-1 text-lg font-semibold'>22°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>20%</div>
        </div>
        {/* <!-- 9시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>9시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>24°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>20%</div>
        </div>
        {/* <!-- 10시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>10시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>25°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>20%</div>
        </div>
        {/* <!-- 11시 - Highlighted --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>11시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>25°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>20%</div>
        </div>
        {/* <!-- 12시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>12시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>26°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>20%</div>
        </div>
        {/* <!-- 13시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>13시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>27°</div>
          <div className='text-sub-text-gray text-xs opacity-70'>20%</div>
        </div>
        {/* <!-- 14시 --> */}
        <div className='min-w-16 flex-shrink-0 text-center'>
          <div className='mb-3 text-sm opacity-70'>14시</div>
          <div className='mb-3 text-3xl'>☀️</div>
          <div className='mb-1 text-lg font-semibold'>27°</div>
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
