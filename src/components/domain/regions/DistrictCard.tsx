import { star_sm } from '@/assets/assets';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

/**
 * 구역 별 카드
 * @returns
 */
const DistrictCard = () => {
  const { t } = useTranslation();
  return (
    <div className='bg-bg-white border-outline-gray shadow-light relative rounded-2xl border p-4'>
      <h3 className='text-lg font-medium'>강남구</h3>
      <div className='text-sub-text-gray flex items-center gap-x-1'>
        <button className='absolute top-3 right-3 z-10 cursor-pointer'>
          <img src={star_sm} alt='star' />
        </button>
        <MapPinIcon className='h-4 w-4' />
        <p>{t('places.45_attractions')}</p>
      </div>
      <p>고급 쇼핑과 비즈니스의 중심</p>
      <div className='bg-bg-section mt-2 flex flex-col gap-y-1 rounded-lg p-2'>
        <p className='text-sub-text-gray text-sm'>특징</p>
        <p className='text-sm'>트렌디한 쇼핑몰과 고급 레스토랑</p>
      </div>
    </div>
  );
};

export default DistrictCard;
