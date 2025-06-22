import { Outlet } from 'react-router';

const defaultLayout = () => {
  return (
    <div className='bg-bg-white text-main-text-navy font-pretendard flex w-full items-center justify-center'>
      <div className='w-[1440px]'>
        <Outlet />
      </div>
    </div>
  );
};

export default defaultLayout;
