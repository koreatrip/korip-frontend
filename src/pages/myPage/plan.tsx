const TravelPlanPage = () => {
  const travelPlans = [
    {
      id: 1,
      title: '서울 3박 4일 여행',
      date: '2025-07-10 ~ 2025-07-13',
      description: '맛집 탐방과 한강 자전거 코스 돌기!',
    },
    {
      id: 2,
      title: '제주도 2박 3일 여행',
      date: '2025-08-01 ~ 2025-08-03',
      description: '오름 등반, 바다 드라이브, 흑돼지 먹기',
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
