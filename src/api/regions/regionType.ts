// /api/regions/ (리전 '목록' 조회 시 사용되는 타입)
// 이 타입은 Swagger 문서와 일치하므로 그대로 둡니다.
export type Region = {
  id: number;
  name: string;
  name_en: string;
  description: string;
  feature: string;
  created_at: string;
  updated_at: string;
};

// 페이지네이션된 리전 목록 응답 타입
export type RegionsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  // results: Region[];
  regions: Region[];
};

// SubRegion 타입을 실제 데이터에 맞게 수정
export type SubRegion = {
  id: number;
  name: string;
  description: string;
  feature: string;
  favorite_count: number;
  latitude: number; // ✅ 누락된 필드 추가
  longitude: number; // ✅ 누락된 필드 추가
  regions?: number; // ❔ 데이터에 없으므로 옵셔널 처리
  created_at?: string; // ❔ 데이터에 없으므로 옵셔널 처리
  updated_at?: string; // ❔ 데이터에 없으므로 옵셔널 처리
};

export type SubRegionsResponse = {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: SubRegion[];
};

export type RegionDetail = {
  id: number;
  name: string;
  description: string; // ✅ description 필드 확인
  subregions: SubRegionsResponse;
};

export type RegionDetailResponse = {
  regions: RegionDetail;
};
