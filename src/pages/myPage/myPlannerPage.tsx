import PlannerAddButton from '@/components/domain/planner/PlannerAddButton';
import PlannerCard from '@/components/domain/planner/PlannerCard';
import PlannerHeader from '@/components/domain/planner/PlannerHeader';
import type { TPlanner } from '@/types/plannerType';

const dummyPlanners: TPlanner[] = [
  {
    title: '길동이와 동에번쩍 서에번쩍',
    description: '친구들과 떠나는 국내여행',
    dateRange: '25.05.13 ~ 25.06.01',
    isNew: true,
  },
  {
    title: '가족과 함께한 제주도 여행',
    description: '힐링 가득한 자연 속으로',
    dateRange: '25.03.01 ~ 25.03.05',
  },
  {
    title: '서울 미식 투어',
    description: '맛집만 골라가는 하루 코스',
    dateRange: '25.04.10 ~ 25.04.11',
  },
  {
    title: '부산에서의 낭만',
    description: '해운대, 광안리, 감천문화마을',
    dateRange: '25.02.18 ~ 25.02.22',
    isNew: true,
  },
  {
    title: '동해 드라이브 여행',
    description: '차박과 함께하는 자유로운 여행',
    dateRange: '25.01.03 ~ 25.01.07',
  },
  {
    title: '봄꽃 따라 경주',
    description: '벚꽃과 한옥의 조화',
    dateRange: '25.04.01 ~ 25.04.03',
  },
  {
    title: '강릉 당일치기',
    description: '바다 보며 커피 한 잔',
    dateRange: '25.06.15',
  },
  {
    title: '남해안 로드트립',
    description: '창원, 여수, 통영 일주',
    dateRange: '25.05.20 ~ 25.05.27',
  },
];

const MyPlannerPage = () => {
  return (
    <section className='flex flex-col gap-6 px-6 py-10'>
      <PlannerHeader />
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
        {dummyPlanners.map((plan) => (
          <div key={plan.title} className='max-h-[372px] w-full max-w-[347px]'>
            <PlannerCard
              title={plan.title}
              description={plan.description}
              dateRange={plan.dateRange}
              isNew={plan.isNew ?? false}
              onEdit={() => console.log(`${plan.title} 수정`)}
              onDelete={() => console.log(`${plan.title} 삭제`)}
            />
          </div>
        ))}

        <div className='max-h-[372px] w-full max-w-[347px] overflow-hidden rounded-2xl bg-[#F8FBFD] shadow-md'>
          <PlannerAddButton />
        </div>
      </div>
    </section>
  );
};

export default MyPlannerPage;
