import Header from '@/components/common/Header';
import { ToastProvider } from '@/context/ToastContextProvider';
import { Outlet, useLocation } from 'react-router';

const defaultLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  let headerVariant: 'default' | 'search' = 'default';
  if (currentPath.includes('/explore') || currentPath.startsWith('/search')) {
    headerVariant = 'search';
  }
  return (
    <ToastProvider>
      <div className='bg-gray-50 text-main-text-navy font-pretendard flex min-h-screen flex-col'>
        <Header variant={headerVariant} />
        <main className='flex flex-grow flex-col'>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
};

export default defaultLayout;
