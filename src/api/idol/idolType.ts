export type IdolRequestPayload = {
  idol_name: string;
  agency?: string;
  related_info?: string;
  additional_notes?: string;
};

export type IdolRequestData = {
  id: number;
  user: string;
  idol_name: string;
  agency: string;
  related_info: string;
  additional_notes: string;
  created_at: string;
};

export type IdolRequestResponse = {
  message: string;
  data: IdolRequestData;
};
