import { create } from 'zustand';
import type { PlannerPlace, TimeSlotData } from '@/types/plannerType';

// --- 초기 데이터 생성 함수 (변경 없음) ---
const generateInitialSchedule = (days: number): TimeSlotData[] => {
  const times = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'];
  let schedule: TimeSlotData[] = [];
  for (let day = 1; day <= days; day++) {
    for (const time of times) {
      schedule.push({
        day,
        time,
        place: null,
        timeSlotId: `day${day}-time${time}`,
      });
    }
  }
  return schedule;
};

// --- 스토어의 상태(State)와 액션(Action) 타입 정의 (변경 없음) ---
interface PlannerState {
  schedule: TimeSlotData[];
  movePlace: (payload: {
    sourceTime: string | null;
    sourceDay: number | null;
    targetTime: string;
    targetDay: number;
    place: PlannerPlace;
  }) => void;
  removePlace: (timeSlotId: string) => void;
}

// --- Zustand 스토어 생성 ---
export const usePlannerStore = create<PlannerState>((set) => ({
  schedule: generateInitialSchedule(7),

  // ✅✅✅ movePlace 액션 로직 최종 수정 ✅✅✅
  movePlace: (payload) =>
    set((state) => {
      const { sourceTime, sourceDay, targetTime, targetDay, place } = payload;
      const newSchedule = [...state.schedule];

      if (sourceDay && sourceTime) {
        // --- 경우 1: 타임라인 내부에서 이동 (MOVE or SWAP) ---
        const sourceIdx = newSchedule.findIndex(
          (s) => s.day === sourceDay && s.time === sourceTime
        );
        const targetIdx = newSchedule.findIndex(
          (s) => s.day === targetDay && s.time === targetTime
        );

        if (sourceIdx === -1 || targetIdx === -1) return state;

        const sourceSlot = newSchedule[sourceIdx];
        const targetSlot = newSchedule[targetIdx];

        // 🔥 불변성을 지키기 위해 새로운 슬롯 객체를 생성하여 교체합니다.
        // 이것이 핵심 수정 사항입니다.
        newSchedule[targetIdx] = { ...targetSlot, place: sourceSlot.place };
        newSchedule[sourceIdx] = { ...sourceSlot, place: targetSlot.place };
      } else {
        // --- 경우 2: 사이드바에서 새로 추가 (ADD) ---
        const targetIdx = newSchedule.findIndex(
          (s) => s.day === targetDay && s.time === targetTime
        );
        if (targetIdx === -1) return state;

        // 🔥 불변성을 지키기 위해 새로운 슬롯 객체를 생성합니다.
        newSchedule[targetIdx] = { ...newSchedule[targetIdx], place };
      }

      return { schedule: newSchedule };
    }),

  removePlace: (timeSlotId) =>
    set((state) => ({
      schedule: state.schedule.map((s) =>
        s.timeSlotId === timeSlotId ? { ...s, place: null } : s
      ),
    })),
}));
