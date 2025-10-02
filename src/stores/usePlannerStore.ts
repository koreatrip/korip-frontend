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
  ];
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
  startDate: string | null;
  endDate: string | null;

  movePlace: (payload: {
    sourceTime: string | null;
    sourceDay: number | null;
    targetTime: string;
    targetDay: number;
    place: PlannerPlace;
  }) => void;
  removePlace: (timeSlotId: string) => void;

  // 새로 추가
  setDateRange: (startDate: string | null, endDate: string | null) => void;
  getScheduledPlacesCount: () => number;
  getTripDuration: () => number;
}

// --- Zustand 스토어 생성 ---
export const usePlannerStore = create<PlannerState>((set, get) => ({
  schedule: generateInitialSchedule(7),
  startDate: null,
  endDate: null,

  // 날짜 범위 설정
  setDateRange: (startDate, endDate) => set({ startDate, endDate }),

  // 스케줄에 배치된 장소 개수 계산
  getScheduledPlacesCount: () => {
    const { schedule } = get();
    return schedule.filter((slot) => slot.place !== null).length;
  },

  // 여행 기간 계산 (일 단위)
  getTripDuration: () => {
    const { startDate, endDate } = get();
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 당일 포함
  },

  movePlace: (payload) =>
    set((state) => {
      const { sourceTime, sourceDay, targetTime, targetDay, place } = payload;
      const newSchedule = [...state.schedule];

      console.log('movePlace called:', {
        sourceTime,
        sourceDay,
        targetTime,
        targetDay,
        placeName: place.title,
      });

      if (sourceDay && sourceTime) {
        const sourceIdx = newSchedule.findIndex(
          (s) => s.day === sourceDay && s.time === sourceTime
        );
        const targetIdx = newSchedule.findIndex(
          (s) => s.day === targetDay && s.time === targetTime
        );

        console.log('Move within timeline:', {
          sourceIdx,
          targetIdx,
        });

        if (sourceIdx === -1 || targetIdx === -1) {
          console.warn('Source or target slot not found');
          return state;
        }

        const sourceSlot = newSchedule[sourceIdx];
        const targetSlot = newSchedule[targetIdx];

        newSchedule[targetIdx] = { ...targetSlot, place: sourceSlot.place };
        newSchedule[sourceIdx] = { ...sourceSlot, place: targetSlot.place };

        console.log('Swap completed');
      } else {
        const targetIdx = newSchedule.findIndex(
          (s) => s.day === targetDay && s.time === targetTime
        );

        console.log('Add from sidebar:', { targetIdx });

        if (targetIdx === -1) {
          console.warn('Target slot not found for add operation');
          return state;
        }

        newSchedule[targetIdx] = { ...newSchedule[targetIdx], place };

        console.log('Add completed');
      }

      console.log('Updated schedule length:', newSchedule.length);
      return { schedule: newSchedule };
    }),

  removePlace: (timeSlotId) =>
    set((state) => {
      console.log('removePlace called:', timeSlotId);
      return {
        schedule: state.schedule.map((s) =>
          s.timeSlotId === timeSlotId ? { ...s, place: null } : s
        ),
      };
    }),
}));
