import Tab from '@/components/common/Tab';
import type { TabItem } from '@/types/tabType';

/**
 * '1일차 (7/1)', '2일차 (7/2)' 등 날짜 탭을 관리
 * @returns
 */
const DailyScheduleTabs = ({
  tabs,
  activeTab,
  onTabClick,
}: {
  tabs: TabItem[];
  activeTab: number;
  onTabClick: (tabId: number) => void;
}) => {
  return (
    <div className='border-outline-gray mb-6 flex border-b'>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => onTabClick(tab.id)}
        />
      ))}
    </div>
  );
};

export default DailyScheduleTabs;
