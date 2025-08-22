export type Place = {
  id: number;
  content_id: string | null;
  name: string;
  description: string | null;
  feature: string | null;
  category_id: number | null;
  sub_category_id: number | null;
  region_id: number;
  sub_region_id: number | null;
  latitude: number | null;
  longitude: number | null;
  favorite_count: number;
  created_at: string;
  updated_at: string;
};

export type Region = {
  id: number;
  name: string;
  description: string;
  feature: string;
};

export type SubRegion = {
  id: number;
  name: string;
  description: string | null;
  feature: string | null;
  region_id: number;
  latitude: number | null;
  longitude: number | null;
  favorite_count: number;
  created_at: string;
  updated_at: string;
};

export type PlacesResponse = {
  popular_subregions: SubRegion[];
  major_places: Place[];
  region: Region[];
  subregion: SubRegion[];
  user_recommended_places?: Place[]; // 인증 시에만 포함
};
