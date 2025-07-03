// src/pages/PlannerPage.tsx

import Button from '@/components/common/Button';
import Container from '@/components/common/Container';
import PlannerMap from '@/components/domain/planner/PlannerMap';
import SchedulePlanner from '@/components/domain/planner/SchedulePlanner';
import PlannerSidebar from '@/components/domain/planner/PlannerSidebar';
import type { PlannerPlace, TimeSlotData } from '@/types/plannerType';
import { useCallback, useEffect, useReducer } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

// --- 상태 및 액션 타입 정의 ---

type PlannerState = {
  schedule: TimeSlotData[];
};

type PlannerAction =
  | {
      type: 'MOVE_PLACE';
      payload: {
        sourceTime: string | null;
        sourceDay: number | null;
        targetTime: string;
        targetDay: number;
        place: PlannerPlace;
      };
    }
  | { type: 'REMOVE_PLACE'; payload: { timeSlotId: string } };

// --- Reducer 함수 ---

const reducer = (state: PlannerState, action: PlannerAction): PlannerState => {
  switch (action.type) {
    case 'MOVE_PLACE': {
      const { sourceTime, sourceDay, targetTime, targetDay, place } =
        action.payload;

      // 1. 원본 스케줄에서 드래그된 장소를 먼저 제거 (중복 방지)
      let cleanedSchedule = state.schedule.map((slot) =>
        slot.place?.id === place.id ? { ...slot, place: null } : slot
      );

      // 2. 타겟 위치의 인덱스 찾기 (day와 time 모두 일치)
      const targetIdx = cleanedSchedule.findIndex(
        (s) => s.day === targetDay && s.time === targetTime
      );
      if (targetIdx === -1) return state;

      // 3. (스왑 대비) 타겟 위치에 원래 있던 아이템 기억
      const itemOriginallyAtTarget = cleanedSchedule[targetIdx].place;

      // 4. 타겟 위치에 드래그된 아이템 놓기
      cleanedSchedule[targetIdx] = {
        ...cleanedSchedule[targetIdx],
        place,
      };

      // 5. 스왑 로직: 타임라인 내부 이동이었고, 타겟에 다른 아이템이 있었다면
      if (sourceTime && sourceDay && itemOriginallyAtTarget) {
        const sourceIdx = cleanedSchedule.findIndex(
          (s) => s.day === sourceDay && s.time === sourceTime
        );
        if (sourceIdx !== -1) {
          cleanedSchedule[sourceIdx] = {
            ...cleanedSchedule[sourceIdx],
            place: itemOriginallyAtTarget,
          };
        }
      }

      return { ...state, schedule: cleanedSchedule };
    }

    case 'REMOVE_PLACE': {
      const { timeSlotId } = action.payload;
      const newSchedule = state.schedule.map((s) =>
        s.timeSlotId === timeSlotId ? { ...s, place: null } : s
      );
      return { ...state, schedule: newSchedule };
    }

    default:
      return state;
  }
};

// --- 초기 데이터 생성 함수 ---

const generateInitialSchedule = (days: number): TimeSlotData[] => {
  const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
  let schedule: TimeSlotData[] = [];
  for (let day = 1; day <= days; day++) {
    for (const time of times) {
      schedule.push({
        day,
        time,
        place: null,
        timeSlotId: `day${day}-time${time}`, // 고유 ID 부여
      });
    }
  }
  return schedule;
};

// --- 페이지 컴포넌트 ---

const PlannerPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    schedule: generateInitialSchedule(7), // 7일치 데이터 생성
  });

  // 사이드바에 표시될 장소 목록 (실제로는 API로 받아옴)
  const availablePlaces: PlannerPlace[] = [
    { id: '1', title: '가로수길', category: '맛집/카페' },
    { id: '2', title: '경복궁', category: '역사/문화' },
    { id: '3', title: 'SM타운', category: '엔터테인먼트' },
    { id: '4', title: '하이브', category: '엔터테인먼트' },
    { id: '5', title: 'JYP', category: '엔터테인먼트' },
    { id: '6', title: 'YG', category: '엔터테인먼트' },
  ];

  // Drag & Drop 모니터 설정
  useEffect(() => {
    const cleanup = monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        if (!location.current.dropTargets.length) return;

        const target = location.current.dropTargets[0];
        const sourceData = source.data;
        const targetData = target.data;

        // 드래그 & 드롭 관련 데이터 추출
        const draggedPlace = sourceData.place as PlannerPlace;
        const sourceTime = (sourceData.originTime as string) || null;
        const sourceDay = (sourceData.originDay as number) || null; // DraggablePlaceCard에서 제공해야 함
        const targetTime = targetData.time as string;
        const targetDay = targetData.day as number; // TimeSlot에서 제공

        // 같은 위치에 드롭하는 것 방지
        if (sourceDay === targetDay && sourceTime === targetTime) return;

        // 상태 업데이트 액션 디스패치
        dispatch({
          type: 'MOVE_PLACE',
          payload: {
            sourceTime,
            sourceDay,
            targetTime,
            targetDay,
            place: draggedPlace,
          },
        });
      },
    });

    return cleanup;
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 장소 제거 핸들러
  const handleRemovePlace = useCallback((timeSlotId: string) => {
    dispatch({ type: 'REMOVE_PLACE', payload: { timeSlotId } });
  }, []);

  return (
    <div className='bg-bg-section'>
      <Container className='mt-16'>
        <div className='mb-4 text-center'>
          <h1 className='text-3xl font-bold'>플래너</h1>
          <p className='text-sub-text-gray mt-2'>
            드래그 앤 드롭으로 일정을 관리해보세요.
          </p>
        </div>

        <div className='flex h-screen w-full gap-4'>
          {/* 왼쪽 사이드바 */}
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

          {/* 중앙 플래너 */}
          <div className='flex-1'>
            <SchedulePlanner
              schedule={state.schedule}
              onRemovePlace={handleRemovePlace}
            />
          </div>

          {/* 오른쪽 맵 */}
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
