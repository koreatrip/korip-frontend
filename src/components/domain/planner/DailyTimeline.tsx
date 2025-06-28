import TimeSlot, { type TimeSlotData } from './TimeSlot';

/**
 * 선택된 날짜의 시간대별 타임라인을 보여줍니다.
 */
const DailyTimeline = () => {
  // 실제로는 API를 통해 해당 날짜의 일정 데이터를 받아옵니다.
  const timeSlots: TimeSlotData[] = [
    { time: '09:00' },
    {
      time: '11:00',
      place: { id: 'p1', title: '경복궁', category: '역사/문화' },
    }, // 장소가 있는 예시
    { time: '13:00' },
    { time: '15:00' },
    { time: '17:00' },
    { time: '19:00' },
    { time: '21:00' },
    { time: '23:00' },
  ];

  return (
    <div className='space-y-5'>
      {timeSlots.map((slot) => (
        <TimeSlot key={slot.time} {...slot} />
      ))}
    </div>
  );
};

export default DailyTimeline;
