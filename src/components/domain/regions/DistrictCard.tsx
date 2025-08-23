import { star_sm } from '@/assets/assets';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

type DistrictCardProps = {
  data: {
    id: number;
    name: string;
    description: string;
    feature: string;
    favorite_count?: number;
    attractions_count?: number;
    subregions_count?: number;
  };
  type: 'region' | 'subregion';
  onClick?: () => void;
};

const DistrictCard = ({ data, type, onClick }: DistrictCardProps) => {
  const { t } = useTranslation();

  // attractions 수 결정
  const getAttractionsCount = () => {
    if (type === 'subregion') {
      return data.attractions_count || 0;
    } else {
      return data.subregions_count || 0;
    }
  };

  const attractionsCount = getAttractionsCount();

  return (
    <div
      className='bg-bg-white border-outline-gray shadow-light relative rounded-2xl border p-4'
      onClick={onClick}
    >
      <h3 className='text-lg font-medium'>{data.name}</h3>
      <div className='text-sub-text-gray flex items-center gap-x-1'>
        <button className='absolute top-3 right-3 z-10 cursor-pointer'>
          <img src={star_sm} alt='star' />
        </button>
        <MapPinIcon className='h-4 w-4' />
        <p>
          {t('places.45_attractions', { attractions_count: attractionsCount })}
        </p>
      </div>
      <p>{data.description}</p>
      <div className='bg-bg-section mt-2 flex flex-col gap-y-1 rounded-lg p-2'>
        <p className='text-sub-text-gray text-sm'>특징</p>
        <p className='text-sm'>{data.feature}</p>
      </div>
    </div>
  );
};

export default DistrictCard;
