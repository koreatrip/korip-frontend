// import star from '@/assets/star/star.svg';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router';

type TFirstCard = {
  isRegion: boolean;
  id: number;
  // variant: 'interactive' | 'selectable';
  title: string;
  imageUrl: string | null;
  isSelected: boolean;
};

const FirstInfoCard = ({
  // variant = 'interactive', // 'interactive' | 'selectable'
  id,
  isRegion,
  title,
  imageUrl,
}: TFirstCard) => {
  const { showToast } = useToast();

  function handleClickDetail() {
    // console.log('View details for item with id:', id);
    if (isRegion) {
      navigator(`/explore/regions?region_id=${id}`);
    } else {
      // navigator(`explore/attractions?category_id=${id}`);
      showToast('준비 중인 기능입니다.', 'info');
    }
  }

  const navigator = useNavigate();
  return (
    <div>
      <div
        className='bg-bg-section relative aspect-square w-full rounded-2xl bg-cover bg-center md:h-[250px]'
        style={{
          backgroundImage: `url(${imageUrl || 'https://via.placeholder.com/300x200'})`,
        }}
      >
        {isRegion
          ? // <button className='absolute right-3 bottom-3 z-30 cursor-pointer'>
            //   <img src={star} alt='star' />
            // </button>
            null
          : null}
      </div>

      <div className='flex items-center justify-between px-2 py-2 md:py-5'>
        <h3 className='text-main-text-navy text-xl font-semibold md:text-2xl'>
          {title}
        </h3>
        <button
          onClick={() => handleClickDetail()}
          className='text-main-text-navy bg-bg-white border-outline-gray shadow-light text-md cursor-pointer rounded-full border px-3 py-2 font-medium whitespace-nowrap duration-300 hover:bg-gray-200 lg:px-5'
        >
          둘러보기
        </button>
      </div>
    </div>
  );
};

export default FirstInfoCard;
