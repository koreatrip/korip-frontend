import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import PlannerMap from '@/components/domain/planner/PlannerMap';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';
import PlannerSidebar from '@/components/domain/planner/PlannerSidebar';
import type { PlannerPlace } from '@/types/plannerType';
import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { usePlannerStore } from '@/stores/usePlannerStore';

const PlannerPage = () => {
  const { schedule, movePlace, removePlace } = usePlannerStore();

  const availablePlaces: PlannerPlace[] = [
    { id: '1', title: '가로수길', category: '맛집/카페' },
    { id: '2', title: '경복궁', category: '역사/문화' },
    { id: '3', title: 'SM타운', category: '엔터테인먼트' },
    { id: '4', title: '하이브', category: '엔터테인먼트' },
    { id: '5', title: 'JYP', category: '엔터테인먼트' },
    { id: '6', title: 'YG', category: '엔터테인먼트' },
  ];

  useEffect(() => {
    const cleanup = monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        if (!location.current.dropTargets.length) return;

        const target = location.current.dropTargets[0];
        const sourceData = source.data;
        const targetData = target.data;

        const draggedPlace = sourceData.place as PlannerPlace;
        const sourceTime = (sourceData.originTime as string) || null;
        const sourceDay = (sourceData.originDay as number) || null;
        const targetTime = targetData.time as string;
        const targetDay = targetData.day as number;

        if (sourceDay === targetDay && sourceTime === targetTime) return;

        movePlace({
          sourceTime,
          sourceDay,
          targetTime,
          targetDay,
          place: draggedPlace,
        });
      },
    });
    return cleanup;
  }, [movePlace]);

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
        <div className='mb-9 flex w-full gap-4'>
          <div className='w-80 flex-shrink-0'>
            <PlannerSidebar places={availablePlaces} />
          </div>
          <div className='flex-1'>
            <SchedulePlanner schedule={schedule} onRemovePlace={removePlace} />
          </div>
          <div className='flex w-96 flex-shrink-0 flex-col'>
            <PlannerMap />
            <div className='mt-4'>
              <Button variant='active'>일정 저장하기</Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PlannerPage;
