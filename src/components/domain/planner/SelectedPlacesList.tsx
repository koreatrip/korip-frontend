import type { PlannerPlace } from '@/types/plannerType';
import DraggablePlaceCard from './DraggablePlaceCard';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type ListType = 'selected' | 'favorites';

type TSelectedPlacesListProps = {
  places: PlannerPlace[];
  listType?: ListType;
  onRemovePlace?: (placeId: string) => void;
};

const SelectedPlacesList = ({
  places,
  listType = 'selected',
  onRemovePlace,
}: TSelectedPlacesListProps) => {
  const { t } = useTranslation();

  const title = useMemo(() => {
    switch (listType) {
      case 'favorites':
        return t('places.favorite_places');
      case 'selected':
      default:
        return t('travel.selected_places');
    }
  }, [listType, t]);

  return (
    <div className='bg-bg-white shadow-light flex max-h-[458px] flex-col gap-y-4 rounded-2xl p-6'>
      <h3 className='text-main-text-navy text-2xl font-semibold'>{title}</h3>
      <div className='overflow-y-auto'>
        {places.map((place) => {
          return (
            <DraggablePlaceCard
              key={place.id}
              place={place}
              isOccupied={false}
              onRemove={
                onRemovePlace ? () => onRemovePlace(place.id) : undefined
              } // X 버튼 활성화
            />
          );
        })}
      </div>
    </div>
  );
};

export default SelectedPlacesList;
