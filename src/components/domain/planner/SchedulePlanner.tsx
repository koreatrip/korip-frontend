import { useState } from 'react';
import DailyTimeline from './DailyTimeline';
import DailyScheduleTabs from './DailyScheduleTabs';
import type { TabItem } from '@/types/tabType';
import DateRangePicker from '@/components/common/DateRangePicker';
/**
 * 날짜 선택, 일차별 탭, 타임라인 등 가운데 계획 영역 전체를 책임지는 핵심 컴포넌트
 * @returns
 */
const SchedulePlanner = () => {
  const [activeTab, setActiveTab] = useState(1);
  const tabs: TabItem[] = [
    { id: 1, label: '1일차 (7/1)' },
    { id: 2, label: '2일차 (7/2)' },
    { id: 3, label: '3일차 (7/3)' },
  ];

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='shadow-light bg-bg-white w-full rounded-2xl p-6'>
        {/* 상단 날짜 선택 (가상) */}
        <div className='mb-4 flex gap-x-2'>
          <DateRangePicker />
          <DateRangePicker />
        </div>

        {/* ✅ 분리된 탭 컴포넌트 사용 */}
        <DailyScheduleTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />

        {/* 타임라인 */}
        {/* 선택된 탭에 따라 다른 타임라인을 보여주는 로직이 여기에 들어갑니다. */}
        {activeTab === 1 && <DailyTimeline />}
        {activeTab === 2 && <div>2일차 내용</div>}
        {activeTab === 3 && <div>3일차 내용</div>}
      </div>
    </div>
  );
};

export default SchedulePlanner;
