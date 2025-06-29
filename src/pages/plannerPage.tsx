import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import PlannerMap from '@/components/domain/planner/PlannerMap';
import PlannerSidebar from '@/components/domain/planner/PlannerSidebar';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';

const PlannerPage = () => {
  return (
    <div className='bg-bg-section'>
      <Container className='mt-16'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='mb-4 text-4xl font-semibold'>
            강계령이의 케이크 여정
          </h1>
          <p>선택한 명소들을 드래그 해 일정을 추가해보세요</p>
        </div>
        <div className='border-point-gold text-main-text-navy mt-7 mb-8 rounded-lg border bg-[#F7F0E8] p-3 text-sm'>
          <p>
            <span className='font-semibold'>💡사용법:</span> 왼쪽 명소를 드래그
            해서 가운데 시간대에 놓으세요. 날짜와 시간을 자유롭게 조정할 수
            있습니다.
          </p>
        </div>
        <div className='flex h-screen w-full gap-4'>
          {/* 1. 사이드바: 흰색 배경을 적용합니다. */}
          <div className='w-80 flex-shrink-0'>
            <PlannerSidebar />
          </div>

          {/* 2. 메인 플래너: 연한 회색 배경을 적용합니다. */}
          <div className='flex-1'>
            <SchedulePlanner />
          </div>

          {/* 3. 지도: 흰색 배경을 적용합니다. */}
          <div className='flex w-96 flex-shrink-0 flex-col'>
            <PlannerMap />
            <div className='mt-4'>
              <Button variant='active'>일정 저장하기 </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PlannerPage;
