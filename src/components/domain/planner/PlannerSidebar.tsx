import SelectedPlacesList from './SelectedPlacesList';
import TripSummary from './TripSummary';
/**
 * 왼쪽 사이드바 전체를 감싸는 컴포넌트
 * @returns
 */
const PlannerSidebar = () => {
  return (
    <div className='flex flex-col gap-y-6'>
      <SelectedPlacesList />
      <TripSummary
        duration={3}
        totalPlaces={5}
        completedPlaces={0}
        progress={10}
      />
    </div>
  );
};

export default PlannerSidebar;
