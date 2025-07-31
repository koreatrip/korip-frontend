import type { PlannerPlace } from '@/types/plannerType';
import SelectedPlacesList from './SelectedPlacesList';
import TripSummary from './TripSummary';

type TPlannerSidebarProps = {
  places: PlannerPlace[];
  readOnly?: boolean;
};

const PlannerSidebar = ({ places, readOnly = false }: TPlannerSidebarProps) => {
  // TripSummary에 필요한 정보는 places만으로 계산하도록 단순화합니다.
  // 또는 전역 스토어에서 직접 가져올 수도 있습니다.
  const scheduledPlacesCount = 0; // 이 부분은 실제 로직에 맞게 수정이 필요합니다.

  return (
    <div className='flex flex-col gap-y-6'>
      <SelectedPlacesList places={places} readOnly={readOnly} />
      <TripSummary
        duration={7} // 예시 값
        totalPlaces={places.length}
        completedPlaces={scheduledPlacesCount}
        progress={
          places.length > 0
            ? Math.round((scheduledPlacesCount / places.length) * 100)
            : 0
        }
        readOnly={readOnly}
      />
    </div>
  );
};

export default PlannerSidebar;
