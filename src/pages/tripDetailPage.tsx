import { useState } from 'react';
import MyPageLayout from '@/components/domain/myPage/MyPageLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';

// interface TimeSlot {
//   time: string;
//   title: string;
//   description: string;
// }

// interface TripDay {
//   date: string;
//   day: number;
//   timeSlots: TimeSlot[];
// }

const TripDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedDay, setSelectedDay] = useState(1);

  // 더미 데이터
  const tripData = {
    title: '김동이와 망동이의 여행',
    period: '25.05.12 ~ 25.06.01',
    days: [
      {
        date: '25.05.12',
        day: 1,
        timeSlots: [
          { time: '09:00', title: '가족수첩', description: '강원/강릉' },
          { time: '11:00', title: '가족수첩', description: '강원/강릉' },
          { time: '13:00', title: '가족수첩', description: '강원/강릉' },
          { time: '15:00', title: '가족수첩', description: '강원/강릉' },
          { time: '17:00', title: '가족수첩', description: '강원/강릉' },
          { time: '19:00', title: '가족수첩', description: '강원/강릉' },
          { time: '21:00', title: '가족수첩', description: '강원/강릉' },
          { time: '23:00', title: '가족수첩', description: '강원/강릉' },
        ],
      },
    ],
  };

  const currentDay =
    tripData.days.find((day) => day.day === selectedDay) || tripData.days[0];

  return (
    <MyPageLayout>
      <div className='p-6'>
        {/* 헤더 */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            {tripData.title}
          </h1>
          <p className='text-gray-600'>{tripData.period}</p>
        </div>

        <div className='flex gap-8'>
          {/* 왼쪽: 일정 리스트 */}
          <div className='flex-1'>
            {/* 날짜 탭 및 시간별 일정 */}
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              {/* 날짜 탭 */}
              <div className='mb-6 flex gap-4'>
                {tripData.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      selectedDay === day.day
                        ? 'bg-[#4A9B8E] text-white'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    1일차 ({day.day}/1)
                  </button>
                ))}
                <button className='rounded-lg px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                  2일차 (7/2)
                </button>
                <button className='rounded-lg px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700'>
                  3일차 (7/3)
                </button>
              </div>

              {/* 시간별 일정 */}
              <div className='space-y-4'>
                {currentDay.timeSlots.map((slot, index) => (
                  <div key={index} className='flex items-start gap-4'>
                    {/* 시간 */}
                    <div className='mt-1 w-16 text-sm text-gray-600'>
                      {slot.time}
                    </div>

                    {/* 일정 내용 */}
                    <div className='flex-1 rounded-lg border-l-4 border-l-[#4A9B8E] bg-gray-50 p-4'>
                      <div className='mb-1 flex items-center gap-2'>
                        <h3 className='font-medium text-gray-900'>
                          {slot.title}
                        </h3>
                      </div>
                      <p className='text-sm text-gray-600'>
                        {slot.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 지도 */}
          <div className='flex w-96 flex-col'>
            <div className='rounded-lg bg-white p-6 shadow-sm'>
              <h3 className='mb-4 font-medium text-gray-900'>경복궁</h3>

              {/* 지도 플레이스홀더 */}
              <div className='mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-200'>
                <span className='text-gray-500'>지도 영역</span>
              </div>

              <div className='mb-4 space-y-2 text-sm text-gray-600'>
                <p>서울 종로구 사직로 161 경복궁</p>
                <p>오전 9시 - 오후 6시</p>
              </div>

              <div className='mb-6 space-y-1 text-sm text-gray-600'>
                <p>조선시대 철학</p>
                <p>민족 헌신 무궁한 꽃 끝에 철학 따뜻 자유</p>
              </div>
            </div>

            {/* 지도 하단 버튼 */}
            <div className='mt-4 flex gap-2'>
              <button className='flex-1 rounded-lg bg-[#FF6B7A] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e55a6e]'>
                구글캘린더 연동
              </button>
              <button className='flex-1 rounded-lg bg-[#FF6B7A] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e55a6e]'>
                PDF 저장하기
              </button>
            </div>

            {/* 하단 버튼 - 왼쪽 카드 끝부분까지 내려서 */}
            <div className='mt-auto flex justify-end gap-4 pt-8'>
              <button
                className='flex items-center justify-center rounded-lg bg-white text-[#FF6B7A] transition-colors hover:bg-gray-50'
                style={{ width: '52px', height: '56px' }}
              >
                <TrashIcon className='h-4 w-4' />
              </button>
              <button
                onClick={() => navigate(`/trip/${id}/edit`)}
                className='rounded-lg bg-[#FF6B7A] text-white transition-colors hover:bg-[#e55a6e]'
                style={{ width: '228px', height: '56px' }}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
};

export default TripDetailPage;
