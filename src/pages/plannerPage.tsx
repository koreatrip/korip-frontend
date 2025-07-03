import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import PlannerMap from '@/components/domain/planner/PlannerMap';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';
import type { Place, TimeSlotData } from '@/types/plannerType';
import { useCallback, useEffect, useReducer } from 'react';
import PlannerSidebar from '@/components/domain/planner/PlannerSidebar';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
type PlannerState = {
  schedule: TimeSlotData[];
};

type PlannerAction =
  | {
      type: 'MOVE_PLACE';
      payload: { sourceTime: string | null; targetTime: string; place: Place };
    }
  | { type: 'REMOVE_PLACE'; payload: { placeId: string } };

const reducer = (state: PlannerState, action: PlannerAction): PlannerState => {
  switch (action.type) {
    case 'MOVE_PLACE': {
      const { sourceTime, targetTime, place } = action.payload;

      // 1. 복사를 원천 방지하기 위해, 현재 일정에서 드래그된 장소(place)를 모두 제거한
      //    깨끗한 버전의 스케줄을 만듭니다. 이것이 가장 중요한 단계입니다.
      let cleanedSchedule = state.schedule.map((slot) =>
        slot.place?.id === place.id ? { ...slot, place: null } : slot
      );

      // 2. 타겟 위치의 인덱스를 찾습니다.
      const targetIdx = cleanedSchedule.findIndex((s) => s.time === targetTime);
      if (targetIdx === -1) return state; // 타겟이 없으면 아무것도 하지 않음

      // 3. (스왑을 위해) 타겟 위치에 원래 어떤 아이템이 있었는지 기억해 둡니다.
      const itemOriginallyAtTarget = cleanedSchedule[targetIdx].place;

      // 4. 드래그된 아이템을 타겟 위치에 확실하게 놓습니다.
      cleanedSchedule[targetIdx].place = place;

      // 5. 만약 드래그가 타임라인 내부에서 시작되었고(sourceTime 존재),
      //    원래 타겟 위치에 다른 아이템이 있었다면(스왑 상황),
      //    그 다른 아이템을 원래 드래그가 시작된 위치(source)로 보냅니다.
      if (sourceTime && itemOriginallyAtTarget) {
        const sourceIdx = cleanedSchedule.findIndex(
          (s) => s.time === sourceTime
        );
        if (sourceIdx !== -1) {
          cleanedSchedule[sourceIdx].place = itemOriginallyAtTarget;
        }
      }

      // 6. 최종적으로 정리된 새로운 schedule로 상태를 업데이트합니다.
      return { ...state, schedule: cleanedSchedule };
    }

    case 'REMOVE_PLACE': {
      const { placeId } = action.payload;
      const newSchedule = state.schedule.map((s) =>
        s.place?.id === placeId ? { ...s, place: null } : s
      );
      return { ...state, schedule: newSchedule };
    }

    default:
      return state;
  }
};

const PlannerPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    schedule: [
      { time: '09:00', place: null },
      { time: '11:00', place: null },
      { time: '13:00', place: null },
    ],
  });

  const availablePlaces: Place[] = [
    { id: '1', title: '가로수길', category: '맛집/카페' },
    { id: '2', title: '경복궁', category: '역사/문화' },
  ];

  // ✅ PDD의 이벤트 모니터를 설정하는 useEffect
  useEffect(() => {
    // monitorForElements는 드래그 앤 드롭 이벤트를 감지하는 리스너를 반환합니다.
    const cleanup = monitorForElements({
      onDrop(args) {
        const { location, source } = args;

        // 드롭 영역 밖이나, 드롭할 수 없는 곳에 놓았으면 무시
        if (!location.current.dropTargets.length) {
          return;
        }

        const target = location.current.dropTargets[0];
        const sourceData = source.data;
        const targetData = target.data;

        const draggedPlace = sourceData.place as Place;
        const sourceTime = (sourceData.originTime as string) || null;
        const targetTime = targetData.time as string;

        // 자기 자신 위에 드롭하는 경우 무시 (타임라인 내 이동 시)
        if (sourceTime === targetTime) {
          return;
        }

        console.log('[PDD onDrop] draggedPlace:', draggedPlace);
        console.log('[PDD onDrop] sourceTime:', sourceTime);
        console.log('[PDD onDrop] targetTime:', targetTime);

        // 기존의 reducer 로직을 그대로 재사용
        dispatch({
          type: 'MOVE_PLACE',
          payload: { sourceTime, targetTime, place: draggedPlace },
        });
      },
    });

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return cleanup;
  }, []); // 빈 배열로 컴포넌트 마운트 시 한 번만 실행되도록 설정

  const handleRemovePlace = useCallback((placeId: string) => {
    dispatch({ type: 'REMOVE_PLACE', payload: { placeId } });
  }, []);

  return (
    <div className='bg-bg-section'>
      <Container className='mt-16'>
        {/* ... (제목, 설명 부분은 동일) */}

        {/* 🛑 DndContext는 제거합니다. */}
        <div className='flex h-screen w-full gap-4'>
          <div className='w-80 flex-shrink-0'>
            <PlannerSidebar
              places={availablePlaces}
              scheduledPlaceIds={
                state.schedule
                  .map((s) => s.place?.id)
                  .filter(Boolean) as string[]
              }
            />
          </div>

          <div className='flex-1'>
            <SchedulePlanner
              schedule={state.schedule}
              onRemovePlace={handleRemovePlace}
            />
          </div>

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
