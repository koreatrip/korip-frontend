const PlannerAddButton = () => {
  return (
    <div className='flex h-full items-center justify-center'>
      <button className='flex h-[177px] w-[177px] flex-col items-center justify-center rounded-full bg-gray-200 transition-colors duration-200 hover:bg-gray-300'>
        <svg
          className='h-[91px] w-[91px] text-white'
          fill='none'
          stroke='currentColor'
          strokeWidth={3}
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4.5v15m7.5-7.5h-15'
          />
        </svg>
      </button>
    </div>
  );
};

export default PlannerAddButton;
