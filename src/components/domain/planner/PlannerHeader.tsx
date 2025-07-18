const PlannerHeader = () => {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-2xl font-bold text-gray-800'>내 플래너</h1>
      <button className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
        + 새 플래너 만들기
      </button>
    </div>
  );
};

export default PlannerHeader;
