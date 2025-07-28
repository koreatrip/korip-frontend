const WeatherSkeleton = () => {
  return (
    <div className='flex w-full flex-col gap-y-4'>
      {/* 메인 날씨 섹션 */}
      <div className='bg-bg-section text-main-text-navy flex items-center justify-center rounded-2xl p-6'>
        <div className='flex w-full justify-center gap-x-[142px]'>
          {/* 현재 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2 h-6 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-2 h-20 w-32 animate-pulse rounded bg-gray-200'></div>
            <div className='space-y-2 text-center'>
              <div className='mx-auto h-6 w-40 animate-pulse rounded bg-gray-200'></div>
              <div className='mx-auto h-6 w-36 animate-pulse rounded bg-gray-200'></div>
            </div>
          </div>

          {/* 구분선 */}
          <div className='bg-ph-gray w-[1px]'></div>

          {/* 내일 날씨 */}
          <div className='flex flex-col items-center justify-center'>
            <div className='mb-2 h-6 w-20 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-1 h-5 w-16 animate-pulse rounded bg-gray-200'></div>
            <div className='mb-2 h-16 w-28 animate-pulse rounded bg-gray-200'></div>
            <div className='space-y-1'>
              <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
              <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 6개 */}
      <ul className='flex w-full gap-x-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className='flex-1'>
            <div className='bg-bg-section flex flex-col items-center justify-center gap-y-2 rounded-2xl p-4'>
              <div className='h-4 w-12 animate-pulse rounded bg-gray-200'></div>
              <div className='h-6 w-16 animate-pulse rounded bg-gray-200'></div>
            </div>
          </li>
        ))}
      </ul>

      {/* 시간별 예보 */}
      <div className='bg-bg-section rounded-2xl p-6'>
        <div className='mb-4 h-6 w-20 animate-pulse rounded bg-gray-200'></div>
        <div className='flex gap-x-4 overflow-x-auto'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className='flex min-w-[60px] flex-col items-center gap-y-2'
            >
              <div className='h-4 w-8 animate-pulse rounded bg-gray-200'></div>
              <div className='h-8 w-8 animate-pulse rounded-full bg-gray-200'></div>
              <div className='h-4 w-8 animate-pulse rounded bg-gray-200'></div>
              <div className='h-3 w-6 animate-pulse rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      </div>

      {/* 대기질 정보 */}
      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-bg-section rounded-2xl p-6'>
          <div className='space-y-3'>
            <div className='h-6 w-16 animate-pulse rounded bg-gray-200'></div>
            <div className='flex items-center justify-between'>
              <div className='space-y-2'>
                <div className='h-4 w-12 animate-pulse rounded bg-gray-200'></div>
                <div className='h-6 w-8 animate-pulse rounded bg-gray-200'></div>
              </div>
              <div className='space-y-2'>
                <div className='h-4 w-12 animate-pulse rounded bg-gray-200'></div>
                <div className='h-6 w-8 animate-pulse rounded bg-gray-200'></div>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-bg-section rounded-2xl p-6'>
          <div className='h-32 w-full animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSkeleton;
