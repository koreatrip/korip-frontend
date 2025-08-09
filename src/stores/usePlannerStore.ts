import { create } from 'zustand';
import type { PlannerPlace, TimeSlotData } from '@/types/plannerType';

// --- 초기 데이터 생성 함수 (21:00, 23:00 추가) ---
const generateInitialSchedule = (days: number): TimeSlotData[] => {
  const times = [
    '09:00',
    '11:00',
    '13:00',
    '15:00',
    '17:00',
    '19:00',
    '21:00',
    '23:00',
  ]; // ✅ 21:00, 23:00 추가
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

// --- 스토어의 상태(State)와 액션(Action) 타입 정의 ---
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

      console.log('🚀 movePlace called:', {
        sourceTime,
        sourceDay,
        targetTime,
        targetDay,
        placeName: place.title,
      });

      if (sourceDay && sourceTime) {
        // --- 경우 1: 타임라인 내부에서 이동 (MOVE or SWAP) ---
        const sourceIdx = newSchedule.findIndex(
          (s) => s.day === sourceDay && s.time === sourceTime
        );
        const targetIdx = newSchedule.findIndex(
          (s) => s.day === targetDay && s.time === targetTime
        );

        console.log('📍 Move within timeline:', {
          sourceIdx,
          targetIdx,
          sourceSlot: sourceIdx !== -1 ? newSchedule[sourceIdx] : 'not found',
          targetSlot: targetIdx !== -1 ? newSchedule[targetIdx] : 'not found',
        });

        if (sourceIdx === -1 || targetIdx === -1) {
          console.warn('❌ Source or target slot not found');
          return state;
        }

        const sourceSlot = newSchedule[sourceIdx];
        const targetSlot = newSchedule[targetIdx];

        // 🔥 불변성을 지키기 위해 새로운 슬롯 객체를 생성하여 교체합니다.
        newSchedule[targetIdx] = { ...targetSlot, place: sourceSlot.place };
        newSchedule[sourceIdx] = { ...sourceSlot, place: targetSlot.place };

        console.log('✅ Swap completed');
      } else {
        // --- 경우 2: 사이드바에서 새로 추가 (ADD) ---
        const targetIdx = newSchedule.findIndex(
          (s) => s.day === targetDay && s.time === targetTime
        );

        console.log('📍 Add from sidebar:', {
          targetIdx,
          targetSlot: targetIdx !== -1 ? newSchedule[targetIdx] : 'not found',
        });

        if (targetIdx === -1) {
          console.warn('❌ Target slot not found for add operation');
          return state;
        }

        // 🔥 불변성을 지키기 위해 새로운 슬롯 객체를 생성합니다.
        newSchedule[targetIdx] = { ...newSchedule[targetIdx], place };

        console.log('✅ Add completed');
      }

      console.log('📊 Updated schedule length:', newSchedule.length);
      return { schedule: newSchedule };
    }),

  removePlace: (timeSlotId) =>
    set((state) => {
      console.log('🗑️ removePlace called:', timeSlotId);
      return {
        schedule: state.schedule.map((s) =>
          s.timeSlotId === timeSlotId ? { ...s, place: null } : s
        ),
      };
    }),
}));
