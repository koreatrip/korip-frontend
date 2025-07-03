export type Place = {
  id: string;
  title: string;
  category: string;
};

export type TimeSlotData = {
  time: string;
  place: Place | null;
};
