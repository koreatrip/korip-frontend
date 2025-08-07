import React, { useState } from 'react';
import MyPageLayout from '@/components/domain/myPage/MyPageLayout';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';

interface TimeSlot {
  time: string;
  title: string;
  description: string;
}

interface TripDay {
  date: string;
  day: number;
  timeSlots: TimeSlot[];
}

const TripDetailPage: React.FC = () => {
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
        ]
      }
    ]
  };

  const currentDay = tripData.days.find(day => day.day === selectedDay) || tripData.days[0];

  return (
    <MyPageLayout>
      <div className="p-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {tripData.title}
          </h1>
          <p className="text-gray-600">{tripData.period}</p>
        </div>

        <div className="flex gap-8">
          {/* 왼쪽: 일정 리스트 */}
          <div className="flex-1">
            {/* 날짜 탭 및 시간별 일정 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* 날짜 탭 */}
              <div className="flex gap-4 mb-6">
                {tripData.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`px-4 py-2 font-medium transition-colors rounded-lg ${
                      selectedDay === day.day
                        ? 'bg-[#4A9B8E] text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    1일차 ({day.day}/1)
                  </button>
                ))}
                <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  2일차 (7/2)
                </button>
                <button className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  3일차 (7/3)
                </button>
              </div>

              {/* 시간별 일정 */}
              <div className="space-y-4">
                {currentDay.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {/* 시간 */}
                    <div className="w-16 text-sm text-gray-600 mt-1">
                      {slot.time}
                    </div>
                    
                    {/* 일정 내용 */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border-l-4 border-l-[#4A9B8E]">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{slot.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{slot.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 지도 */}
          <div className="w-96 flex flex-col">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">경복궁</h3>
              
              {/* 지도 플레이스홀더 */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">지도 영역</span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>서울 종로구 사직로 161 경복궁</p>
                <p>오전 9시 - 오후 6시</p>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-6">
                <p>조선시대 철학</p>
                <p>민족 헌신 무궁한 꽃 끝에 철학 따뜻 자유</p>
              </div>
            </div>
            
            {/* 지도 하단 버튼 */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-[#FF6B7A] text-white py-3 px-4 rounded-lg text-sm hover:bg-[#e55a6e] transition-colors font-medium">
                구글캘린더 연동
              </button>
              <button className="flex-1 bg-[#FF6B7A] text-white py-3 px-4 rounded-lg text-sm hover:bg-[#e55a6e] transition-colors font-medium">
                PDF 저장하기
              </button>
            </div>
            
            {/* 하단 버튼 - 왼쪽 카드 끝부분까지 내려서 */}
            <div className="flex justify-end gap-4 mt-auto pt-8">
              <button className="flex items-center justify-center bg-white text-[#FF6B7A] rounded-lg hover:bg-gray-50 transition-colors" style={{width: '52px', height: '56px'}}>
                <TrashIcon className="h-4 w-4" />
              </button>
              <button 
                onClick={() => navigate(`/trip/${id}/edit`)}
                className="bg-[#FF6B7A] text-white rounded-lg hover:bg-[#e55a6e] transition-colors" 
                style={{width: '228px', height: '56px'}}
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