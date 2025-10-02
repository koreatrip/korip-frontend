import { useState } from 'react';
import CreateTripModal from '../../modals/CreateTripModal';
import { useCreatePlanMutation } from '@/api/planner/plannerHooks';
import { useToast } from '@/hooks/useToast';

type TPlannerAddButtonProps = {
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

const PlannerAddButton = ({
  onClick,
  onAddPlanner,
}: TPlannerAddButtonProps) => {
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
      subregion_id: Number(tripData.selectedRegion), // selectedRegion이 subregion_id라고 가정
    };

    try {
      await createPlanMutation.mutateAsync(planRequest);
    } catch (error) {
      // 에러는 mutation의 onError에서 처리됨
      console.error('플래너 생성 중 에러:', error);
    }
  };

  return (
    <>
      <div className='flex h-full items-center justify-center'>
        <button
          onClick={handleButtonClick}
          disabled={createPlanMutation.isPending}
          className='flex h-[177px] w-[177px] flex-col items-center justify-center rounded-full bg-gray-200 transition-colors duration-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {createPlanMutation.isPending ? (
            <div className='h-[91px] w-[91px] animate-spin rounded-full border-4 border-gray-300 border-t-white' />
          ) : (
            <svg
              className='h-[91px] w-[91px] text-white'
              fill='none'
              stroke='currentColor'
              strokeWidth={3}
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
      </div>

      <CreateTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
};

export default PlannerAddButton;
