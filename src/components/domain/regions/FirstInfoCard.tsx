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
  variant = 'interactive', // 'interactive' | 'selectable'
  title,
  imageUrl,
  onViewDetails = () => {},
  onFavorite = () => {},
}: TFirstCard) => {

  

  return (
    <div>
        <div
            className='bg-bg-section relative rounded-2xl  h-[250px] w-full bg-cover bg-center'
            style={{
            backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/300x200'})`,
            }}>
            <button
            onClick={onFavorite}
            className='absolute bottom-3 right-3 z-30 cursor-pointer'
            >
            <img src={star} alt='star' />
            </button>
        </div>
    

        <div className="py-5 flex justify-between items-center">
    
            <h3 className='text-main-text-navy text-4xl font-semibold'>{title}</h3>
                <button
            onClick={onViewDetails}
            className='text-main-text-navy bg-bg-white cursor-pointer border border-outline-gray shadow-medium duration-300 rounded-full px-7 py-2 font-medium hover:bg-gray-200'
        >
            둘러보기
        </button>
        </div>

    
    </div>
  );
};

export default FirstInfoCard;
