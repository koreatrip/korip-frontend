import Container from '@/components/common/Container';
import DistrictCard from '@/components/domain/regions/DistrictCard';
import Tag from '@/components/domain/regions/Tag';
import { useTranslation } from 'react-i18next';

const DistrictListPage = () => {
  const { t } = useTranslation();
  return (
    <div className='flex flex-grow flex-col'>
      {/* 상단 흰색 섹션 */}
      <section>
        <Container className='py-8'>
          <h1 className='mb-4 text-4xl font-semibold'>
            {t('places.explore_all_areas')}
          </h1>
          <Tag />
          <div className='text-main-text-navy mt-4'>
            {t('places.total_districts')}
          </div>
        </Container>
      </section>
      <section className='bg-bg-section w-full flex-grow pt-8 pb-16'>
        <Container>
          {/* 반응형 그리드로 수정 */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
            <DistrictCard />
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DistrictListPage;
