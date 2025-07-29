// src/components/domain/planner/DraggablePlaceCard.tsx

import type { PlannerPlace } from '@/types/plannerType';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type DraggablePlaceCardProps = {
  place: PlannerPlace;
  isOccupied: boolean;
  originTime?: string;
  originDay?: number; // ✅ '몇 일차'에서 왔는지 받을 프롭 추가
  onRemove?: () => void;
  readOnly?: boolean;
};

const DraggablePlaceCard = ({
  place,
  isOccupied,
  originTime,
  originDay, // ✅ 프롭으로 받기
  onRemove,
  readOnly = false,
}: DraggablePlaceCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || readOnly) return;

    const cleanup = draggable({
      element: el,
      getInitialData: () => ({
        place,
        originTime: originTime || null,
        originDay: originDay || null, // ✅ 드래그 데이터에 originDay 추가
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    return cleanup;
  }, [place, originTime, originDay, isOccupied, readOnly]); // ✅ 의존성 배열에 originDay, readOnly 추가

  return (
    <div
      ref={ref}
      className={`bg-bg-section shadow-light relative w-full rounded-lg p-4 transition-all duration-200 ${
        readOnly
          ? 'cursor-default'
          : isOccupied
          ? 'cursor-not-allowed opacity-50'
          : isDragging
          ? 'scale-105 opacity-80 shadow-lg'
          : 'hover:shadow-medium cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className='bg-sub-green absolute top-0 left-0 h-full w-1.5 rounded-l-lg'></div>
      <div className='pointer-events-none pl-4'>
        <p className='text-main-text-navy font-semibold'>{place.title}</p>
        <p className='text-sub-text-gray mt-1 text-sm'>{place.category}</p>
      </div>
      {onRemove && !readOnly && (
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
