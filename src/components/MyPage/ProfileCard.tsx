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

      {/* 기본정보 제목 + 수정 버튼 */}

      <section className='mb-6 rounded-md bg-gray-100 p-6 shadow-md'>
        {/* 제목 + 수정하기 버튼 */}
        <div className='mb-6 flex items-center justify-between'>
          <h3 className='text-lg font-bold'>기본정보</h3>
          <Button className='text-md h-4 w-14 justify-center align-middle text-sm'>
            수정
          </Button>
        </div>

        {/* 사용자 정보 */}
        <div className='space-y-4 text-sm text-slate-500'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>이름</span>
            {userName}
          </div>
          <hr className='border-t border-gray-200' />

          <div className='flex items-center justify-between'>
            <span className='font-medium'>이메일</span>
            {userEmail}
          </div>
          <hr className='border-t border-gray-200' />

          <div className='flex items-center justify-between'>
            <span className='font-medium'>연락처</span>
            {userPhone}
          </div>
          <hr className='border-t border-gray-200' />

          <div className='flex items-center justify-between'>
            <span className='font-medium'>관심사</span>
            <div className='flex flex-wrap justify-end gap-2'>
              {['#K-POP', '#한식', '#여행'].map((tag) => (
                <span
                  key={tag}
                  className='rounded-full bg-red-400 px-3 py-1 text-xs text-white'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <hr className='border-t border-gray-200' />
        </div>
      </section>

      {/* 계정현황*/}
      <section className='mb-6 rounded-md bg-gray-100 p-6 shadow-md'>
        {/* 제목 */}
        <h3 className='mb-4 text-lg font-bold text-slate-700'>계정 현황</h3>

        {/* 가입일 좌우 정렬 */}
        <div className='mb-4 flex items-center justify-between text-sm text-slate-600'>
          <span className='font-medium'>가입일</span>
          <span>2025.06.07</span>
        </div>

        <hr className='mb-6 border-t border-gray-200' />

        {/* 정보 박스 3개 */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {[
            { label: '여행 일정', count: 3 },
            { label: '즐겨찾기', count: 12 },
            { label: '방문장소', count: 28 },
          ].map(({ label, count }) => (
            <div
              key={label}
              className='flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-4 text-center shadow-sm'
            >
              <p className='text-lg font-bold text-red-600'>{count}</p>
              <p className='text-xs text-gray-500'>{label}</p>
            </div>
          ))}
        </div>
      </section>
      {/* 보안설정 */}
      <section className='mb-6 rounded-md bg-gray-100 p-6 shadow-md'>
        {/* 제목 */}
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-bold text-slate-700'>보안 설정</h3>
        </div>

        {/* 내용 */}
        <div className='space-y-4 text-sm text-slate-600'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>비밀번호</span>
            <span>*********</span>
          </div>
          <hr className='border-t border-gray-200' />

          <div className='flex items-center justify-between'>
            <span className='font-medium'>이메일 인증</span>
            <span className='border-r-teal-200'>완료됨</span>
          </div>
          <div className='flex items-center justify-end gap-2 pt-4'>
            <Button className='h-8 w-35 bg-white text-black'>
              비밀번호 변경
            </Button>
            <Button className='h-8 w-35 bg-white text-black'>계정탈퇴</Button>
          </div>
          <hr className='border-t border-gray-200' />
        </div>
      </section>
    </section>
  );
};

export default ProfileCard;
