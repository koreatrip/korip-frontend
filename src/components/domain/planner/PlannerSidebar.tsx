import type { PlannerPlace } from '@/types/plannerType';
import SelectedPlacesList from './SelectedPlacesList';
import TripSummary from './TripSummary';
/**
 * 왼쪽 사이드바 전체를 감싸는 컴포넌트
 * @returns
 */

type PlannerSidebarProps = {
  places: PlannerPlace[];
  scheduledPlaceIds: string[];
};

const PlannerSidebar = ({ places, scheduledPlaceIds }: PlannerSidebarProps) => {
  return (
    <div className='flex flex-col gap-y-6'>
      <SelectedPlacesList
        places={places}
        scheduledPlaceIds={scheduledPlaceIds}
      />
      <TripSummary
        duration={3}
        totalPlaces={places.length}
        completedPlaces={scheduledPlaceIds.length}
        progress={
          places.length > 0
            ? Math.round((scheduledPlaceIds.length / places.length) * 100)
            : 0
        }
      />
    </div>
  );
};

export default PlannerSidebar;
