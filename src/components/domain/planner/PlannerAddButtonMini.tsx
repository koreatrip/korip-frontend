// src/components/domain/planner/PlannerAddButtonMini.tsx

// ✨ 1. 이 컴포넌트는 이제 부모가 시키는 일(onClick)만 수행합니다.
// disabled 상태도 부모로부터 전달받습니다.
type TPlannerAddButtonMiniProps = {
  onClick: () => void;
  disabled?: boolean;
};

const PlannerAddButtonMini = ({
  onClick,
  disabled = false,
}: TPlannerAddButtonMiniProps) => {
  // useState, useToast, useCreatePlanMutation 등 모든 훅과 관련 로직을 제거합니다.
  // 이 컴포넌트는 더 이상 모달을 직접 렌더링하지 않습니다.

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='bg-main-pink hover:bg-main-hover-pink flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
    >
      {/* isPending 상태를 직접 관리하지 않으므로, 
        항상 '+' 아이콘만 보여주면 됩니다. 
        버튼의 활성화/비활성화는 disabled prop으로 제어됩니다.
      */}
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
  );
};

export default PlannerAddButtonMini;
