import Container from '@/components/common/Container';
import Tag from '@/components/domain/regions/Tag';
import { useLocation } from 'react-router';

type ListPageLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const ListPageLayout = ({ title, subtitle, children }: ListPageLayoutProps) => {
  const location = useLocation();
  const showTag = location.pathname !== '/explore/districts';

  return (
    <div className='flex flex-grow flex-col'>
      <section>
        <Container className='py-8'>
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
