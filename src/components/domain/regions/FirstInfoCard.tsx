import star from '@/assets/star/star.svg';

type TFirstCard = {
  variant: 'interactive' | 'selectable';
  title: string;
  imageUrl: string | null;
  isSelected: boolean;
  onClick: () => void;
  onViewDetails: () => void;
  onFavorite: () => void;
};

const FirstInfoCard = ({
  // variant = 'interactive', // 'interactive' | 'selectable'
  title,
  imageUrl,
  onViewDetails = () => {},
  onFavorite = () => {},
}: TFirstCard) => {
  return (
    <div>
      <div
        className='bg-bg-section relative h-[250px] w-full rounded-2xl bg-cover bg-center'
        style={{
          backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/300x200'})`,
        }}
      >
        <button
          onClick={onFavorite}
          className='absolute right-3 bottom-3 z-30 cursor-pointer'
        >
          <img src={star} alt='star' />
        </button>
      </div>

      <div className='flex items-center justify-between py-5'>
        <h3 className='text-main-text-navy text-2xl font-semibold lg:text-3xl'>
          {title}
        </h3>
        <button
          onClick={onViewDetails}
          className='text-main-text-navy bg-bg-white border-outline-gray shadow-light cursor-pointer rounded-full border px-3 py-2 text-sm font-medium duration-300 hover:bg-gray-200 md:text-xl lg:px-5'
        >
          둘러보기
        </button>
      </div>
    </div>
  );
};

export default FirstInfoCard;
