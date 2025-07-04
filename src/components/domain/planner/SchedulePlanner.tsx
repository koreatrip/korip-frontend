import { useState, useEffect } from 'react';
import DailyTimeline from './DailyTimeline';
import DailyScheduleTabs from './DailyScheduleTabs';
import type { TabItem } from '@/types/tabType';
import DateRangePicker from '@/components/common/DateRangePicker';
import type { TimeSlotData } from '@/types/plannerType';

type SchedulePlannerProps = {
  schedule: TimeSlotData[];
  onRemovePlace: (timeSlotId: string) => void;
};

/**
 * 날짜 선택, 일차별 탭, 타임라인 등 가운데 계획 영역 전체를 책임지는 핵심 컴포넌트
 */
const SchedulePlanner = ({ schedule, onRemovePlace }: SchedulePlannerProps) => {
  // 1. 시작일과 종료일 상태 관리
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const dailySchedule = schedule.filter((item) => item.day === activeTab);

  // 🔥 핵심 수정: 각 일차별 스케줄 데이터를 별도로 관리
  const [dailySchedules, setDailySchedules] = useState<
    Record<number, TimeSlotData[]>
  >({});

  // 2. 날짜가 변경될 때마다 탭을 다시 생성하는 useEffect
  useEffect(() => {
    const generateTabs = () => {
      if (!startDate || !endDate || endDate < startDate) {
        setTabs([]);
        return;
      }

      // ✅ 원본 날짜 상태를 직접 수정하지 않도록 복사본을 만듭니다.
      const start = new Date(startDate);
      const end = new Date(endDate);

      // ✅ 시간 부분을 모두 0으로 만들어 날짜만 순수하게 비교하도록 합니다.
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const newTabs: TabItem[] = [];
      let currentDate = start;
      let dayCount = 1;

      // ✅ 이 반복문이 이제 마지막 날짜까지 정확하게 포함합니다.
      while (currentDate <= end) {
        newTabs.push({
          id: dayCount,
          label: `${dayCount}일차 (${currentDate.getMonth() + 1}/${currentDate.getDate()})`,
        });

        // 다음 날짜로 넘어갑니다.
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }

      setTabs(newTabs);

      if (activeTab > newTabs.length && newTabs.length > 0) {
        setActiveTab(1);
      }
    };

    generateTabs();
  }, [startDate, endDate]);

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='shadow-light bg-bg-white w-full rounded-2xl p-6'>
        {/* 상단 날짜 선택 */}
        <div className='mb-4 flex gap-x-2'>
          <DateRangePicker
            selectedDate={startDate}
            onDateChange={setStartDate}
          />
          <DateRangePicker selectedDate={endDate} onDateChange={setEndDate} />
        </div>

        {/* 동적으로 생성된 탭 컴포넌트 사용 */}
        <DailyScheduleTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />

        {/* 🔥 수정: 각 일차별로 독립적인 스케줄 데이터 표시 */}
        {tabs.length > 0 && (
          <DailyTimeline
            schedule={dailySchedule}
            activeTab={activeTab} // ✅ DailyTimeline에 activeTab 프롭 전달
            onRemovePlace={onRemovePlace}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulePlanner;
