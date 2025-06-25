import Button from '../common/Button';

const ProfileCard = () => {
  // 사용자 이름과 이메일은 추후 props 또는 상태로 대체 예정
  const userName = 'Taeyul';
  const userEmail = 'taeyul@example.com';
  const userPhone = '010-1234-5678';
  const userFavoriteInterests = '여행, 사진, 음식';

  return (
    <section className='mb-6 w-full rounded-lg bg-white p-4 shadow-md'>
      <h2 className='mb-4 text-2xl font-semibold'>반갑습니다 {userName}님</h2>
      <section className='mb-6 rounded-md bg-gray-50 p-6 shadow-md'>
        {/* 상단 제목 + 버튼 */}
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-bold'>기본정보</h2>
          <div>
            <Button>
              <span className='flex h-1 w-12 items-center justify-center text-sm'>
                수정
              </span>
            </Button>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className='space-y-2 text-sm text-gray-700'>
          <p className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>이름</span> {userName}
          </p>
          <p className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>이메일</span> {userEmail}
          </p>
          <p className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>연락처</span> {userPhone}
          </p>
          <p className='mb-2 flex items-center justify-between'>
            <span className='font-medium'>관심사</span> {userFavoriteInterests}
          </p>
        </div>
      </section>

      <section className='mb-4 flex items-end justify-start bg-gray-50 p-4 shadow-md'>
        <div>계정 현황</div>
      </section>

      <section className='bg-slate-overlay mb-4 flex items-end justify-start p-4 shadow-md'>
        <div>보안 설정</div>
      </section>
    </section>
  );
};

export default ProfileCard;
