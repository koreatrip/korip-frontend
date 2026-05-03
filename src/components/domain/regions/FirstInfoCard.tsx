// import star from '@/assets/star/star.svg';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router';

type TFirstCard = {
  isRegion: boolean;
  id: number;
  title: string;
  imageUrl: string | null;
  isSelected: boolean;
  priority?: boolean;
};

const FirstInfoCard = ({
  id,
  isRegion,
  title,
  imageUrl,
  priority = false,
}: TFirstCard) => {
  const { showToast } = useToast();
  const { t } = useTranslation();

  const { ref, inView } = useInView({
    triggerOnce: true, // 한 번 로딩되면 끝!
    rootMargin: '300px 0px', // 화면에 보이기 300px 전부터 미리 로딩 시작 (깜빡임 방지)
  });

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
        ref={priority ? null : ref} // priority가 아니면(아랫줄이면) 감지 대상에 포함
        className='bg-bg-section relative aspect-square w-full overflow-hidden rounded-2xl md:h-[250px]'
      >
        {/* priority가 true(윗줄)이거나, 스크롤이 닿았을 때(inView)만 이미지 렌더링 */}
        {(priority || inView) && (
          <img
            src={imageUrl || 'https://via.placeholder.com/300x200'}
            alt={title}
            {...(priority ? { fetchPriority: 'high' } : { loading: 'lazy' })}
            className='h-full w-full object-cover transition-opacity duration-500'
          />
        )}
      </div>

      <div className='flex items-center justify-between px-2 py-2 md:py-5'>
        <h3 className='text-main-text-navy text-xl font-semibold md:text-2xl'>
          {title}
        </h3>
        <button
          onClick={() => handleClickDetail()}
          className='text-main-text-navy bg-bg-white border-outline-gray shadow-light text-md cursor-pointer rounded-full border px-3 py-2 font-medium whitespace-nowrap duration-300 hover:bg-gray-200 lg:px-5'
        >
          {t('common.explore')}
        </button>
      </div>
    </div>
  );
};

export default FirstInfoCard;
