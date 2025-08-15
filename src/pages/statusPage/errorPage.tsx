import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const ErrorPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate('/'); // 홈 페이지 경로로 이동
  };

  const handleTryAgain = () => {
    window.location.reload(); // 현재 페이지 새로고침
  };

  return (
    // 전체 페이지를 화면 중앙에 위치시키는 flex 컨테이너
    <div className='bg-bg-white flex min-h-screen flex-col items-center justify-center px-4 text-center font-sans'>
      {/* 메인 콘텐츠 컨테이너 */}
      <div className='flex w-full max-w-xl flex-col items-center'>
        {/* Oops! 헤딩 */}
        <h1 className='text-main-pink mb-4 text-8xl font-bold'>Error</h1>

        {/* 부제목 */}
        <h2 className='text-main-text-navy mb-4 text-2xl font-semibold'>
          {t('common.error_generic_title')}
        </h2>

        {/* 설명 텍스트 */}
        <p className='text-sub-text-gray mb-8'>
          {t('common.error_generic_description')}
        </p>

        {/* 버튼 그룹 */}
        <div className='flex w-full gap-3'>
          <Button onClick={handleTryAgain}>{t('common.refresh_button')}</Button>
          <Button onClick={handleGoHome}>{t('common.button')}</Button>
        </div>
      </div>

      {/* 하단 에러 코드 정보 */}
      <div className='text-sub-text-gray absolute bottom-10 text-center text-xs'>
        <p className='mb-1'>Error Code: KR-500-TRAVEL</p>
        <p>
          If the problem persists, please share this code with our support team
          along with what you were trying to do.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
