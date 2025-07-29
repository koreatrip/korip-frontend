// src/components/domain/planner/DailyTimeline.tsx

import type { TimeSlotData } from '@/types/plannerType';
import TimeSlot from './TimeSlot';

type DailyTimelineProps = {
  schedule: TimeSlotData[];
  activeTab: number;
  onRemovePlace?: (timeSlotId: string) => void;
  readOnly?: boolean;
};

const ALL_TIME_SLOTS = [
  '09:00',
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '21:00',
  '23:00',
];

const DailyTimeline = ({
  schedule,
  activeTab,
  onRemovePlace,
  readOnly = false,
}: DailyTimelineProps) => {
  return (
    <div className='space-y-5 pt-4'>
      {ALL_TIME_SLOTS.map((time) => {
        const slotData = schedule.find((item) => item.time === time);
        return (
          <TimeSlot
            key={time}
            day={activeTab} // ✅ TimeSlot에 day 정보 전달 (이 코드는 이미 올바르게 되어있음)
            time={time}
            place={slotData?.place ?? null}
            timeSlotId={slotData?.timeSlotId ?? ''}
            onRemovePlace={readOnly ? undefined : onRemovePlace}
            readOnly={readOnly}
          />
        );
      })}
    </div>
  );
};

export default DailyTimeline;
