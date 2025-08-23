import { star_sm } from '@/assets/assets';

type PlaceCardProps = {
  data: {
    id: number;
    name: string;
    description: string | null;
    address: string;
    category: {
      id: number;
      name: string;
    };
    sub_category: {
      id: number;
      name: string;
    } | null;
    region: {
      id: number;
      name: string;
    };
    sub_region: {
      id: number;
      name: string;
    };
    favorite_count: number;
  };
  onClick?: () => void;
};

const PlaceCard = ({ data, onClick }: PlaceCardProps) => {
  return (
    <div
      className='bg-bg-white border-outline-gray shadow-light relative cursor-pointer rounded-2xl border p-4'
      onClick={onClick}
    >
      <h3 className='text-lg font-medium'>{data.name}</h3>
      <div className='text-sub-text-gray flex items-center gap-x-1'>
        <button className='absolute top-3 right-3 z-10 cursor-pointer'>
          <img src={star_sm} alt='star' />
        </button>
        <p className='text-sub-text-gray text-sm'>{data.address}</p>
      </div>
      <div className='bg-bg-section mt-2 mb-4 flex flex-col gap-y-1 rounded-lg p-2'>
        <p className='text-sub-text-gray text-sm'>특징</p>
        <p className='text-sm'>{data.description}</p>
      </div>
      <div className='flex gap-x-1.5'>
        <span className='bg-sub-green/15 text-sub-green rounded-lg px-2 py-1.5 text-sm'>
          {data.category?.name}
        </span>
        {data.sub_category?.name ? (
          <span className='bg-sub-green/15 text-sub-green rounded-lg px-2 py-1.5 text-sm'>
            {data.sub_category.name}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PlaceCard;
