// src/components/domain/planner/TimeSlot.tsx

import type { TimeSlotData } from '@/types/plannerType';
import DraggablePlaceCard from './DraggablePlaceCard';
import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type TimeSlotProps = TimeSlotData & {
  day: number;
  onRemovePlace: (timeSlotId: string) => void;
};

// ✅ 1. props에서 timeSlotId를 구조 분해 할당으로 받아옵니다.
const TimeSlot = ({
  time,
  place,
  day,
  timeSlotId,
  onRemovePlace,
}: TimeSlotProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isBeingDraggedOver, setIsBeingDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = dropTargetForElements({
      element: el,
      // ✅ getData에서 time과 함께 day 정보도 제공합니다.
      getData: () => ({ time, day }),
      onDragEnter: () => setIsBeingDraggedOver(true),
      onDragLeave: () => setIsBeingDraggedOver(false),
      onDrop: () => setIsBeingDraggedOver(false),
    });

    return cleanup;
  }, [time, day]); // 의존성 배열에 day 추가

  return (
    <div className='flex items-center gap-x-6'>
      <div className='text-main-text-navy w-12 text-right text-sm font-medium'>
        {time}
      </div>

      <div
        ref={ref}
        className={`flex h-16 flex-1 items-center rounded-lg border-2 border-dashed transition-all duration-200 ${
          isBeingDraggedOver
            ? 'border-sub-green bg-sub-green/20 scale-[1.02]'
            : 'border-outline-gray hover:border-sub-green/50'
        } ${place ? 'border-none bg-transparent p-0' : 'bg-white/50'}`}
      >
        {place ? (
          <div className='w-full'>
            <DraggablePlaceCard
              place={place}
              isOccupied={false}
              originTime={time}
              // ✅ 2. onRemovePlace에 place.id 대신 timeSlotId를 전달합니다.
              onRemove={() => onRemovePlace(timeSlotId)}
            />
          </div>
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <p className='text-sub-text-gray text-sm'>
              {isBeingDraggedOver ? '여기에 놓으세요' : '장소를 드래그하세요'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlot;
