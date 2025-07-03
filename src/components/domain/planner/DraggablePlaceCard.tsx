// src/components/domain/planner/DraggablePlaceCard.tsx

import type { PlannerPlace } from '@/types/plannerType';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react'; // useEffect, useRef, useState 추가
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type DraggablePlaceCardProps = {
  place: PlannerPlace;
  isOccupied: boolean;
  originTime?: string;
  onRemove?: () => void;
};

const DraggablePlaceCard = ({
  place,
  isOccupied,
  originTime,
  onRemove,
}: DraggablePlaceCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ PDD의 draggable을 설정하는 useEffect
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // draggable 함수는 DOM 요소를 드래그 가능하게 만듭니다.
    const cleanup = draggable({
      element: el,
      // 드래그 시 전달할 데이터를 정의합니다.
      getInitialData: () => ({
        place,
        originTime: originTime || null,
      }),
      // 드래그가 비활성화되었는지 여부
      // disabled: isOccupied,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    // 컴포넌트 언마운트 또는 의존성 변경 시 정리 함수를 반환합니다.
    return cleanup;
  }, [place, originTime, isOccupied]);

  return (
    // ref를 드래그할 요소에 연결합니다.
    <div
      ref={ref}
      className={`bg-bg-section shadow-light relative w-full rounded-lg p-4 transition-all duration-200 ${
        isOccupied
          ? 'cursor-not-allowed opacity-50'
          : isDragging
            ? 'scale-105 opacity-80 shadow-lg' // isDragging 상태에 따른 스타일
            : 'hover:shadow-medium cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* PDD는 transform을 직접 제어할 필요가 없으므로 style 속성 제거 */}
      <div className='bg-sub-green absolute top-0 left-0 h-full w-1.5 rounded-l-lg'></div>
      <div className='pointer-events-none pl-4'>
        <p className='text-main-text-navy font-semibold'>{place.title}</p>
        <p className='text-sub-text-gray mt-1 text-sm'>{place.category}</p>
      </div>

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className='pointer-events-auto absolute top-2 right-2 z-30 p-1 text-gray-400 transition-colors hover:text-red-500'
          type='button'
        >
          <XCircleIcon className='h-5 w-5' />
        </button>
      )}
    </div>
  );
};

export default DraggablePlaceCard;
