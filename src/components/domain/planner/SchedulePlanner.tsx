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
  const [startDate, setStartDate] = useState(new Date('2025-07-01'));
  const [endDate, setEndDate] = useState(new Date('2025-07-07'));
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
        setDailySchedules({}); // 탭이 없으면 스케줄도 초기화
        return;
      }

      const newTabs: TabItem[] = [];
      const newDailySchedules: Record<number, TimeSlotData[]> = {};
      let currentDate = new Date(startDate);
      let dayCount = 1;

      while (currentDate <= endDate) {
        newTabs.push({
          id: dayCount,
          label: `${dayCount}일차 (${currentDate.getMonth() + 1}/${currentDate.getDate()})`,
        });

        // 🔥 각 일차마다 빈 스케줄로 초기화
        newDailySchedules[dayCount] = [];

        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }

      setTabs(newTabs);
      setDailySchedules(newDailySchedules);

      if (activeTab > newTabs.length) {
        setActiveTab(1);
      }
    };

    generateTabs();
  }, [startDate, endDate, activeTab]);

  // 🔥 각 일차별 스케줄 업데이트 함수
  const updateDailySchedule = (day: number, newSchedule: TimeSlotData[]) => {
    setDailySchedules((prev) => ({
      ...prev,
      [day]: newSchedule,
    }));
  };

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
