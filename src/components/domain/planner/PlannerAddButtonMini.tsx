import React, { useState } from 'react';
import CreateTripModal from '../../modals/CreateTripModal';

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
  createdAt: string;
};

const PlannerAddButtonMini = ({
  onClick,
  onAddPlanner,
}: TPlannerAddButtonMiniProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = (tripData: TTripData) => {
    // 새 일정 데이터 생성
    const newPlanner: TPlannerData = {
      id: Date.now(), // 임시 ID
      title: tripData.tripName,
      description: tripData.tripDescription || `${tripData.location} 여행`,
      dateRange: `${new Date()
        .toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\./g, '.')
        .replace(/ /g, '')} ~ 미정`,
      isNew: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (onAddPlanner) {
      onAddPlanner(newPlanner);
    }

    console.log('새 여행 일정 생성:', newPlanner);
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className='bg-main-pink hover:bg-main-hover-pink flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-200'
      >
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
