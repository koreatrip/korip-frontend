export type PlannerPlace = {
  id: string;
  title: string;
  category: string;
};

export type TimeSlotData = {
  time: string;
  place: PlannerPlace | null;
};
