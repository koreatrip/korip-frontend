import DraggablePlaceCard from './DraggablePlaceCard';

/**
 * '선택한 장소들' 목록
 * @returns
 */
const SelectedPlacesList = () => {
  return (
    <div className='bg-bg-white shadow-light flex flex-col gap-y-4 rounded-2xl p-6'>
      <h3 className='text-main-text-navy text-2xl font-semibold'>
        선택한 장소들
      </h3>
      <DraggablePlaceCard title='가로수길' category='맛집/카페' />
      <DraggablePlaceCard title='가로수길' category='맛집/카페' />
      <DraggablePlaceCard title='가로수길' category='맛집/카페' />
      <DraggablePlaceCard title='가로수길' category='맛집/카페' />
    </div>
  );
};

export default SelectedPlacesList;
