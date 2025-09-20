export type Plan = {
  id: number;
  region_id: number | null;
  title: string;
  description: string;
  subregion_id: number;
  created_at: string;
  updated_at: string;
};

export type PlansResponse = {
  plans: Plan[];
  favorite_regions: any[]; // 필요하면 더 구체적인 타입으로 변경
};

export type CreatePlanRequest = {
  name: string;
  description: string;
  destination: string;
  subregion_id: number;
};

export type CreatePlanResponse = {
  id: number;
};
