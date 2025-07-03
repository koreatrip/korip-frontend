import type { TimeSlotData } from '@/types/plannerType';
import TimeSlot from './TimeSlot';

type DailyTimelineProps = {
  schedule: TimeSlotData[];
  onRemovePlace: (timeSlotId: string) => void; // ✅ FIX: 삭제 함수를 받을 prop 타입 추가
};

/**
 * 선택된 날짜의 시간대별 타임라인을 보여줍니다.
 */
const DailyTimeline = ({ schedule, onRemovePlace }: DailyTimelineProps) => {
  // 실제로는 API를 통해 해당 날짜의 일정 데이터를 받아옵니다.

  return (
    <div className='space-y-5 pt-4'>
      {schedule.map((slot) => (
        <TimeSlot
          key={slot.time}
          time={slot.time}
          place={slot.place}
          // ✅ FIX: 'onRemove' prop 대신 TimeSlot이 필요로 하는 'onRemovePlace' prop으로 전달합니다.
          onRemovePlace={onRemovePlace}
        />
      ))}
    </div>
  );
};

export default DailyTimeline;
