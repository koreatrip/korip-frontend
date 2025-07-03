import type { TimeSlotData } from '@/types/plannerType';
import TimeSlot from './TimeSlot';

type DailyTimelineProps = {
  schedule: TimeSlotData[];
  activeTab: number;
  onRemovePlace: (timeSlotId: string) => void;
};

// ✅ 1. 타임라인에 항상 표시될 시간대 '틀'을 미리 정의합니다.
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

/**
 * 선택된 날짜의 시간대별 타임라인을 보여줍니다.
 */
const DailyTimeline = ({
  schedule,
  activeTab,
  onRemovePlace,
}: DailyTimelineProps) => {
  return (
    <div className='space-y-5 pt-4'>
      {ALL_TIME_SLOTS.map((time) => {
        const slotData = schedule.find((item) => item.time === time);

        return (
          <TimeSlot
            key={time}
            day={activeTab} // ✅ TimeSlot에 activeTab 값을 day 프롭으로 전달
            time={time}
            place={slotData?.place ?? null}
            timeSlotId={slotData?.timeSlotId ?? ''}
            onRemovePlace={onRemovePlace}
          />
        );
      })}
    </div>
  );
};

export default DailyTimeline;
