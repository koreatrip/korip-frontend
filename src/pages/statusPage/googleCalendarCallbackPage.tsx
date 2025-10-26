import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { useGoogleCalendarSync } from '@/hooks/useGoogleCalendarSync';
import { calendarAPI } from '@/api/calendar/calendarAPI';
import { PulseLoader } from 'react-spinners';

const GoogleCalendarCallbackPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { syncCalendar } = useGoogleCalendarSync();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code || !state) {
          throw new Error('인증 정보가 없습니다.');
        }

        // 콜백 처리
        const response = await calendarAPI.handleGoogleCallback({
          code,
          state,
        });

        showToast(response.message, 'success');

        // 저장된 plan_id 가져오기
        const planId = sessionStorage.getItem('pending_calendar_sync_plan_id');
        const lang =
          sessionStorage.getItem('pending_calendar_sync_lang') || 'ko';

        if (planId) {
          // 실제 캘린더 동기화 실행
          await syncCalendar(planId, lang);

          // 세션 스토리지 정리
          sessionStorage.removeItem('pending_calendar_sync_plan_id');
          sessionStorage.removeItem('pending_calendar_sync_lang');

          // 일정 상세 페이지로 돌아가기
          navigate(`/mypage/plan/${planId}`);
        } else {
          // plan_id가 없으면 마이페이지로
          navigate('/mypage/plan');
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          '구글 캘린더 연동에 실패했습니다.';

        showToast(errorMessage, 'error');
        console.error('구글 캘린더 콜백 에러:', error);

        // 에러 발생 시 마이페이지로
        setTimeout(() => {
          navigate('/mypage/plan');
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, showToast, syncCalendar]);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <PulseLoader color='#5c5c5cff' />
    </div>
  );
};

export default GoogleCalendarCallbackPage;
