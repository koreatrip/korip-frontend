// --- 데이터 타입 정의 ---
// 이 컴포넌트가 필요로 하는 데이터의 타입을 정의합니다.
interface TripSummaryProps {
  duration: number; // 여행 기간 (일)
  totalPlaces: number; // 총 장소 수
  completedPlaces: number; // 배치 완료된 장소 수
  progress: number; // 진행률 (%)
  readOnly?: boolean;
}

/**
 * 일정요약 컴포넌트
 * @param param0
 * @returns
 */
// --- TripSummary 컴포넌트 ---
const TripSummary = ({
  duration,
  totalPlaces,
  completedPlaces,
  progress,
  readOnly = false,
}: TripSummaryProps) => {
  // 각 항목을 렌더링하기 위한 작은 헬퍼 컴포넌트
  const SummaryItem = ({ label, value }: { label: string; value: string }) => (
    <div className='border-outline-gray flex items-center justify-between border-b py-4'>
      <p className='text-sub-text-gray'>{label}</p>
      <p className='text-main-text-navy font-semibold'>{value}</p>
    </div>
  );

  return (
    <div className='bg-bg-white shadow-light w-full rounded-lg p-6'>
      <h3 className='text-main-text-navy text-2xl font-semibold'>일정 요약</h3>
      <div className='mt-4'>
        <SummaryItem label='여행기간' value={`${duration}일`} />
        <SummaryItem label='총 장소' value={`${totalPlaces}개`} />
        <SummaryItem label='배치 완료' value={`${completedPlaces}개`} />
        <Summary_Item_Without_Border label='진행률' value={`${progress}%`} />
      </div>
    </div>
  );
};

// 마지막 항목은 밑줄이 없으므로 별도의 컴포넌트로 만듭니다.
const Summary_Item_Without_Border = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className='flex items-center justify-between pt-4'>
    <p className='text-sub-text-gray'>{label}</p>
    <p className='text-main-text-navy font-semibold'>{value}</p>
  </div>
);

export default TripSummary;
