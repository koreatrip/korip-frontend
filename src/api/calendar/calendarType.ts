export type GoogleCalendarCallbackParams = {
  code: string;
  state: string;
};

export type GoogleCalendarCallbackResponse = {
  message: string;
  google_email: string;
};

export type SyncCalendarParams = {
  plan_id: string;
  lang?: string;
};

export type SyncCalendarResponse = {
  message: string;
  event_count: number;
  calendar_url: string;
};

export type GoogleAuthUrlResponse = {
  auth_url: string;
};
