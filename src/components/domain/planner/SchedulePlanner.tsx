import { useState, useEffect } from 'react';
import DailyTimeline from './DailyTimeline';
import DailyScheduleTabs from './DailyScheduleTabs';
import type { TabItem } from '@/types/tabType';
import DateRangePicker from '@/components/common/DateRangePicker';
import type { TimeSlotData } from '@/types/plannerType';
import { useTranslation } from 'react-i18next';
import { usePlannerStore } from '@/stores/usePlannerStore';

type TSchedulePlannerProps = {
  schedule: TimeSlotData[];
  onRemovePlace?: (timeSlotId: string) => void;
  readOnly?: boolean;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
};

const SchedulePlanner = ({
  schedule,
  onRemovePlace,
  readOnly = false,
  initialStartDate,
  initialEndDate,
}: TSchedulePlannerProps) => {
  const [startDate, setStartDate] = useState(initialStartDate || new Date());
  const [endDate, setEndDate] = useState(initialEndDate || new Date());
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTab, setActiveTab] = useState(1);

  const { t } = useTranslation();
  const { setDateRange } = usePlannerStore();

  const dailySchedule = schedule.filter((item) => item.day === activeTab);

  // 날짜 변경 시 Zustand 스토어에도 반영
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    setDateRange(date.toISOString(), endDate.toISOString());
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    setDateRange(startDate.toISOString(), date.toISOString());
  };

  // 초기 날짜 설정
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setDateRange(
        initialStartDate.toISOString(),
        initialEndDate.toISOString()
      );
    }
  }, [initialStartDate, initialEndDate, setDateRange]);

  useEffect(() => {
    const generateTabs = () => {
      if (!startDate || !endDate || endDate < startDate) {
        setTabs([]);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const newTabs: TabItem[] = [];
      let currentDate = start;
      let dayCount = 1;

      while (currentDate <= end) {
        const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
        newTabs.push({
          id: dayCount,
          label: t('travel.day_label', {
            dayCount,
            date: dateStr,
          }),
        });

        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }

      setTabs(newTabs);

      if (activeTab > newTabs.length && newTabs.length > 0) {
        setActiveTab(1);
      }
    };

    generateTabs();
  }, [startDate, endDate, t, activeTab]);

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='shadow-light bg-bg-white w-full rounded-2xl p-6'>
        {!readOnly && (
          <div className='mb-4 flex gap-x-2'>
            <DateRangePicker
              selectedDate={startDate}
              onDateChange={handleStartDateChange}
            />
            <DateRangePicker
              selectedDate={endDate}
              onDateChange={handleEndDateChange}
            />
          </div>
        )}

        <DailyScheduleTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />

        {tabs.length > 0 && (
          <DailyTimeline
            schedule={dailySchedule}
            activeTab={activeTab}
            onRemovePlace={readOnly ? undefined : onRemovePlace}
            readOnly={readOnly}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulePlanner;
