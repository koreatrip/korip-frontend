import Button from '@/components/common/Button';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // React Router 사용

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login'); // 로그인 페이지 경로로 수정
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      {/* 콘텐츠를 담는 메인 컨테이너, 요소들을 세로(flex-col)로 정렬 */}
      <div className='flex w-full max-w-md flex-col items-center text-center'>
        {/* 상단 아이콘 */}
        <div className='mb-6'>
          <PaperAirplaneIcon className='h-10 w-10' />
        </div>

        {/* 메인 헤딩 */}
        <h2 className='text-main-text-navy mb-2 text-2xl font-bold'>
          임시 비밀번호가 발급되었습니다.
        </h2>

        {/* 설명 텍스트 */}
        <p className='text-sub-text-gray mb-2'>
          입력하신 이메일로 임시 비밀번호를 발송했습니다.
        </p>
        <p className='text-sub-text-gray mb-8'>
          로그인 후 새로운 비밀번호로 변경해주세요.
        </p>

        {/* 추가 안내 텍스트 */}
        <div className='text-main-pink mb-8 rounded-lg p-4 text-sm'>
          <p className='mb-1 font-bold'>이메일을 받지 못하셨나요?</p>
          <p>스팸함을 확인하거나 몇 분 후 다시 시도해주세요.</p>
        </div>

        {/* 로그인 버튼 */}
        <Button onClick={handleGoToLogin}>로그인 하러가기</Button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
