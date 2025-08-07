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

export type TPlanner = {
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
};

export type TPlannerCardProps = TPlanner & {
  onEdit: () => void;
  onDelete: () => void;
};

export type PlaceData = {
  id: number;
  type: string; // 예: '궁궐', '한옥마을'
  title: string;
  description: string;
  details: string | null;
  location: string;
  imageUrl: string | null;
  isFavorite: boolean;
  createdAt: string; // ISO date string
};
