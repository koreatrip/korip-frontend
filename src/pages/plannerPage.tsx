import Button from '@/components/common/Button';
import MyPageMenu from '@/components/domain/myPage/MyPageMenu';
import React, { useState } from 'react';

type TTimeSlot = {
  id: string;
  time: string;
  title: string;
  description: string;
};

type TPlaceItem = {
  id: string;
  name: string;
  category: string;
  type: string;
};

const PlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState('2025-07-01');
  const [selectedDay, setSelectedDay] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // 일차별 스케줄 데이터 - 각 일차마다 별도 저장
  const [daySchedules, setDaySchedules] = useState<Record<number, TTimeSlot[]>>({
    1: [
      { id: '1', time: '09:00', title: '가족수첩', description: '강원/강릉' },
      { id: '2', time: '11:00', title: '가족수첩', description: '강원/강릉' },
      { id: '3', time: '13:00', title: '가족수첩', description: '강원/강릉' },
      { id: '4', time: '15:00', title: '가족수첩', description: '강원/강릉' },
      { id: '5', time: '17:00', title: '가족수첩', description: '강원/강릉' },
      { id: '6', time: '19:00', title: '가족수첩', description: '강원/강릉' },
      { id: '7', time: '21:00', title: '', description: '' },
      { id: '8', time: '23:00', title: '', description: '' },
    ],
    2: [
      { id: '1', time: '09:00', title: '', description: '' },
      { id: '2', time: '11:00', title: '', description: '' },
      { id: '3', time: '13:00', title: '', description: '' },
      { id: '4', time: '15:00', title: '', description: '' },
      { id: '5', time: '17:00', title: '', description: '' },
      { id: '6', time: '19:00', title: '', description: '' },
      { id: '7', time: '21:00', title: '', description: '' },
      { id: '8', time: '23:00', title: '', description: '' },
    ],
    3: [
      { id: '1', time: '09:00', title: '', description: '' },
      { id: '2', time: '11:00', title: '', description: '' },
      { id: '3', time: '13:00', title: '', description: '' },
      { id: '4', time: '15:00', title: '', description: '' },
      { id: '5', time: '17:00', title: '', description: '' },
      { id: '6', time: '19:00', title: '', description: '' },
      { id: '7', time: '21:00', title: '', description: '' },
      { id: '8', time: '23:00', title: '', description: '' },
    ],
  });

  // 현재 선택된 일차의 스케줄 가져오기
  const currentTimeSlots = daySchedules[selectedDay] || [];

  // 일정 요약 데이터
  const [scheduleSummary] = useState<PlaceItem[]>([
    { id: '1', name: '경복궁', category: '서울', type: '궁궐' },
    { id: '2', name: '북촌 한옥마을', category: '서울', type: '한옥마을' },
  ]);

  // 선택 장소들 데이터
  const [selectedPlaces] = useState<PlaceItem[]>([
    { id: '1', name: '경복궁', category: '서울', type: '궁궐' },
    { id: '2', name: '북촌 한옥마을', category: '서울', type: '한옥마을' },
    { id: '3', name: '명동 거리', category: '서울', type: '쇼핑가' },
  ]);

  // 즐겨찾는 장소들 데이터
  const [favoritePlaces] = useState<PlaceItem[]>([
    { id: '1', name: '제주도 해수욕장', category: '제주도', type: '해변' },
    { id: '2', name: '부산 광안리', category: '부산', type: '해변' },
    { id: '3', name: '강릉 경포대', category: '강원도', type: '관광지' },
  ]);

  // 현재 일차의 시간대 내용만 지우기
  const clearTimeSlot = (id: string) => {
    const newTimeSlots = currentTimeSlots.map((slot) =>
      slot.id === id ? { ...slot, title: '', description: '' } : slot
    );
    setDaySchedules((prev) => ({
      ...prev,
      [selectedDay]: newTimeSlots,
    }));
  };

  // 저장 버튼 클릭 이벤트 핸들러
  const handleSaveButtonClick = () => {
    console.log('일정 저장');
  };

  // 드롭 시 기존 고정 시간대에 내용만 대체
  // 드롭 이벤트 핸들러
  const handleItemDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    setIsDragOver(false);
    setDraggedOverIndex(null);

    const placeData = e.dataTransfer.getData('text/plain');

    try {
      // 왼쪽 장소에서 드래그한 경우만 처리
      if (placeData) {
        const item = JSON.parse(placeData) as PlaceItem;

        if (typeof targetIndex === 'number' && currentTimeSlots[targetIndex]) {
          // 현재 일차의 시간 슬롯에 내용만 대체
          const newTimeSlots = [...currentTimeSlots];
          newTimeSlots[targetIndex] = {
            ...newTimeSlots[targetIndex],
            title: item.name,
            description: item.category,
          };
          setDaySchedules((prev) => ({
            ...prev,
            [selectedDay]: newTimeSlots,
          }));
        }
      }
    } catch (error) {
      console.error('드래그 데이터 파싱 오류:', error);
    }
  };

  // 현재 일차의 일정 내용 교체 (시간은 그대로 유지, 내용만 바꿈)
  const swapTimeSlotContent = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) return;

    const newTimeSlots = [...currentTimeSlots];
    const draggedContent = {
      title: currentTimeSlots[dragIndex].title,
      description: currentTimeSlots[dragIndex].description,
    };
    const hoverContent = {
      title: currentTimeSlots[hoverIndex].title,
      description: currentTimeSlots[hoverIndex].description,
    };

    // 내용만 교체, 시간과 ID는 그대로 유지
    newTimeSlots[dragIndex] = {
      ...newTimeSlots[dragIndex],
      title: hoverContent.title,
      description: hoverContent.description,
    };
    newTimeSlots[hoverIndex] = {
      ...newTimeSlots[hoverIndex],
      title: draggedContent.title,
      description: draggedContent.description,
    };

    setDaySchedules((prev) => ({
      ...prev,
      [selectedDay]: newTimeSlots,
    }));
  };

  // 드래그 오버 효과
  // 드래그 오버 이벤트 핸들러
  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  // 드래그 리브 이벤트 핸들러
  const handleItemDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // 드롭 영역을 완전히 벗어났을 때만 상태 초기화
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
      setDraggedOverIndex(null);
    }
  };

  // 드래그 엔드 이벤트 핸들러
  const handleItemDragEnd = () => {
    setDraggedItemId(null);
    setIsDragOver(false);
    setDraggedOverIndex(null);
  };

  // 드래그 가능한 카드 컴포넌트
  const DraggableCard: React.FC<{ item: PlaceItem }> = ({ item }) => (
    <div
      className='cursor-move rounded-lg border-l-4 border-l-sub-green bg-gray-50 p-4 transition-shadow hover:shadow-md'
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(item));
      }}
    >
      <div className='mb-1 flex items-center gap-2'>
        <h3 className='text-base font-medium text-gray-900'>{item.name}</h3>
      </div>
      <p className='text-base text-gray-500'>{item.category}</p>
    </div>
  );

  return (
    <div className='mx-auto w-full max-w-[1440px] px-4 md:px-6'>
      <div className='hidden items-start py-6 md:flex'>
        {/* 왼쪽 컬럼: 사이드바와 3개 박스를 세로로 배치 */}
        <div className='flex flex-col' style={{ width: '326px' }}>
          {/* 사이드바 */}
          <aside>
            <MyPageMenu />
          </aside>

          {/* 3개 박스 수직 정렬 - 사이드바와 같은 위치에 정렬 */}
          <div className='mt-6 flex flex-col gap-6 md:ml-[-40px]'>
            {/* 일정 요약 */}
            <div
              className='rounded-lg bg-white p-6 shadow-sm'
              style={{ width: '326px', height: '312px' }}
            >
              <h3 className='mb-4 text-lg font-medium text-gray-900'>일정 요약</h3>
              <div
                className='space-y-3 overflow-y-auto'
                style={{ maxHeight: '240px' }}
              >
                {scheduleSummary.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* 선택된 장소들 */}
            <div
              className='rounded-lg bg-white p-6 shadow-sm'
              style={{ width: '326px', height: '438px' }}
            >
              <h3 className='mb-4 text-lg font-medium text-gray-900'>선택된 장소들</h3>
              <div
                className='space-y-3 overflow-y-auto'
                style={{ maxHeight: '366px' }}
              >
                {selectedPlaces.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* 즐겨찾는 장소들 */}
            <div
              className='rounded-lg bg-white p-6 shadow-sm'
              style={{ width: '326px', height: '438px' }}
            >
              <h3 className='mb-4 font-medium text-gray-900'>
                즐겨찾는 장소들
              </h3>
              <div
                className='space-y-3 overflow-y-auto'
                style={{ maxHeight: '366px' }}
              >
                {favoritePlaces.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 10px 간격 */}
        <div style={{ width: '10px' }}></div>

        {/* 메인 콘텐츠 */}
        <div className='space-y-6' style={{ width: '1090px' }}>
          {/* 제목 */}
          <div>
            <h1 className='mb-2 text-4xl font-bold text-gray-900'>
              일정 수정하기
            </h1>
            <p className='text-base text-gray-600'>일정을 수정해보세요</p>
          </div>

          {/* 사용법 박스 */}
          <div
            className='flex items-center rounded-lg border border-amber-400 bg-amber-50 p-4'
            style={{ height: '67px' }}
          >
            <p className='text-sm text-main-text-navy'>
              💡사용법: 왼쪽 명소를 드래그 해서 가운데 시간대에 놓으세요. 날짜와
              시간을 자유롭게 조정할 수 있습니다.
            </p>
          </div>

          {/* 지도 영역 */}
          <div
            className='rounded-lg bg-white p-6 shadow-sm'
            style={{ height: '475px' }}
          >
            <div
              className='flex items-center justify-center rounded-lg bg-gray-100'
              style={{ height: '427px' }}
            >
              <div className='text-center'>
                <div className='mb-2 text-4xl text-gray-400'>🗺️</div>
                <p className='font-medium text-gray-500'>
                  지도 API 연결 후 사용 가능
                </p>
                <p className='mt-1 text-sm text-gray-400'>
                  현재 위치와 선택된 장소들이 표시됩니다
                </p>
              </div>
            </div>
          </div>

          {/* 날짜 선택 및 시간별 일정 통합 박스 */}
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            {/* 날짜 선택 */}
            <div className='mb-4'>
              <div className='flex w-full items-center gap-4'>
                <div className='flex-1'>
                  <input
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-sub-green'
                  />
                </div>
                <span className='font-medium text-gray-500'>~</span>
                <div className='flex-1'>
                  <input
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-sub-green'
                  />
                </div>
              </div>
            </div>

            {/* 일차 선택 탭 */}
            <div className='mb-4 flex gap-6'>
              {[1, 2, 3].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative px-2 py-1 font-medium transition-colors ${
                    selectedDay === day
                      ? 'text-sub-green'
                      : 'text-gray-700 hover:text-sub-green'
                  }`}
                >
                  {day}일차 (7/{day})
                  {selectedDay === day && (
                    <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-sub-green'></div>
                  )}
                </button>
              ))}
            </div>

            {/* 시간별 일정 */}

            <div
              className={`min-h-64 rounded-lg border-2 border-none p-4 transition-all duration-300 ease-in-out ${
                isDragOver
                  ? 'border-sub-green bg-green-50 shadow-lg'
                  : 'border-gray-300'
              }`}
              onDragOver={handleItemDragOver}
              onDragLeave={handleItemDragLeave}
              onDrop={handleItemDrop}
            >
              {currentTimeSlots.length === 0 ? (
                <div className='py-8 text-center'>
                  <p className='text-gray-500'>
                    왼쪽에서 장소를 드래그해서 추가해보세요
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {currentTimeSlots.map((slot, index) => (
                    <React.Fragment key={slot.id}>
                      <div
                        className={`flex items-center rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100 hover:shadow-md ${
                          draggedItemId === slot.id
                            ? 'scale-95 opacity-50 shadow-lg'
                            : 'scale-100 opacity-100'
                        } ${
                          slot.title
                            ? 'cursor-move'
                            : 'cursor-default bg-gray-100'
                        }`}
                        style={{ height: '80px' }}
                        draggable={!!slot.title}
                        onDragStart={(e) => {
                          if (slot.title) {
                            setDraggedItemId(slot.id);
                            e.dataTransfer.setData(
                              'application/json',
                              JSON.stringify({ type: 'timeSlot', index, slot })
                            );
                          } else {
                            e.preventDefault();
                          }
                        }}
                        onDragEnd={handleItemDragEnd}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const timeSlotData =
                            e.dataTransfer.getData('application/json');
                          const placeData =
                            e.dataTransfer.getData('text/plain');

                          try {
                            // 시간 슬롯 간 드래그인 경우 내용 교체
                            if (timeSlotData) {
                              const dragData = JSON.parse(timeSlotData);
                              if (
                                dragData.type === 'timeSlot' &&
                                dragData.index !== index
                              ) {
                                swapTimeSlotContent(dragData.index, index);
                              }
                            }
                            // 왼쪽 장소에서 드래그한 경우 내용 대체
                            else if (placeData) {
                              const item = JSON.parse(placeData) as PlaceItem;
                              const newTimeSlots = [...currentTimeSlots];
                              newTimeSlots[index] = {
                                ...newTimeSlots[index],
                                title: item.name,
                                description: item.category,
                              };
                              setDaySchedules((prev) => ({
                                ...prev,
                                [selectedDay]: newTimeSlots,
                              }));
                            }
                          } catch (error) {
                            console.error('드롭 데이터 파싱 오류:', error);
                          }
                        }}
                      >
                        {/* 시간 표시 (고정) */}
                        <div className='w-20 flex-shrink-0'>
                          <div className='text-center text-sm font-medium text-gray-600'>
                            {slot.time}
                          </div>
                        </div>

                        {/* 내용 영역 - 초록색 테두리로 감싸기 */}
                        <div className='flex flex-1 items-center gap-4 rounded-r-lg border-l-4 border-l-sub-green pl-4'>
                          {/* 제목과 설명 */}
                          <div className='min-w-0 flex-1'>
                            {slot.title ? (
                              <>
                                <input
                                  type='text'
                                  value={slot.title}
                                  onChange={(e) => {
                                    const updatedSlots = currentTimeSlots.map(
                                      (s) =>
                                        s.id === slot.id
                                          ? { ...s, title: e.target.value }
                                          : s
                                    );
                                    setDaySchedules((prev) => ({
                                      ...prev,
                                      [selectedDay]: updatedSlots,
                                    }));
                                  }}
                                  className='mb-1 w-full border-none bg-transparent text-sm font-medium text-gray-900 focus:outline-none'
                                  placeholder='장소명을 입력하세요'
                                />
                                <input
                                  type='text'
                                  value={slot.description}
                                  onChange={(e) => {
                                    const updatedSlots = currentTimeSlots.map(
                                      (s) =>
                                        s.id === slot.id
                                          ? {
                                              ...s,
                                              description: e.target.value,
                                            }
                                          : s
                                    );
                                    setDaySchedules((prev) => ({
                                      ...prev,
                                      [selectedDay]: updatedSlots,
                                    }));
                                  }}
                                  className='w-full border-none bg-transparent text-xs text-gray-500 focus:outline-none'
                                  placeholder='설명을 입력하세요'
                                />
                              </>
                            ) : (
                              <div className='py-4 text-sm text-gray-400'>
                                왼쪽에서 장소를 드래그해서 추가하세요
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 지우기 버튼 - 내용이 있을 때만 표시 */}
                        {slot.title && (
                          <button
                            onClick={() => clearTimeSlot(slot.id)}
                            className='ml-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-400 transition-all hover:border-gray-400 hover:text-gray-600'
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className='flex justify-end'>
            <Button
              onClick={handleSaveButtonClick}
              className='w-[280px] h-[56px]'
            >
              일정 완성
            </Button>
          </div>
        </div>
      </div>

      {/* 태블릿 레이아웃 */}
      <div className='hidden py-6 md:block lg:hidden'>
        <div className='space-y-6'>
          <div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              일정 수정하기
            </h1>
            <p className='text-base text-gray-600'>일정을 수정해보세요</p>
          </div>

          {/* 사용법 박스 */}
          <div className='flex items-center rounded-lg border border-amber-400 bg-amber-50 p-4'>
            <p className='text-sm text-main-text-navy'>
              💡사용법: 왼쪽 명소를 드래그 해서 가운데 시간대에 놓으세요. 날짜와
              시간을 자유롭게 조정할 수 있습니다.
            </p>
          </div>

          {/* 3개 박스 가로 정렬 */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                일정 요약
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '200px' }}
              >
                {scheduleSummary.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                선택된 장소들
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '200px' }}
              >
                {selectedPlaces.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                즐겨찾는 장소들
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '200px' }}
              >
                {favoritePlaces.map((item) => (
                  <DraggableCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* 날짜 선택 및 시간별 일정 통합 박스 */}
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <div className='mb-4'>
              <div className='flex w-full items-center gap-4'>
                <div className='flex-1'>
                  <input
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-sub-green'
                  />
                </div>
                <span className='font-medium text-gray-500'>~</span>
                <div className='flex-1'>
                  <input
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-sub-green'
                  />
                </div>
              </div>
            </div>

            <div className='mb-4 flex gap-6'>
              {[1, 2, 3].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative px-2 py-1 font-medium transition-colors ${
                    selectedDay === day
                      ? 'text-sub-green'
                      : 'text-gray-700 hover:text-sub-green'
                  }`}
                >
                  {day}일차 (7/{day})
                  {selectedDay === day && (
                    <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-sub-green'></div>
                  )}
                </button>
              ))}
            </div>

            <div
              className={`min-h-64 rounded-lg border-2 border-none p-4 transition-all duration-300 ease-in-out ${
                isDragOver
                  ? 'border-sub-green bg-green-50 shadow-lg'
                  : 'border-gray-300'
              }`}
              onDragOver={handleItemDragOver}
              onDragLeave={handleItemDragLeave}
              onDrop={handleItemDrop}
            >
              {currentTimeSlots.length === 0 ? (
                <div className='py-8 text-center'>
                  <p className='text-gray-500'>
                    왼쪽에서 장소를 드래그해서 추가해보세요
                  </p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {currentTimeSlots.map((slot, index) => (
                    <React.Fragment key={slot.id}>
                      <div
                        className={`flex items-center rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100 hover:shadow-md ${
                          draggedItemId === slot.id
                            ? 'scale-95 opacity-50 shadow-lg'
                            : 'scale-100 opacity-100'
                        } ${
                          slot.title
                            ? 'cursor-move'
                            : 'cursor-default bg-gray-100'
                        }`}
                        style={{ height: '60px' }}
                        draggable={!!slot.title}
                        onDragStart={(e) => {
                          if (slot.title) {
                            setDraggedItemId(slot.id);
                            e.dataTransfer.setData(
                              'application/json',
                              JSON.stringify({ type: 'timeSlot', index, slot })
                            );
                          } else {
                            e.preventDefault();
                          }
                        }}
                        onDragEnd={handleItemDragEnd}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const timeSlotData =
                            e.dataTransfer.getData('application/json');
                          const placeData =
                            e.dataTransfer.getData('text/plain');

                          try {
                            if (timeSlotData) {
                              const dragData = JSON.parse(timeSlotData);
                              if (
                                dragData.type === 'timeSlot' &&
                                dragData.index !== index
                              ) {
                                swapTimeSlotContent(dragData.index, index);
                              }
                            } else if (placeData) {
                              const item = JSON.parse(placeData) as PlaceItem;
                              const newTimeSlots = [...currentTimeSlots];
                              newTimeSlots[index] = {
                                ...newTimeSlots[index],
                                title: item.name,
                                description: item.category,
                              };
                              setDaySchedules((prev) => ({
                                ...prev,
                                [selectedDay]: newTimeSlots,
                              }));
                            }
                          } catch (error) {
                            console.error('드롭 데이터 파싱 오류:', error);
                          }
                        }}
                      >
                        <div className='w-16 flex-shrink-0'>
                          <div className='text-center text-sm font-medium text-gray-600'>
                            {slot.time}
                          </div>
                        </div>

                        <div className='flex flex-1 items-center gap-4 rounded-r-lg border-l-4 border-l-sub-green pl-3'>
                          <div className='min-w-0 flex-1'>
                            {slot.title ? (
                              <>
                                <input
                                  type='text'
                                  value={slot.title}
                                  onChange={(e) => {
                                    const updatedSlots = currentTimeSlots.map(
                                      (s) =>
                                        s.id === slot.id
                                          ? { ...s, title: e.target.value }
                                          : s
                                    );
                                    setDaySchedules((prev) => ({
                                      ...prev,
                                      [selectedDay]: updatedSlots,
                                    }));
                                  }}
                                  className='mb-1 w-full border-none bg-transparent text-sm font-medium text-gray-900 focus:outline-none'
                                  placeholder='장소명을 입력하세요'
                                />
                                <input
                                  type='text'
                                  value={slot.description}
                                  onChange={(e) => {
                                    const updatedSlots = currentTimeSlots.map(
                                      (s) =>
                                        s.id === slot.id
                                          ? {
                                              ...s,
                                              description: e.target.value,
                                            }
                                          : s
                                    );
                                    setDaySchedules((prev) => ({
                                      ...prev,
                                      [selectedDay]: updatedSlots,
                                    }));
                                  }}
                                  className='w-full border-none bg-transparent text-xs text-gray-500 focus:outline-none'
                                  placeholder='설명을 입력하세요'
                                />
                              </>
                            ) : (
                              <div className='py-3 text-sm text-gray-400'>
                                왼쪽에서 장소를 드래그해서 추가하세요
                              </div>
                            )}
                          </div>
                        </div>

                        {slot.title && (
                          <button
                            onClick={() => clearTimeSlot(slot.id)}
                            className='ml-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-400 transition-all hover:border-gray-400 hover:text-gray-600'
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={handleSaveButtonClick}
              className='rounded-lg bg-main-pink font-medium text-white transition-colors hover:bg-main-hover-pink'
              style={{ width: '200px', height: '48px' }}
            >
              일정 완성
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className='block py-4 md:hidden'>
        <div className='space-y-4'>
          <div>
            <h1 className='mb-2 text-xl font-bold text-gray-900'>
              일정 수정하기
            </h1>
            <p className='text-sm text-gray-600'>일정을 수정해보세요</p>
          </div>

          {/* 사용법 박스 */}
          <div className='rounded-lg border border-amber-400 bg-amber-50 p-3'>
            <p className='text-xs text-main-text-navy'>
              💡사용법: 드래그해서 시간대에 놓으세요.
            </p>
          </div>

          {/* 날짜 선택 */}
          <div className='rounded-lg bg-white p-4 shadow-sm'>
            <div className='mb-3'>
              <div className='flex w-full items-center gap-2'>
                <div className='flex-1'>
                  <input
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-transparent focus:ring-2 focus:ring-sub-green'
                  />
                </div>
                <span className='text-sm font-medium text-gray-500'>~</span>
                <div className='flex-1'>
                  <input
                    type='date'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className='w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-transparent focus:ring-2 focus:ring-sub-green'
                  />
                </div>
              </div>
            </div>

            <div className='mb-3 flex gap-4'>
              {[1, 2, 3].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative px-2 py-1 text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'text-sub-green'
                      : 'text-gray-700 hover:text-sub-green'
                  }`}
                >
                  {day}일차
                  {selectedDay === day && (
                    <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-sub-green'></div>
                  )}
                </button>
              ))}
            </div>

            {/* 시간별 일정 */}
            <div className='space-y-2'>
              {currentTimeSlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className='flex items-center rounded-lg bg-gray-50 p-3'
                  style={{ minHeight: '50px' }}
                >
                  <div className='w-12 flex-shrink-0'>
                    <div className='text-center text-xs font-medium text-gray-600'>
                      {slot.time}
                    </div>
                  </div>

                  <div className='flex flex-1 items-center gap-2 border-l-4 border-l-sub-green pl-2'>
                    <div className='min-w-0 flex-1'>
                      {slot.title ? (
                        <>
                          <div className='text-xs font-medium text-gray-900'>
                            {slot.title}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {slot.description}
                          </div>
                        </>
                      ) : (
                        <div className='py-1 text-xs text-gray-400'>
                          드래그해서 추가
                        </div>
                      )}
                    </div>
                  </div>

                  {slot.title && (
                    <button
                      onClick={() => clearTimeSlot(slot.id)}
                      className='ml-2 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-400'
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3개 박스 세로 정렬 */}
          <div className='space-y-3'>
            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                일정 요약
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '150px' }}
              >
                {scheduleSummary.map((item) => (
                  <div
                    key={item.id}
                    className='rounded-lg border-l-4 border-l-sub-green bg-gray-50 p-2'
                  >
                    <div className='text-xs font-medium text-gray-900'>
                      {item.name}
                    </div>
                    <div className='text-xs text-gray-500'>{item.category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                선택된 장소들
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '150px' }}
              >
                {selectedPlaces.map((item) => (
                  <div
                    key={item.id}
                    className='rounded-lg border-l-4 border-l-sub-green bg-gray-50 p-2'
                  >
                    <div className='text-xs font-medium text-gray-900'>
                      {item.name}
                    </div>
                    <div className='text-xs text-gray-500'>{item.category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <h3 className='mb-3 text-sm font-medium text-gray-900'>
                즐겨찾는 장소들
              </h3>
              <div
                className='space-y-2 overflow-y-auto'
                style={{ maxHeight: '150px' }}
              >
                {favoritePlaces.map((item) => (
                  <div
                    key={item.id}
                    className='rounded-lg border-l-4 border-l-sub-green bg-gray-50 p-2'
                  >
                    <div className='text-xs font-medium text-gray-900'>
                      {item.name}
                    </div>
                    <div className='text-xs text-gray-500'>{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveButtonClick}
          >
            일정 완성
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;
