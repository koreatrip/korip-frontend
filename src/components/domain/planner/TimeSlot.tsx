import { useState } from 'react';
/**
 * (09:00, 11:00 등 각 시간대 행. 장소를 드롭할 수 있는 영역)
 * @returns
 */
// --- 데이터 타입 정의 ---
// 각 시간대 슬롯의 데이터 타입을 정의합니다.
export type TimeSlotData = {
  time: string;
  place?: PlaceData; // 드롭된 장소 정보 (옵셔널)
};

// 장소 데이터 타입 (예시)
interface PlaceData {
  id: string;
  title: string;
  category: string;
}

// --- TimeSlot 컴포넌트 ---
// 타임라인의 각 행을 담당하는 컴포넌트입니다.
const TimeSlot = ({ time, place }: TimeSlotData) => {
  // isOver: 드래그 중인 아이템이 이 슬롯 위에 올라왔는지 여부 (D&D 라이브러리에서 상태를 받아옴)
  const [isOver, setIsOver] = useState(false);

  return (
    <div className='flex items-center gap-x-6'>
      {/* 시간 표시 */}
      <div className='text-main-text-navy w-12 text-right text-sm'>{time}</div>

      {/* 드롭 영역 */}
      <div
        // 드래그 중인 아이템이 위에 올라오면 배경색을 변경하여 시각적 피드백을 줍니다.
        className={`flex h-16 flex-1 items-center rounded-lg border-2 border-dashed transition-colors ${
          isOver ? 'border-sub-green bg-sub-green/50' : 'border-outline-gray'
        }`}
        // D&D 라이브러리에서 사용할 이벤트 핸들러 (예시)
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={() => {
          console.log(`${time}에 장소가 드롭되었습니다.`);
          setIsOver(false);
        }}
      >
        {place ? (
          // 장소가 드롭된 경우, 장소 카드를 보여줍니다.
          <div className='ml-4 font-semibold text-gray-700'>{place.title}</div>
        ) : (
          // 장소가 없는 경우, 플레이스홀더를 보여줍니다.
          <p className='text-sub-text-gray ml-4'>장소를 여기에 드래그하세요</p>
        )}
      </div>
    </div>
  );
};

export default TimeSlot;
