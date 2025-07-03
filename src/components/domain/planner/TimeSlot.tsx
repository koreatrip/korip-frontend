// src/components/domain/planner/TimeSlot.tsx

import type { TimeSlotData } from '@/types/plannerType';
import DraggablePlaceCard from './DraggablePlaceCard';
import { useEffect, useRef, useState } from 'react'; // useEffect, useRef, useState 추가
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

type TimeSlotProps = TimeSlotData & {
  onRemovePlace: (placeId: string) => void;
};

const TimeSlot = ({ time, place, onRemovePlace }: TimeSlotProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isBeingDraggedOver, setIsBeingDraggedOver] = useState(false);

  // ✅ PDD의 dropTarget을 설정하는 useEffect
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // dropTargetForElements 함수는 DOM 요소를 드롭 영역으로 만듭니다.
    const cleanup = dropTargetForElements({
      element: el,
      // 드롭 영역의 데이터를 정의합니다. 이 데이터는 모니터의 onDrop에서 사용됩니다.
      getData: () => ({ time }),
      // 드래그 아이템이 영역에 들어왔을 때
      onDragEnter: () => setIsBeingDraggedOver(true),
      // 드래그 아이템이 영역을 떠났을 때
      onDragLeave: () => setIsBeingDraggedOver(false),
      // 드롭이 완료되었을 때 (성공/실패 무관)
      onDrop: () => setIsBeingDraggedOver(false),
    });

    return cleanup;
  }, [time]); // time이 바뀔 수 있으므로 의존성 배열에 추가

  return (
    <div className='flex items-center gap-x-6'>
      <div className='text-main-text-navy w-12 text-right text-sm font-medium'>
        {time}
      </div>

      <div
        ref={ref} // ref를 드롭 영역 요소에 연결
        className={`flex h-16 flex-1 items-center rounded-lg border-2 border-dashed transition-all duration-200 ${
          isBeingDraggedOver // isOver 대신 isBeingDraggedOver 사용
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
              onRemove={() => onRemovePlace(place.id)}
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
