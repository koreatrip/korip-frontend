// hooks/useGoogleCalendarSync.ts
import { useToast } from '@/hooks/useToast';
import { calendarAPI } from '@/api/calendar/calendarAPI';
import { useSyncCalendarMutation } from '@/api/calendar/calendarHooks';
import { useTranslation } from 'react-i18next';

export const useGoogleCalendarSync = () => {
  const { showToast } = useToast();
  const { i18n } = useTranslation();
  const syncMutation = useSyncCalendarMutation();

  // 구글 로그인 시작
  const startGoogleAuth = async (planId: string) => {
    try {
      // state에 plan_id 저장
      sessionStorage.setItem('pending_calendar_sync_plan_id', planId);
      sessionStorage.setItem('pending_calendar_sync_lang', i18n.language);

      // 백엔드에서 auth_url 받기
      const response = await calendarAPI.getGoogleAuthUrl();

      // 팝업으로 구글 로그인 창 열기
      const popup = window.open(
        response.auth_url,
        'google_calendar_auth',
        'width=500,height=600,top=100,left=100'
      );

      // 팝업 차단 확인
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        showToast(
          '팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.',
          'error'
        );
        return;
      }

      // ✅ 팝업 닫힘 감지 후 자동으로 동기화
      const checkClosed = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkClosed);

          showToast('구글 인증 완료! 캘린더에 일정을 추가하는 중...', 'info');

          // ✅ 실제 캘린더 동기화 호출
          try {
            await syncCalendar(planId, i18n.language);
          } catch (error) {
            // 에러는 syncCalendar 내부에서 처리됨
          }
        }
      }, 500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        '구글 인증을 시작할 수 없습니다. 로그인 상태를 확인해주세요.';
      showToast(errorMessage, 'error');
      console.error('구글 인증 시작 실패:', error);
    }
  };

  // 캘린더 동기화
  const syncCalendar = async (planId: string, lang: string = i18n.language) => {
    try {
      const response = await syncMutation.mutateAsync({
        plan_id: planId,
        lang,
      });

      showToast(response.message, 'success');

      if (response.calendar_url) {
        setTimeout(() => {
          if (window.confirm('구글 캘린더를 여시겠습니까?')) {
            window.open(response.calendar_url, '_blank');
          }
        }, 1000);
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        '캘린더 동기화에 실패했습니다. 다시 시도해주세요.';
      showToast(errorMessage, 'error');
      throw error;
    }
  };

  return {
    startGoogleAuth,
    syncCalendar,
    isLoading: syncMutation.isPending,
  };
};
