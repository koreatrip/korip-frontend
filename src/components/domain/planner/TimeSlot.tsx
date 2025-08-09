// src/components/domain/planner/TimeSlot.tsx

import type { TimeSlotData } from '@/types/plannerType';
import DraggablePlaceCard from './DraggablePlaceCard';
import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useTranslation } from 'react-i18next';

type TTimeSlotProps = TimeSlotData & {
  day: number;
  onRemovePlace?: (timeSlotId: string) => void;
  readOnly?: boolean;
};

const TimeSlot = ({
  time,
  place,
  day,
  timeSlotId,
  onRemovePlace,
  readOnly = false,
}: TTimeSlotProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isBeingDraggedOver, setIsBeingDraggedOver] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const el = ref.current;
    if (!el || readOnly) return;

    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ time, day }),
      onDragEnter: () => setIsBeingDraggedOver(true),
      onDragLeave: () => setIsBeingDraggedOver(false),
      onDrop: () => setIsBeingDraggedOver(false),
    });

    return cleanup;
  }, [time, day, readOnly]);

  return (
    <div className='flex items-center gap-x-6'>
      <div className='text-main-text-navy w-12 text-right text-sm font-medium'>
        {time}
      </div>
      <div
        ref={ref}
        className={`flex h-16 flex-1 items-center rounded-lg transition-all duration-200 ${
          readOnly
            ? 'border-2 border-solid border-gray-200 bg-gray-50'
            : `border-2 border-dashed ${
                isBeingDraggedOver
                  ? 'border-sub-green bg-sub-green/20 scale-[1.02]'
                  : 'border-outline-gray hover:border-sub-green/50'
              }`
        } ${place ? 'border-none bg-transparent p-0' : readOnly ? 'bg-gray-50' : 'bg-white/50'}`}
      >
        {place ? (
          <div className='w-full'>
            <DraggablePlaceCard
              place={place}
              isOccupied={false}
              originTime={time}
              originDay={day} // ✅ DraggablePlaceCard에 day 정보를 originDay로 전달
              onRemove={
                readOnly || !onRemovePlace
                  ? undefined
                  : () => onRemovePlace(timeSlotId)
              }
              readOnly={readOnly}
            />
          </div>
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <span className='text-sub-text-gray text-sm'>
              {readOnly ? '빈 시간대' : t('travel.drop_here')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlot;
