import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import PlannerMap from '@/components/domain/planner/PlannerMap';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';
import PlannerSidebar from '@/components/domain/planner/PlannerSidebar';
import type { PlannerPlace } from '@/types/plannerType';
import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { usePlannerStore } from '@/stores/usePlannerStore';
import { Trans, useTranslation } from 'react-i18next';

const PlannerPage = () => {
  const { t } = useTranslation();

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
        {/* 헤더 영역 */}
        <div className='flex flex-col items-center justify-center'>
          <h1 className='mb-4 text-center text-2xl font-semibold md:text-3xl lg:text-4xl'>
            강계령이의 케이크 여정
          </h1>
          <p className='text-center text-sm md:text-base'>
            {t('travel.drag_attractions_to_schedule')}
          </p>
        </div>

        {/* 안내 메시지 */}
        <div className='border-point-gold text-main-text-navy mt-6 mb-6 rounded-lg border bg-[#F7F0E8] p-3 text-sm md:mt-7 md:mb-8'>
          <Trans
            i18nKey='travel.drag_instructions'
            components={{
              IconText: <span className='font-semibold' />,
            }}
          />
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className='mb-9'>
          {/* 모바일 레이아웃 (768px 미만) */}
          <div className='flex flex-col gap-4 md:hidden'>
            {/* 사이드바 */}
            <div className='w-full'>
              <PlannerSidebar places={availablePlaces} />
            </div>

            {/* 스케줄 플래너 */}
            <div className='w-full'>
              <SchedulePlanner
                schedule={schedule}
                onRemovePlace={removePlace}
              />
            </div>

            {/* 맵과 저장 버튼 */}
            <div className='w-full'>
              <PlannerMap />
              <div className='mt-4'>
                <Button variant='active' className='w-full'>
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </div>

          {/* 태블릿 레이아웃 (768px - 1024px) */}
          <div className='hidden flex-col gap-4 md:flex lg:hidden'>
            {/* 상단: 사이드바 */}
            <div className='w-full'>
              <PlannerSidebar places={availablePlaces} />
            </div>

            {/* 하단: 스케줄과 맵 */}
            <div className='flex gap-4'>
              <div className='flex-1'>
                <SchedulePlanner
                  schedule={schedule}
                  onRemovePlace={removePlace}
                />
              </div>
              <div className='w-80 flex-shrink-0'>
                <PlannerMap />
                <div className='mt-4'>
                  <Button variant='active' className='w-full'>
                    {t('common.save')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 데스크톱 레이아웃 (1024px 이상) - 기존 레이아웃 */}
          <div className='hidden w-full gap-4 lg:flex'>
            <div className='w-80 flex-shrink-0'>
              <PlannerSidebar places={availablePlaces} />
            </div>
            <div className='flex-1'>
              <SchedulePlanner
                schedule={schedule}
                onRemovePlace={removePlace}
              />
            </div>
            <div className='flex w-96 flex-shrink-0 flex-col'>
              <PlannerMap />
              <div className='mt-4'>
                <Button variant='active'>{t('common.save')}</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PlannerPage;
