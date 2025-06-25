const TravelPlanPage = () => {
  const travelPlans = [
    {
      id: 1,
      title: '경주 1박 2일 여행',
      date: '2025-07-11 ~ 2025-07-12',
      description: '맛집 탐방과 4발 자전거 코스 돌기!마작도, 술도 고기도! ',
    },
    {
      id: 2,
      title: '면접 보러가기,',
      date: '2025-07-01 ~',
      description: '두근두근 설렘설렘',
    },
  ];

  return (
    <div>
      <h2 className='mb-4 text-xl font-semibold'>내 여행일정</h2>
      <div className='space-y-4'>
        {travelPlans.map((plan) => (
          <div
            key={plan.id}
            className='rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md'
          >
            <h3 className='mb-1 text-lg font-bold'>{plan.title}</h3>
            <p className='mb-1 text-sm text-gray-500'>{plan.date}</p>
            <p className='text-sm text-gray-700'>{plan.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelPlanPage;
