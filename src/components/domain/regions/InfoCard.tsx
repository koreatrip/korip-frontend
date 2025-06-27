import { star } from '@/assets/assets';

type TCard = {
  variant: 'interactive' | 'selectable';
  title: string;
  description: string;
  details: string | null;
  imageUrl: string | null;
  isSelected: boolean;
  onClick: () => void;
  onAddSchedule: () => void;
  onViewDetails: () => void;
  onFavorite: () => void;
};

const InfoCard = ({
  variant = 'interactive', // 'interactive' | 'selectable'
  title,
  description,
  details,
  imageUrl,
  isSelected,
  onClick,
  onAddSchedule = () => {},
  onViewDetails = () => {},
  onFavorite = () => {},
}: TCard) => {
  /**
   * 카드의 기본이 되는 스타일
   */
  const baseCardClasses =
    'relative group rounded-2xl bg-white shadow-medium overflow-hidden transition-all duration-300 h-[350px]';

  /**
   * 카드 종류(variant)에 따라 달라지는 스타일
   */
  const variantClasses = {
    interactive: 'hover:shadow-xl', // 호버 시 그림자 효과 강화
    selectable: `cursor-pointer  ${isSelected ? 'border-sub-green border' : 'border-transparent'}`, // 선택 시 틸(teal) 색상 테두리
  };

  return (
    <div
      className={`${baseCardClasses} ${variantClasses[variant]}`}
      onClick={variant === 'selectable' ? onClick : undefined}
    >
      {/* --- 상단 이미지/배경 영역 --- */}
      <div
        className='bg-bg-section relative h-[223px] w-full bg-cover bg-center'
        style={{
          backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/300x200'})`,
        }}
      >
        {/* 즐겨찾기(별) 버튼 */}
        <button
          onClick={onFavorite}
          className='absolute top-3 right-3 z-30 cursor-pointer'
        >
          <img src={star} alt='star' />
        </button>
      </div>

      {/* --- 하단 텍스트 영역 --- */}
      <div className='p-5'>
        <h3 className='text-main-text-navy text-lg font-semibold'>{title}</h3>
        <p className='text-sub-text-gray mt-1 truncate font-normal'>
          {description}
        </p>
        {/* details 정보가 있을 때만 표시 */}
        {details && (
          <div className='text-sub-text-gray mt-2 flex items-center'>
            <span>{details}</span>
          </div>
        )}
      </div>

      {/* --- 호버 시 나타나는 액션 버튼 (interactive 타입일 때만) --- */}
      {variant === 'interactive' && (
        <div className='bg-main-text-navy/50 absolute inset-0 flex items-center justify-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <button
            onClick={onAddSchedule}
            className='bg-main-text-navy hover:bg-main-text-navy/70 tfont-medium cursor-pointer rounded-full px-5 py-2 text-white'
          >
            일정 추가
          </button>
          <button
            onClick={onViewDetails}
            className='text-main-text-navy bg-bg-white cursor-pointer rounded-full px-5 py-2 font-medium hover:bg-gray-200'
          >
            상세보기
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
