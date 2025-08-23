import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoToHome = () => {
    navigate('/'); // 홈 페이지 경로로 수정
  };

  return (
    // 전체 페이지를 화면 중앙에 위치시키는 flex 컨테이너
    <div className='flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center'>
      {/* 콘텐츠를 담는 메인 컨테이너 */}
      <div className='flex w-full max-w-lg flex-col items-center'>
        {/* 404 에러 숫자 */}
        <h1 className='text-main-pink mb-4 text-9xl font-bold'>404</h1>

        {/* 메인 헤딩 */}
        <h2 className='text-main-text-navy mb-4 text-3xl font-semibold'>
          {t('common.title')}
        </h2>

        {/* 설명 텍스트 */}
        <p className='text-sub-text-gray mb-8 max-w-md'>
          {t('common.page_description')}
        </p>

        {/* 홈으로 가기 버튼 */}
        <Button onClick={handleGoToHome}>{t('common.button')}</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
