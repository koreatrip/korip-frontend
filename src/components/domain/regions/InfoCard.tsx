import { star } from '@/assets/assets';
import { useModalStore } from '@/stores/useModalStore';

type TCard = {
  variant?: 'interactive' | 'selectable';
  title?: string;
  description?: string;
  details?: string | null;
  imageUrl?: string | null;
  isSelected?: boolean;
  onClick?: () => void;
  onAddSchedule?: () => void;
  onViewDetails?: () => void;
  onFavorite?: () => void;
};

const InfoCard = ({
  variant = 'interactive',
  title = '제목 없음',
  description = '설명 없음',
  details = null,
  imageUrl = null,
  isSelected = false,
  onClick = () => {},
  onAddSchedule,
  onViewDetails = () => {},
  onFavorite = () => {},
}: TCard) => {
  const { actions } = useModalStore();

  // 일정 추가 버튼 클릭 핸들러
  const handleAddSchedule = (e?: React.MouseEvent) => {
    // 이벤트 버블링 방지 (selectable 카드의 onClick과 충돌 방지)
    e?.stopPropagation();

    if (onAddSchedule) {
      onAddSchedule();
    } else {
      // 기본 동작: 로그인 프롬프트 모달 열기
      console.log('Opening login prompt modal'); // 디버깅용
      actions.openLoginPrompt();
    }
  };

  const handleViewDetails = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onViewDetails();
  };

  const handleFavorite = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onFavorite();
  };

  /**
   * 카드의 기본이 되는 스타일
   */
  const baseCardClasses =
    'relative group rounded-2xl bg-white shadow-medium overflow-hidden transition-all duration-300 h-[350px]';

  /**
   * 카드 종류(variant)에 따라 달라지는 스타일
   */
  const variantClasses = {
    interactive: 'hover:shadow-xl',
    selectable: `cursor-pointer ${isSelected ? 'border-sub-green border' : 'border-transparent'}`,
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
          onClick={handleFavorite}
          className='absolute top-3 right-3 z-10 cursor-pointer'
        >
          <img src={star} alt='star' />
        </button>
      </div>

      {/* --- 하단 텍스트 영역 --- */}
      <div className='p-5'>
        <h3 className='text-main-text-navy text-lg font-semibold'>{title}</h3>

        {/* 여러 줄 description with ellipsis */}
        <p
          className='text-sub-text-gray mt-1 leading-relaxed font-normal'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2, // 최대 2줄까지 표시
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </p>

        {/* details 정보가 있을 때만 표시 */}
        {details && (
          <div className='text-sub-text-gray flex items-center'>
            <span className='truncate'>{details}</span>
          </div>
        )}
      </div>

      {/* --- 호버 시 나타나는 액션 버튼 (interactive 타입일 때만) --- */}
      {variant === 'interactive' && (
        <div className='bg-main-text-navy/50 absolute inset-0 flex items-center justify-center space-x-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <button
            onClick={handleAddSchedule}
            className='bg-main-text-navy hover:bg-main-text-navy/70 cursor-pointer rounded-full px-5 py-2 font-medium text-white'
          >
            일정 추가
          </button>
          <button
            onClick={handleViewDetails}
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
