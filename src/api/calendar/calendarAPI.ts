import axiosInstance from '../axiosInstance';
import type {
  GoogleCalendarCallbackParams,
  GoogleCalendarCallbackResponse,
  SyncCalendarParams,
  SyncCalendarResponse,
} from './calendarType';

export const calendarAPI = {
  // 구글 캘린더 인증 URL 가져오기 (GET)
  getGoogleAuthUrl: async (): Promise<{ auth_url: string }> => {
    const response = await axiosInstance.get('/api/exports/auth/google/', {
      headers: {
        Accept: 'application/json',
      },
    });

    console.log('✅ API 응답:', response.data);
    return response.data;
  },

  // 구글 캘린더 콜백 처리 (GET)
  handleGoogleCallback: async (
    params: GoogleCalendarCallbackParams
  ): Promise<GoogleCalendarCallbackResponse> => {
    const response = await axiosInstance.get(
      '/api/exports/auth/google/callback/',
      {
        params: { code: params.code, state: params.state },
        headers: { Accept: 'application/json' },
      }
    );
    return response.data;
  },

  // 구글 캘린더에 일정 동기화 (POST)
  syncCalendar: async (
    params: SyncCalendarParams
  ): Promise<SyncCalendarResponse> => {
    const { plan_id, lang = 'ko' } = params;

    const response = await axiosInstance.post(
      `/api/exports/plans/${plan_id}/calendar/sync/`,
      {},
      {
        params: { lang },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
};
