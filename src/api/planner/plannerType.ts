export type Plan = {
  // id: number;
  // region_id: number | null;
  // title: string;
  // description: string;
  // subregion_id: number;
  // created_at: string;
  // updated_at: string;
  id: number;
  title: string;
  description: string;
  dateRange: string;
  isNew?: boolean;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
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

// plannerType.ts에 추가할 타입들
export type TimeSlot = {
  id: number | null;
  place: Place | null;
  visit_date: string;
  visit_time: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Place = {
  id: number;
  content_id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone_number: string;
  use_time: string;
  link_url: string;
  image_url: string;
  category: {
    id: number;
    name: string;
  };
  sub_category: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
  sub_region: {
    id: number;
    name: string;
  };
  favorite_count: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type PlanDetail = {
  id: number;
  title: string;
  description: string;
  region_id: number;
  subregion_id: number;
  start_date: string | null;
  end_date: string | null;
  selected_places: Place[];
  time_slots: TimeSlot[];
  created_at: string;
  updated_at: string;
};

export type AddPlaceToPlanRequest = {
  place_id: number;
};

export type AddPlaceToPlanResponse = PlanDetail;

export type PlanDisplay = Plan & {
  dateRange: string;
  isNew?: boolean;
};

export type UpdatePlanRequest = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  places: {
    place_id: number | null;
    visit_date: string;
    visit_time: string;
  }[];
};

export type UpdatePlanResponse = PlanDetail;
