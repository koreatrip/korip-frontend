type TDraggablePlaceCardProps = {
  title: string;
  category: string;
};

/**
 * 드래그 가능한 장소 카드
 * @param param0
 * @returns
 */
const DraggablePlaceCard = ({ title, category }: TDraggablePlaceCardProps) => {
  return (
    <div className='bg-bg-section shadow-light hover:shadow-medium relative w-full cursor-grab rounded-lg p-4 transition-shadow active:cursor-grabbing'>
      {/* 왼쪽 색상 테두리 */}
      <div className='bg-sub-green absolute top-0 left-0 h-full w-1.5 rounded-l-lg'></div>

      {/* 콘텐츠 영역 */}
      <div className='pl-4'>
        <p className='text-main-text-navy font-semibold'>{title}</p>
        <p className='text-sub-text-gray mt-1 text-sm'>{category}</p>
      </div>
    </div>
  );
};

export default DraggablePlaceCard;
