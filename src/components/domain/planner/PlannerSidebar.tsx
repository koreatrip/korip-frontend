import type { PlannerPlace } from '@/types/plannerType';
import SelectedPlacesList from './SelectedPlacesList';
import TripSummary from './TripSummary';
import { usePlannerStore } from '@/stores/usePlannerStore';

type TPlannerSidebarProps = {
  places: PlannerPlace[];
  readOnly?: boolean;
};

const PlannerSidebar = ({ places, readOnly = false }: TPlannerSidebarProps) => {
  const { getScheduledPlacesCount, getTripDuration } = usePlannerStore();

  const scheduledPlacesCount = getScheduledPlacesCount();
  const tripDuration = getTripDuration();

  const tripSummaryProps = {
    duration: tripDuration,
    totalPlaces: places.length,
    completedPlaces: scheduledPlacesCount,
    progress:
      places.length > 0
        ? Math.round((scheduledPlacesCount / places.length) * 100)
        : 0,
    readOnly,
  };

  return (
    <div>
      {/* 데스크톱 레이아웃 (1024px 이상) - 기존 순서 유지 */}
      <div className='hidden flex-col gap-y-6 lg:flex'>
        <SelectedPlacesList places={places} />
        <TripSummary {...tripSummaryProps} />
      </div>

      {/* 모바일/태블릿 레이아웃 (1024px 미만) - 순서 변경 */}
      <div className='flex flex-col gap-y-6 lg:hidden'>
        <TripSummary {...tripSummaryProps} />
        <SelectedPlacesList places={places} />
      </div>
    </div>
  );
};

export default PlannerSidebar;
