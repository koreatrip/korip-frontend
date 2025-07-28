const PlannerAddButtonMini = () => {
  return (
    <button className='flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B7A] text-white transition-all duration-200 hover:bg-[#ff5a6b]'>
      <svg
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        strokeWidth={2.5}
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M12 4.5v15m7.5-7.5h-15'
        />
      </svg>
    </button>
  );
};

export default PlannerAddButtonMini;
