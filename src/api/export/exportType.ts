export type PlanPlace = {
  time: string;
  place_name: string;
  category: string;
  place_id: number;
};

export type PlanScheduleDay = {
  day: number;
  date: string;
  places: PlanPlace[];
};

export type ExportPlanPdfDataResponse = {
  title: string;
  description: string;
  schedule: PlanScheduleDay[];
  created_at: string;
  lang: string;
};

export type ExportPlanPdfDataParams = {
  plan_id: string;
  lang?: string;
};
