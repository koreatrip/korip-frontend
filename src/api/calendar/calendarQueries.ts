import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { calendarAPI } from './calendarAPI';
import type { GoogleCalendarCallbackParams } from './calendarType';

export const calendarQueries = createQueryKeyStore({
  calendar: {
    callback: (params: GoogleCalendarCallbackParams) => ({
      queryKey: ['calendar', 'callback', params],
      queryFn: () => calendarAPI.handleGoogleCallback(params),
    }),
  },
});
