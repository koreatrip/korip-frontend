const ProfileCardSkeleton = () => {
  return (
    <div className='mb-6 w-full rounded-lg bg-white p-6 shadow-md'>
      {/* 타이틀 */}
      <div className='mb-6 h-8 w-48 animate-pulse rounded bg-gray-200' />

      {/* BasicInfoSection 스켈레톤 */}
      <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='h-6 w-24 animate-pulse rounded bg-gray-200' />
          <div className='h-8 w-16 animate-pulse rounded bg-gray-200' />
        </div>
        <div className='space-y-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-40 animate-pulse rounded bg-gray-200' />
            </div>
          ))}
        </div>
      </section>

      {/* AccountStatsSection 스켈레톤 */}
      <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
        <div className='mb-4 h-6 w-24 animate-pulse rounded bg-gray-200' />
        <div className='mb-4 flex items-center justify-between'>
          <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
          <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
        </div>
        <hr className='border-outline-gray -mt-2 mb-4 border-t' />
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='border-outline-gray flex flex-col items-center gap-2 rounded-md border bg-white p-4'
            >
              <div className='h-6 w-10 animate-pulse rounded bg-gray-200' />
              <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
            </div>
          ))}
        </div>
      </section>

      {/* SecuritySection 스켈레톤 */}
      <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
        <div className='mb-4 h-6 w-24 animate-pulse rounded bg-gray-200' />
        <div className='space-y-4'>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <div className='flex items-center justify-between'>
                <div className='h-4 w-20 animate-pulse rounded bg-gray-200' />
                <div className='h-4 w-24 animate-pulse rounded bg-gray-200' />
              </div>
              <hr className='border-outline-gray mt-4 border-t' />
            </div>
          ))}
          <div className='flex justify-end gap-2 pt-4'>
            <div className='h-[52px] w-[164px] animate-pulse rounded bg-gray-200' />
            <div className='h-[52px] w-[164px] animate-pulse rounded bg-gray-200' />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileCardSkeleton;
