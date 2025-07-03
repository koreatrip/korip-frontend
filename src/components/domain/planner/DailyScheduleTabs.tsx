import Tab from '@/components/common/Tab';
import type { TabItem } from '@/types/tabType';

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
    <div className='border-outline-gray mb-6 flex max-w-[624px] flex-nowrap overflow-x-auto border-b'>
      <div className='flex flex-nowrap gap-x-1'>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabClick(tab.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyScheduleTabs;
