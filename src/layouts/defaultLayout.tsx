import Header from '@/components/common/Header';
import LanguageRedirect from '@/components/common/LanguageRedirect';
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
      <LanguageRedirect>
        <div className='bg-bg-white text-main-text-navy font-pretendard min-h-screen'>
          <Header variant={headerVariant} />
          <main className='flex flex-col'>
            <Outlet />
          </main>
        </div>
      </LanguageRedirect>
    </ToastProvider>
  );
};

export default defaultLayout;
