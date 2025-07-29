import React, { useState } from 'react';

interface Place {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface TimeSlot {
  time: string;
  title: string;
  description: string;
  isActive?: boolean;
}

const TripEditPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('가족수첩');
  const [selectedDate, setSelectedDate] = useState('2025.07.01');
  
  // 사이드바 메뉴 데이터
  const sidebarItems = [
    { name: '서울 강북 수성', isActive: false },
    { name: '내 쥬의 장소', isActive: false },
    { name: '출저하는 장소', isActive: false },
    { name: '가족수첩', isActive: true, subItems: ['강원/강릉'] },
    { name: '경복궁', isActive: false, subItems: ['특별시/서울'] },
    { name: '롯데월드', isActive: false, subItems: ['특별시/서울'] },
    { name: '출저하는 장소들', isActive: false },
    { name: '가족수첩', isActive: false, subItems: ['강원/강릉'] },
    { name: '경복궁', isActive: false, subItems: ['특별시/서울'] },
    { name: '롯데월드', isActive: false, subItems: ['특별시/서울'] }
  ];

  // 일정 데이터
  const timeSlots: TimeSlot[] = [
    { time: '09:00', title: '가족수첩', description: '강원/강릉' },
    { time: '11:00', title: '가족수첩', description: '강원/강릉' },
    { time: '13:00', title: '가족수첩', description: '강원/강릉' },
    { time: '15:00', title: '가족수첩', description: '강원/강릉' },
    { time: '17:00', title: '가족수첩', description: '강원/강릉' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              홍길동
            </h1>
            <div className="flex items-center gap-4">
              <span className="bg-red-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                개인
              </span>
              <h2 className="text-2xl font-semibold text-gray-800">
                일정 수정하기
              </h2>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* 왼쪽: 사이드바 */}
          <div className="w-64">
            {/* 검색창 */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색할 장소를 드롭해 해서 기간로켄 시간로해 성송되세요. 날짜와 시간을 지정해서 호출할 수 있습니다."
                  className="w-full p-3 text-sm bg-orange-50 border border-orange-200 rounded-lg placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* 지도 */}
            <div className="mb-6">
              <div className="w-full h-64 bg-blue-100 rounded-lg border overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                  <span className="text-gray-600">지도 영역</span>
                </div>
              </div>
            </div>

            {/* 날짜 선택 */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="date"
                  value="2025-07-01"
                  className="flex-1 p-2 text-sm border border-gray-300 rounded"
                />
                <input
                  type="date" 
                  value="2025-07-01"
                  className="flex-1 p-2 text-sm border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* 탭 */}
            <div className="flex gap-1 mb-4">
              <button className="flex-1 py-2 px-3 text-sm bg-red-400 text-white rounded">
                1일차 (7/1)
              </button>
              <button className="flex-1 py-2 px-3 text-sm bg-gray-200 text-gray-600 rounded">
                2일차 (7/2)  
              </button>
              <button className="flex-1 py-2 px-3 text-sm bg-gray-200 text-gray-600 rounded">
                3일차 (7/3)
              </button>
            </div>

            {/* 사이드바 메뉴 목록 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 mb-3">선택 장소들</h3>
              {sidebarItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    item.isActive ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                  }`}>
                    <span className={`text-sm ${item.isActive ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                    {item.subItems && (
                      <button className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                        <span className="text-xs text-gray-600">+</span>
                      </button>
                    )}
                  </div>
                  {item.subItems && (
                    <div className="ml-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <div key={subIndex} className="text-xs text-gray-500 p-1">
                          {subItem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 일정표 */}
          <div className="flex-1">
            {/* 일정 리스트 */}
            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-start gap-4">
                  {/* 시간 */}
                  <div className="w-16 text-sm text-gray-600 mt-1">
                    {slot.time}
                  </div>
                  
                  {/* 일정 내용 */}
                  <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border relative">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{slot.title}</h3>
                      <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <span className="text-gray-400">+</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{slot.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripEditPage;