type TCardSkeleton = {
  variant?: 'interactive' | 'selectable';
};

const InfoCardSkeleton = ({ variant = 'interactive' }: TCardSkeleton) => {
  /**
   * 카드의 기본이 되는 스타일 (원본과 동일)
   */
  const baseCardClasses =
    'relative group rounded-2xl bg-white shadow-medium overflow-hidden transition-all duration-300 h-[350px]';

  /**
   * 카드 종류(variant)에 따라 달라지는 스타일
   */
  const variantClasses = {
    interactive: 'hover:shadow-xl',
    selectable: 'cursor-pointer border-transparent',
  };

  /**
   * 스켈레톤 애니메이션 스타일
   */
  const skeletonAnimation =
    'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200';

  return (
    <div className={`${baseCardClasses} ${variantClasses[variant]}`}>
      {/* --- 상단 이미지/배경 영역 스켈레톤 --- */}
      <div className='relative h-[223px] w-full'>
        {/* 이미지 스켈레톤 */}
        <div className={`h-full w-full ${skeletonAnimation}`} />

        {/* 즐겨찾기(별) 버튼 스켈레톤 */}
        <div className='absolute top-3 right-3'>
          <div className={`h-6 w-6 rounded ${skeletonAnimation}`} />
        </div>
      </div>

      {/* --- 하단 텍스트 영역 스켈레톤 --- */}
      <div className='space-y-3 p-5'>
        {/* 제목 스켈레톤 */}
        <div className={`h-5 w-3/4 rounded ${skeletonAnimation}`} />

        {/* 설명 스켈레톤 (2줄) */}
        <div className='space-y-2'>
          <div className={`h-4 w-full rounded ${skeletonAnimation}`} />
          <div className={`h-4 w-2/3 rounded ${skeletonAnimation}`} />
        </div>

        {/* details 스켈레톤 (50% 확률로 표시) */}
        {Math.random() > 0.5 && (
          <div className={`h-4 w-1/2 rounded ${skeletonAnimation}`} />
        )}
      </div>

      {/* --- 호버 시 나타나는 액션 버튼 스켈레톤 (interactive 타입일 때만) --- */}
      {variant === 'interactive' && (
        <div className='absolute inset-0 flex items-center justify-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-30'>
          <div className={`h-10 w-20 rounded-full ${skeletonAnimation}`} />
          <div className={`h-10 w-20 rounded-full ${skeletonAnimation}`} />
        </div>
      )}
    </div>
  );
};

export default InfoCardSkeleton;
