import { useMutation } from '@tanstack/react-query';
import { calendarAPI } from './calendarAPI';
import type { SyncCalendarParams } from './calendarType';

// 구글 캘린더 동기화 뮤테이션
export const useSyncCalendarMutation = () => {
  return useMutation({
    mutationFn: (params: SyncCalendarParams) =>
      calendarAPI.syncCalendar(params),
  });
};
