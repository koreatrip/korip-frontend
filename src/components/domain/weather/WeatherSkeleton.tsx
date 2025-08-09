const WeatherSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-y-4'>
      {/* 메인 날씨 섹션 */}
      <div className='bg-bg-section text-main-text-navy flex items-center justify-center rounded-2xl p-4 md:p-6'>
        {/* 모바일 레이아웃 (768px 미만) */}
        <div className='flex w-full flex-col gap-y-6 md:hidden'>
          {/* 현재 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2 h-5 w-16 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-2 h-16 w-24 animate-pulse rounded bg-gray-200'></div>
            <div className='space-y-2 text-center'>
              <div className='mx-auto h-5 w-32 animate-pulse rounded bg-gray-200'></div>
              <div className='mx-auto h-5 w-28 animate-pulse rounded bg-gray-200'></div>
            </div>
          </div>

          {/* 구분선 */}
          <div className='bg-ph-gray h-[1px] w-full'></div>

          {/* 내일 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2 h-5 w-16 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-1 h-4 w-12 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-2 h-12 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='space-y-1'>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
            </div>
          </div>
        </div>

        {/* 태블릿/데스크톱 레이아웃 (768px 이상) */}
        <div className='hidden w-full justify-center gap-x-8 md:flex lg:gap-x-[142px]'>
          {/* 현재 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2 h-6 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-2 h-16 w-28 animate-pulse rounded bg-gray-200 lg:h-20 lg:w-32'></div>
            <div className='space-y-2 text-center'>
              <div className='mx-auto h-5 w-32 animate-pulse rounded bg-gray-200 lg:h-6 lg:w-40'></div>
              <div className='mx-auto h-5 w-28 animate-pulse rounded bg-gray-200 lg:h-6 lg:w-36'></div>
            </div>
          </div>

          {/* 구분선 */}
          <div className='bg-ph-gray w-[1px]'></div>

          {/* 내일 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2 h-6 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-1 h-5 w-16 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-2 h-14 w-24 animate-pulse rounded bg-gray-200 lg:h-16 lg:w-28'></div>
            <div className='space-y-1'>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200 lg:w-24'></div>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200 lg:w-24'></div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 6개 */}
      <div className='flex w-full gap-x-2 md:gap-x-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='flex-1'>
            <div className='bg-bg-section flex flex-col items-center justify-center gap-y-1 rounded-2xl p-2 md:gap-y-2 md:p-4'>
              <div className='h-3 w-6 animate-pulse rounded bg-gray-200 md:h-4 md:w-12'></div>
              <div className='h-4 w-8 animate-pulse rounded bg-gray-200 md:h-6 md:w-16'></div>
            </div>
          </div>
        ))}
      </div>

      {/* 시간별 예보 */}
      <div className='bg-bg-section rounded-2xl p-4 md:p-6'>
        <div className='mb-3 h-5 w-16 animate-pulse rounded bg-gray-200 md:mb-4 md:h-6 md:w-20'></div>
        <div className='flex gap-x-2 overflow-x-auto md:gap-x-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className='flex min-w-[50px] flex-col items-center gap-y-1 md:min-w-[60px] md:gap-y-2'
            >
              <div className='h-3 w-6 animate-pulse rounded bg-gray-200 md:h-4 md:w-8'></div>
              <div className='h-6 w-6 animate-pulse rounded-full bg-gray-200 md:h-8 md:w-8'></div>
              <div className='h-3 w-6 animate-pulse rounded bg-gray-200 md:h-4 md:w-8'></div>
              <div className='h-2 w-4 animate-pulse rounded bg-gray-200 md:h-3 md:w-6'></div>
            </div>
          ))}
        </div>
      </div>

      {/* 대기질 정보 */}
      <div className='flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6'>
        <div className='bg-bg-section rounded-2xl p-4 md:p-6'>
          <div className='space-y-3'>
            <div className='h-5 w-12 animate-pulse rounded bg-gray-200 md:h-6 md:w-16'></div>
            <div className='flex items-center justify-between'>
              <div className='space-y-2'>
                <div className='h-3 w-8 animate-pulse rounded bg-gray-200 md:h-4 md:w-12'></div>
                <div className='h-5 w-6 animate-pulse rounded bg-gray-200 md:h-6 md:w-8'></div>
              </div>
              <div className='space-y-2'>
                <div className='h-3 w-8 animate-pulse rounded bg-gray-200 md:h-4 md:w-12'></div>
                <div className='h-5 w-6 animate-pulse rounded bg-gray-200 md:h-6 md:w-8'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSkeleton;
