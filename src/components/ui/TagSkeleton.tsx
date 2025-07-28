type SkeletonProps = {
  className?: string;
  width?: string;
  height?: string;
};

// 기본 스켈레톤 컴포넌트
export const Skeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
}: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded bg-gray-300 ${width} ${height} ${className}`}
    />
  );
};

// 태그 스켈레톤 컴포넌트
export const TagSkeleton = ({ count = 6 }: { count?: number }) => {
  const tagWidths = ['w-16', 'w-20', 'w-14', 'w-24', 'w-18', 'w-22'];

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-sm ${
            tagWidths[index % tagWidths.length]
          }`}
        >
          <Skeleton height='h-4' width='w-full' />
        </div>
      ))}
    </>
  );
};

// 카드 스켈레톤 컴포넌트
export const CardSkeleton = () => {
  return (
    <div className='animate-pulse rounded-lg border bg-white p-4'>
      <Skeleton className='mb-4' width='w-3/4' height='h-6' />
      <Skeleton className='mb-2' width='w-full' height='h-4' />
      <Skeleton className='mb-2' width='w-5/6' height='h-4' />
      <Skeleton width='w-2/3' height='h-4' />
    </div>
  );
};

// 리스트 스켈레톤 컴포넌트
export const ListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className='space-y-3'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='flex items-center space-x-3'>
          <Skeleton width='w-12' height='h-12' className='rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton width='w-1/2' height='h-4' />
            <Skeleton width='w-3/4' height='h-3' />
          </div>
        </div>
      ))}
    </div>
  );
};
