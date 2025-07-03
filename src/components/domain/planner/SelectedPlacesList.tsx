import type { Place } from '@/types/plannerType';
import DraggablePlaceCard from './DraggablePlaceCard';

/**
 * '선택한 장소들' 목록
 * @returns
 */

type SelectedPlacesListProps = {
  places: Place[];
  scheduledPlaceIds: string[];
};
const SelectedPlacesList = ({
  places,
  scheduledPlaceIds,
}: SelectedPlacesListProps) => {
  return (
    <div className='bg-bg-white shadow-light flex flex-col gap-y-4 rounded-2xl p-6'>
      <h3 className='text-main-text-navy text-2xl font-semibold'>
        선택한 장소들
      </h3>
      {places.map((place) => {
        const isOccupied = scheduledPlaceIds.includes(place.id);
        return (
          <DraggablePlaceCard
            key={place.id}
            place={place}
            // ✅ FIX: 'isDraggable'이라는 잘못된 prop 이름 대신,
            // DraggablePlaceCard가 필요로 하는 'isOccupied' prop을 올바르게 전달합니다.
            // isOccupied가 true이면 카드의 드래그가 비활성화됩니다.
            isOccupied={isOccupied}
          />
        );
      })}
    </div>
  );
};

export default SelectedPlacesList;
