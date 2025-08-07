import type { PlannerPlace } from '@/types/plannerType';
import DraggablePlaceCard from './DraggablePlaceCard';
import { useTranslation } from 'react-i18next';

type TSelectedPlacesListProps = {
  places: PlannerPlace[];
  readOnly?: boolean;
};

const SelectedPlacesList = ({ places, readOnly = false }: SelectedPlacesListProps) => {
  const { t } = useTranslation();
  return (
    <div className='bg-bg-white shadow-light flex max-h-[458px] flex-col gap-y-4 rounded-2xl p-6'>
      <h3 className='text-main-text-navy text-2xl font-semibold'>
        {t('travel.selected_places')}
        {readOnly ? '(t('travel.schedule_summary')) : (t('travel.selected_places'))} // 일정 장소들 : 선택한 장소들인것같은데 일정장소들 번역이 없다
      </h3>
      <div className='overflow-y-auto'>
        {places.map((place) => {
          return (
            <DraggablePlaceCard
              key={place.id}
              place={place}
              isOccupied={false} // 항상 false로 설정하여 드래그 가능하게 만듦
              readOnly={readOnly}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SelectedPlacesList;
