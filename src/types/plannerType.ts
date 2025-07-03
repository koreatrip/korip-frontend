export type PlannerPlace = {
  id: string;
  title: string;
  category: string;
};

export type TimeSlotData = {
  day: number;
  time: string;
  place: PlannerPlace | null;
  timeSlotId: string; // 고유 ID
};
