export type Place = {
  id: number;
  name: string;
  description: string;
  image?: string;
  category?: string;
  location?: string;
};

export type TravelPlan = {
  id: number;
  title: string;
  date: string;
  description: string;
  status?: 'planned' | 'ongoing' | 'completed';
};

export type Region = {
  id: number;
  name: string;
  description?: string;
};
