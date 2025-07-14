export type Location = {
  '1단계': string;
  '2단계': string;
  '3단계'?: string;
  '격자 X': number;
  '격자 Y': number;
  stationName?: string;
  areaNo?: number;
  searchedQuery?: string;
  displayName?: string;
};

export type LocationSearchResponse = {
  success: boolean;
  data?: Location;
  message?: string;
};

export type LocationSuggestionsResponse = {
  success: boolean;
  data: string[];
};

export type LocationAllResponse = {
  success: boolean;
  data: string[];
};
