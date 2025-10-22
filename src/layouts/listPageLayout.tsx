import Container from '@/components/common/Container';
import Tag from '@/components/domain/regions/Tag';
import { useLocation } from 'react-router';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

type ListPageLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
};

const ListPageLayout = ({
  title,
  subtitle,
  children,
  showBackButton = false,
  onBack,
}: ListPageLayoutProps) => {
  const location = useLocation();
  const showTag =
    location.pathname !== '/explore/districts' &&
    location.pathname !== '/explore/stays';

  return (
    <div className='flex h-screen flex-grow flex-col'>
      <section>
        <Container className='py-8'>
          {/* 뒤로가기 버튼 */}
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className='mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900'
              aria-label='뒤로가기'
            >
              <ChevronLeftIcon className='h-5 w-5' />
              <span>뒤로가기</span>
            </button>
          )}

          <h1 className='mb-4 text-4xl font-semibold'>{title}</h1>
          {showTag && <Tag />}
          <div className='text-main-text-navy mt-4'>{subtitle}</div>
        </Container>
      </section>

      <section className='bg-bg-section w-full flex-grow pt-8 pb-16'>
        <Container>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {children}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ListPageLayout;
