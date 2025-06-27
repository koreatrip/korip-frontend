import SearchHeader from '@/components/header/SearchHeader';
import { Outlet } from 'react-router';

const SearchLayout = () => {
  return (
    <div className='bg-bg-white text-main-text-navy font-pretendard flex w-full items-center justify-center'>
      <div className='w-[1440px]'>
        <SearchHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default SearchLayout;
