import { useState } from 'react';
import CreateTripModal from '../../modals/CreateTripModal';
import { useCreatePlanMutation } from '@/api/planner/plannerHooks';
import { useToast } from '@/hooks/useToast';

type TPlannerAddButtonMiniProps = {
  onClick?: () => void;
  onAddPlanner?: (planner: TPlannerData) => void;
};

type TTripData = {
  tripName: string;
  tripDescription: string;
  location: string;
  selectedRegion: string;
};

type TPlannerData = {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
};

const PlannerAddButtonMini = ({
  onClick,
  onAddPlanner,
}: TPlannerAddButtonMiniProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const createPlanMutation = useCreatePlanMutation({
    onSuccess: (data) => {
      console.log('플래너 생성 성공:', data);
      showToast('새 여행 일정이 생성되었습니다.', 'success');
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('플래너 생성 실패:', error);
      showToast('여행 일정 생성에 실패했습니다.', 'error');
    },
  });

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = async (tripData: TTripData) => {
    // API 호출을 위한 데이터 구조
    const planRequest = {
      name: tripData.tripName,
      description: tripData.tripDescription || `${tripData.location} 여행`,
      destination: tripData.location,
      subregion_id: Number(tripData.selectedRegion),
    };

    try {
      await createPlanMutation.mutateAsync(planRequest);
    } catch (error) {
      console.error('플래너 생성 중 에러:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={createPlanMutation.isPending}
        className='bg-main-pink hover:bg-main-hover-pink flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
      >
        {createPlanMutation.isPending ? (
          <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
        ) : (
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            strokeWidth={2.5}
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>
        )}
      </button>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default PlannerAddButtonMini;
